import { Component, OnInit, Input, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { ProgressSpinnerMode, ThemePalette } from '@angular/material';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';


@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit {
  @Input() color?: ThemePalette = 'primary';
  @Input() diameter?: number = 100;
  @Input() mode?: ProgressSpinnerMode = 'indeterminate';
  @Input() strokeWidth?: number;
  @Input() value?: number;
  @Input() backdropEnabled = true;
  @Input() globallyCentered = true;
  @Input() displayProgressSpinner: boolean;

  @ViewChild(TemplateRef, { static: false })
  private spinnerRef: TemplateRef<any>;

  private templatePortal: TemplatePortal;

  private overlayRef: OverlayRef;

  constructor(private viewContainerRef: ViewContainerRef, private overlay: Overlay) {}

  ngOnInit() {
    let config: OverlayConfig = { hasBackdrop: this.backdropEnabled };
    if (this.globallyCentered) {
      config.positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
    }
    this.overlayRef = this.overlay.create(config);
  }

  ngAfterViewInit() {
    this.templatePortal = new TemplatePortal(this.spinnerRef, this.viewContainerRef);
  }

  show(): void {
    this.overlayRef.attach(this.templatePortal);
  }

  hide(): void {
    this.overlayRef.detach();
  }
}
