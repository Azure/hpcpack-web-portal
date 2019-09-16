import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  returnUrl: string;
  userCred: FormGroup;
  error: string;

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

  login(): void {
    this.spinner.show();
    this.authService.authenticate(this.userCred.value.username, this.userCred.value.password).subscribe({
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
}
