import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemSelectorComponent } from './list-item-selector.component';

describe('ListItemSelectorComponent', () => {
  let component: ListItemSelectorComponent;
  let fixture: ComponentFixture<ListItemSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
