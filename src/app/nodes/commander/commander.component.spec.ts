import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MaterialModule } from '../../material.module'
import { BASE_PATH } from '../../services/api.service'
import { UserService } from '../../services/user.service'
import { RemoteCommandService } from '../../services/remote-command.service'
import { CommanderComponent } from './commander.component';

describe('CommanderComponent', () => {
  let component: CommanderComponent;
  let fixture: ComponentFixture<CommanderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule, MaterialModule, ReactiveFormsModule ],
      declarations: [ CommanderComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: ['a', 'b', 'c'] },
        { provide: FormBuilder, useValue: { control: (x: string) => {} } },
        { provide: BASE_PATH, useValue: '/' },
        { provide: UserService, useValue: { user: {}} },
        //{ provide: RemoteCommandService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommanderComponent);
    component = fixture.componentInstance;
    //TODO: uncomment the following line:
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
