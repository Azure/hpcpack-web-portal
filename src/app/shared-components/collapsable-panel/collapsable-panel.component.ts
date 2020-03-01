import { Component, OnInit, Input, ViewChild, ContentChild, TemplateRef } from '@angular/core';
import { MatSidenavContainer } from '@angular/material';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { UserService } from 'src/app/services/user.service';
import { NodeOptions, NodeGroupOptions, JobOptions, TaskOptions } from 'src/app/models/user-options';

export interface ICollapsablePanelOptions {
  hideActionList?: boolean;

  save(): void;
}

export class CollapsablePanelOptions implements ICollapsablePanelOptions {
  constructor(
    private userService: UserService,
    private userOption: NodeOptions & NodeGroupOptions & JobOptions & TaskOptions,
  ) {}

  get hideActionList(): boolean {
    return this.userOption.hideActionList;
  }

  set hideActionList(value: boolean) {
    this.userOption.hideActionList = value;
  }

  save(): void {
    this.userService.saveUserOptions();
  }
}

export class SimpleCollapsablePanelOptions implements ICollapsablePanelOptions {
  hideActionList: boolean;

  save(): void {}
}

@Component({
  selector: 'app-collapsable-panel',
  templateUrl: './collapsable-panel.component.html',
  styleUrls: ['./collapsable-panel.component.scss']
})
export class CollapsablePanelComponent implements OnInit {
  @Input()
  options: ICollapsablePanelOptions = new SimpleCollapsablePanelOptions();

  @ViewChild(MatSidenavContainer, { static: true })
  private sidenavContainer: MatSidenavContainer;

  @ContentChild('side', { static: false })
  sideTemplate: TemplateRef<any>;

  @ContentChild('main', { static: false })
  mainTemplate: TemplateRef<any>;

  constructor(
    private mediaQuery: MediaQueryService,
  ) { }

  ngOnInit() {
  }

  get actionListHidden(): boolean {
    return this.options.hideActionList !== undefined ? this.options.hideActionList :
      (this.mediaQuery.smallWidth ? true: false);
  }

  set actionListHidden(val: boolean) {
    this.options.hideActionList = val;
    this.options.save();
  }

  toggleActionList(): void {
    this.actionListHidden = !this.actionListHidden;
    setTimeout(() => this.sidenavContainer.updateContentMargins(), 0);
  }

  get toggleActionListIcon(): string {
    return this.actionListHidden ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
  }
}
