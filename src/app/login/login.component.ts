import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs'
import { AuthService } from '../services/auth.service';
import { ProgressSpinnerComponent } from '../shared-components/progress-spinner/progress-spinner.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  returnUrl: string;
  userCred: FormGroup;
  error: string;
  hidePassword: boolean = true;
  private subscription: Subscription;

  @ViewChild(ProgressSpinnerComponent, { static: false })
  private spinner: ProgressSpinnerComponent;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.userCred = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private reset(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.error = null;
  }

  login(): void {
    this.reset();
    this.spinner.show();
    this.subscription = this.authService.authenticate(this.userCred.value.username, this.userCred.value.password).subscribe({
      next: (ok) => {
        this.spinner.hide();
        if (ok) {
          this.router.navigate([this.returnUrl]);
          this.error = null;
        }
        else {
          this.error = 'Invalid username or password!';
        }
      },
      error: (err) => {
        this.spinner.hide();
      }
    });
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
