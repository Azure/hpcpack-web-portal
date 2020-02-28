import { NgModule, Component, Directive, Input, HostListener } from '@angular/core';
import { ProgressSpinnerMode, ThemePalette } from '@angular/material';


@Component({ selector: 'router-outlet', template: '' })
export class RouterOutletComponentStub {}

@Directive({
  selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
  @Input('routerLink')
  linkParams: any;

  @Input()
  queryParams: any;

  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Directive({
  selector: '[routerLinkActive]',
  exportAs: 'routerLinkActive'
})
export class RouterLinkActiveDirectiveStub {
  @Input()
  routerLinkActiveOptions: {
    exact: boolean;
  }
}

const ngStubs = [
  RouterOutletComponentStub,
  RouterLinkDirectiveStub,
  RouterLinkActiveDirectiveStub,
]

@NgModule({
  declarations: ngStubs,
  exports: ngStubs,
})
export class AngularStubs {}

@Component({ selector: 'app-progress-spinner', template: '' })
export class ProgressSpinnerComponentStub {
  show(): void {}
  hide(): void {}
}

@Component({ selector: 'app-list-item-selector', template: '' })
export class ListItemSelectorComponentStub {
  @Input() selected: string[] = [];
  @Input() unselected: string[] = [];
}

export class MatDialogRefStub<T> {
  close() {}
}

@Directive({
  selector: '[baseChart]'
})
export class BaseChartDirectiveStub {
  @Input('chartType') chartType: string;

  @Input('options') options: any;

  @Input('labels') labels: any;

  @Input('colors') colors: any;

  @Input('data') data: any;

  @Input('datasets') datasets: any;
}