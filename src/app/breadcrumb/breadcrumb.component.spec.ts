import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterLinkDirectiveStub } from '../../test-stubs'
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RouterLinkDirectiveStub,
        BreadcrumbComponent
      ],
      providers: [
        { provide: Router, useValue: { events: of(true) } },
        { provide: ActivatedRoute, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
