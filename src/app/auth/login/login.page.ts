import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // TODO - izbaciti default vrednosti
  defaultEmail: string = '3user@gmail.com';
  defaultPassword: string = '3user123';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogin(loginForm: NgForm) {
    console.log(loginForm);
    if (loginForm.valid) {
      this.authService.logIn(loginForm.value).subscribe((resData) => {
        console.log('logovanje uspelo');
        console.log(resData);
        this.router.navigateByUrl('tabs/tab1');
        console.log(this.authService);
      });
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
