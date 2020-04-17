import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs'
import { DefaultService, BASE_PATH, Configuration, NodeMetric, MetricData, NodeState, RestProperty, ClusterInfo } from '../api-client'
import { Node, INode } from '../models/node'
import { Job } from '../models/job'
import { Looper, ObservableCreator } from './looper.service'
import { map } from 'rxjs/operators';
import { Task } from '../models/task';
import { OperationLog } from '../models/operation-log';

export * from '../api-client'

export type NodeOperation = 'start' | 'stop' | 'reboot' | 'shutdown' | 'bringOnline' | 'takeOffline';

export type TaskOperation = 'cancel' | 'finish' | 'requeue';

export class ClusterSummary implements ClusterInfo {
  Host: string;

  SubscriptionId: string;

  DeploymentId: string;

  Location: string;

  Nodes: number;

  NodesOnAzure: number;

  BatchPools: number;

  Cores: number;

  Memory: number;

  TimeStamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService extends DefaultService {
  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    super(httpClient, basePath, configuration);
  }

  getClusterSummary(): Observable<ClusterSummary> {
    return new Observable<ClusterSummary>(subscriber => {
      let sub = forkJoin(this.getClusterInfo(), this.getClusterNodes()).subscribe(results => {
        let clusterInfo = results[0];
        let nodes = results[1];
        let summary = new ClusterSummary();
        summary.Host = location.hostname;
        summary.SubscriptionId = clusterInfo.SubscriptionId;
        summary.DeploymentId = clusterInfo.DeploymentId;
        summary.Location = clusterInfo.Location;
        summary.Nodes = nodes.length;
        let nodesOnAzure = 0;
        let batchPools = 0;
        let cores = 0;
        let memory = 0;
        for (let node of nodes) {
          if (node.OnAzure) {
            nodesOnAzure++;
          }
          if (node.Groups.indexOf('AzureBatchServicePools') >= 0) {
            batchPools++;
          }
          cores += node.Cores;
          memory += node.MemorySize;
        }
        summary.NodesOnAzure = nodesOnAzure;
        summary.BatchPools = batchPools;
        summary.Cores = cores;
        summary.Memory = memory;
        summary.TimeStamp = new Date();
        subscriber.next(summary);
      });
      return () => sub.unsubscribe();
    });
  }

  getAppVersion(): Observable<string> {
    return this.httpClient.get(`${this.basePath}/portal/version`, { responseType: 'text' }).pipe(map(text => text.trim()));
  }

  repeat<T>(operation: Observable<T> | ObservableCreator<T>, interval: number): Observable<T> {
    return new Observable<T>(subscriber => {
      let looper = Looper.start(
        operation,
        {
          next: (data) => {
            subscriber.next(data);
          },
          error: (err) => {
          //An error handler here will prevent an error from stopping the loop
          console.error(err);
          }
        },
        interval
      );
      return () => looper.stop();
    });
  }

  getClusterJobMetricsInLoop(updateInterval: number): Observable<MetricData> {
    return this.repeat(this.getClusterJobMetrics(), updateInterval);
  }

  getLatestClusterMetricInLoop(metric: string, timeWindow: number, updateInterval: number): Observable<MetricData> {
    let producer: ObservableCreator<MetricData> = () => {
      let to = Date.now();
      let from = to - timeWindow;
      return this.getClusterMetricHistory(metric, new Date(from), new Date(to));
    };
    return this.repeat(producer, updateInterval);
  }

  getNodeMetricsInLoop(metric: string, updateInterval: number): Observable<NodeMetric[]> {
    return new Observable<NodeMetric[]>(subscriber => {
      let looper = Looper.start(
        this.getClusterNodeMetrics(metric),
        {
          next: (data) => {
            subscriber.next(data);
          },
          //An error handler here will prevent an error from stopping the loop
          error: (err) => {
            console.error(err);
          }
        },
        updateInterval,
      );
      return () => looper.stop();
    });
  }

  doNodeOperationAndWatch(nodeName: string, operation: NodeOperation, targetState: NodeState, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return new Observable<Node>(subscriber => {
      let looper: Looper<INode>;
      let sub = this.operateClusterNode(nodeName, operation).subscribe(_ => {
        looper = Looper.start(
          this.getClusterNode(nodeName),
          {
            next: (data, looper) => {
              let node = Node.fromJson(data);
              subscriber.next(node);

              if (node.State === targetState) {
                looper.stop();
              }
            },
            stop: () => {
              subscriber.complete();
            }
          },
          updateInterval,
          updateExpiredIn
        );
      });
      return () => {
        sub.unsubscribe();
        if (looper) {
          looper.stop();
        }
      }
    });
  }

  bringNodeOnlineAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'bringOnline', 'Online', updateInterval, updateExpiredIn);
  }

  takeNodeOfflineAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'takeOffline', 'Offline', updateInterval, updateExpiredIn);
  }

  startNodeAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'start', 'Offline', updateInterval, updateExpiredIn);
  }

  stopNodeAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'stop', 'NotDeployed', updateInterval, updateExpiredIn);
  }

  //TODO: Is "Offline" the end state of reboot?
  rebootNodeAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'reboot', 'Offline', updateInterval, updateExpiredIn);
  }

  //TODO: What's the end state for shutdown?
  shutdownNodeAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'shutdown', 'Unknown', updateInterval, updateExpiredIn);
  }

  doJobOperationAndWatch(operation: Observable<any>, jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return new Observable<Job>(subscriber => {
      let looper: Looper<RestProperty[]>;
      let sub = operation.subscribe(_ => {
        looper = Looper.start(
          this.getJob(jobId),
          {
            next: (data, looper) => {
              let job = Job.fromProperties(data);
              subscriber.next(job);

              if (job.Ended) {
                looper.stop();
              }
            },
            stop: () => {
              subscriber.complete();
            }
          },
          updateInterval,
          updateExpiredIn
        );
        return () => looper.stop();
      });
      return () => {
        sub.unsubscribe();
        if (looper) {
          looper.stop();
        }
      }
    });
  }

  requeueJobAndWatch(jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return this.doJobOperationAndWatch(this.requeueJob(jobId), jobId, updateInterval, updateExpiredIn);
  }

  submitJobAndWatch(jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return this.doJobOperationAndWatch(this.submitJob(jobId), jobId, updateInterval, updateExpiredIn);
  }

  cancelJobAndWatch(jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return this.doJobOperationAndWatch(this.cancelJob(jobId), jobId, updateInterval, updateExpiredIn);
  }

  finishJobAndWatch(jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return this.doJobOperationAndWatch(this.finishJob(jobId), jobId, updateInterval, updateExpiredIn);
  }

  doTaskOperationAndWatch(operation: TaskOperation, taskId: string, updateInterval: number, updateExpiredIn: number): Observable<Task> {
    let action: Observable<any>;
    let watch: Observable<RestProperty[]>;
    let segments = taskId.split('.').map(e => Number(e));
    if (segments.length == 2) {
      watch = this.getTask(segments[0], segments[1]);
      switch (operation) {
        case 'cancel':
          action = this.cancelTask(segments[0], segments[1]);
          break;
        case 'finish':
          action = this.finishTask(segments[0], segments[1]);
          break;
        case 'requeue':
          action = this.requeueTask(segments[0], segments[1]);
          break;
        default:
          throw `Invalid operation "${operation}"!`;
      }
    }
    else if (segments.length == 3) {
      watch = this.getSubtask(segments[0], segments[1], segments[2]);
      switch (operation) {
        case 'cancel':
          action = this.cancelSubtask(segments[0], segments[1], segments[2]);
          break;
        case 'finish':
          action = this.finishSubtask(segments[0], segments[1], segments[2]);
          break;
        case 'requeue':
          action = this.requeueSubtask(segments[0], segments[1], segments[2]);
          break;
        default:
          throw `Invalid operation "${operation}"!`;
      }
    }
    else {
      throw `Invalid taskId "${taskId}"!`;
    }

    return new Observable<Task>(subscriber => {
      let looper: Looper<RestProperty[]>;
      let sub = action.subscribe(_ => {
        looper = Looper.start(
          watch,
          {
            next: (data, looper) => {
              let task = Task.fromProperties(data);
              subscriber.next(task);

              if (task.Ended) {
                looper.stop();
              }
            },
            stop: () => {
              subscriber.complete();
            }
          },
          updateInterval,
          updateExpiredIn
        );
        return () => looper.stop();
      });
      return () => {
        sub.unsubscribe();
        if (looper) {
          looper.stop();
        }
      }
    });
  }

  cancelTaskAndWatch(taskId: string, updateInterval: number, updateExpiredIn: number): Observable<Task> {
    return this.doTaskOperationAndWatch('cancel', taskId, updateInterval, updateExpiredIn);
  }

  finishTaskAndWatch(taskId: string, updateInterval: number, updateExpiredIn: number): Observable<Task> {
    return this.doTaskOperationAndWatch('finish', taskId, updateInterval, updateExpiredIn);
  }

  requeueTaskAndWatch(taskId: string, updateInterval: number, updateExpiredIn: number): Observable<Task> {
    return this.doTaskOperationAndWatch('requeue', taskId, updateInterval, updateExpiredIn);
  }

  getClusterOperationUntilDone(logId: string, updateInterval: number, updateExpiredIn: number): Observable<OperationLog> {
    return new Observable<OperationLog>(subscriber => {
      let looper = Looper.start(
        this.getClusterOperation(logId),
        {
          next: (data, looper) => {
            let obj = OperationLog.fromJson(data);
            let end = obj.State != 'Executing';
            subscriber.next(obj);
            if (end) {
              looper.stop();
            }
          },
          error: (err, looper) => {
            subscriber.error(err);
            looper.stop();
          },
          stop: () => {
            subscriber.complete();
          }
        },
        updateInterval,
        updateExpiredIn
      );
      return () => {
        looper.stop();
      }
    });
  }
}
