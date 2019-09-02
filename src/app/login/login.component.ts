import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  returnUrl: string;
  error: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(): void {
    this.authService.authenticate(this.username, this.password).subscribe({
      next: (ok) => {
        if (ok) {
          this.router.navigate([this.returnUrl]);
          this.error = null;
        }
        else {
          this.error = 'Invalid username or password!';
        }
      }
    });
  }
}
