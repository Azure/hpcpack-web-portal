import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs'

import { BASE_PATH } from './api.service'
import { UserService } from './user.service'
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RemoteCommandService {
  constructor(
    @Inject(BASE_PATH) private basePath: string,
    private userService: UserService,
  ) {
    this.setupJQuery();
    this.userService.onAuthStateChange = (authenticated) => {
      if (authenticated) {
        this.setupJQuery();
      }
      else {
        this.resetJQuery();
      }
    }
  }

  private setupJQuery(): void {
    //NOTE: SignalR client relies on jQuery for XHR and thus auth header. However,
    //there's no way for WS auth, so SignalR falls back to Long Poll!
    $.ajaxSetup({
      headers: {
        'Authorization': this.basicAuthHeader
      }
    });
  }

  private resetJQuery(): void {
    $.ajaxSetup({
      headers: {}
    });
  }

  private get basicAuthHeader(): string {
    let v = `${this.userService.user.username}:${this.userService.user.password}`;
    return `Basic ${btoa(v)}`;
  }

  create(cmd: string, nodes: string[]): RemoteCommand {
    return new RemoteCommand(this.basePath, cmd, nodes);
  }
}

export interface CommandOutput {
  jobId: number;
  nodeName: string;
  line: string;
  eof: boolean;
  error: boolean;
}

export class RemoteCommand {
  private connection: SignalR.Hub.Connection;

  private proxy: SignalR.Hub.Proxy;

  private jobId: number;

  constructor(private basePath: string, private cmd: string, private nodes: string[]) {}

  start(output?: (output: CommandOutput) => void, errorOut?: (error: string) => void): void {
    if (this.connection) {
      return;
    }
    this.connection = $.hubConnection(this.basePath);
    this.proxy = this.connection.createHubProxy('CommandHub');

    if (output) {
      this.proxy.on('OutputLine', (jobId: number, nodeName: string, line: string, eof: boolean, error: boolean) => {
        output({ jobId, nodeName, line, eof, error });
      });
    }
    if (errorOut) {
      this.connection.error((err: any) => errorOut(err));
    }
    let result = this.connection.start()
      .then(() => this.proxy.invoke('CreateCommand', this.cmd, this.nodes))
      .then((jobId) => { this.jobId = jobId; return this.proxy.invoke('StartCommand', jobId); });
    if (errorOut) {
      result.catch((err) => errorOut(err));
    }
  }

  cancel(): void {
    if (this.jobId) {
      this.proxy.invoke('CancelCommand', this.jobId);
    }
  }

  disconnect(): void {
    if (this.connection) {
      this.connection.stop(true, true);
    }
  }
}
