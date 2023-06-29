import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  defaultEmail: string = '';
  defaultPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async onLogin(loginForm: NgForm) {
    if (loginForm.valid) {
      this.authService.logIn(loginForm.value).subscribe(
        (resData) => {
          console.log('logovanje uspelo');
          console.log(resData);
          this.router.navigateByUrl('tabs/tab1');
          console.log(this.authService);
        },
        (error) => {
          this.presentToast('Failed to log in');
        }
      );
    } else {
      this.presentToast('Invalid form');
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });
    toast.present();
  }
}
