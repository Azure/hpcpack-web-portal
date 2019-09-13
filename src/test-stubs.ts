import { Component, Directive, Input, HostListener } from '@angular/core';

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
