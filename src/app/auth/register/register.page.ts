import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  // TODO za polje username:
  // napraviti kolekciju users u realtime database-u gde ce se pratiti ostali podaci o useru
  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/.*[0-9].*/),
      ]),
      passwordConfirm: new FormControl(null, [Validators.required]),
    });
  }

  async onRegister() {
    if (this.registerForm && this.registerForm.valid) {
      const password = this.registerForm.get('password')?.value;
      const passwordConfirm = this.registerForm.get('passwordConfirm')?.value;

      if (password !== passwordConfirm) {
        const toast = await this.toastController.create({
          message: 'Passwords do not match',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
        return;
      }

      console.log(this.registerForm);
      this.authService
        .register(this.registerForm.value)
        .subscribe((resData) => {
          this.router.navigateByUrl('/tabs/tab1');
          console.log('registration successful');
          console.log(resData);
        });
    } else {
      const toast = await this.toastController.create({
        message: 'Form is invalid',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      return;
    }
  }
}
