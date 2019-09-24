import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemSelectorComponent } from './list-item-selector.component';
import { MaterialModule } from '../../material.module'

describe('ListItemSelectorComponent', () => {
  let component: ListItemSelectorComponent;
  let fixture: ComponentFixture<ListItemSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
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
