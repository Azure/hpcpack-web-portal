import { Component, Directive, Input, HostListener } from '@angular/core';
import { ProgressSpinnerMode, ThemePalette } from '@angular/material';


@Component({ selector: 'router-outlet', template: '' })
export class RouterOutletStubComponent {}

@Directive({
  selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Component({ selector: 'mat-progress-spinner', template: '' })
export class MatProgressSpinnerStub {
  @Input() color: ThemePalette;
  @Input() diameter: number;
  @Input() mode: ProgressSpinnerMode;
  @Input() strokeWidth: number;
  @Input() value: number;
}

@Component({ selector: 'app-progress-spinner', template: '' })
export class ProgressSpinnerComponentStub {
  show(): void {}
  hide(): void {}
}