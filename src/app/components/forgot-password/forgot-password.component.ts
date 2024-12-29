import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ChangePassword, ForgotPasswordService } from '../../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  savedEmail = "";
  isLoading = false;

  forgotPasswordService = inject(ForgotPasswordService);
  router = inject(Router);

  // 1st form
  email = new FormControl<string>('', [Validators.email, Validators.required]);
  verifyEmailForm: FormGroup;
  state1 = true;


  // 2nd form
  otp = new FormControl<string>('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
  verifyOtpForm: FormGroup;
  state2 = false;

  // 3rd form
  password = new FormControl<string>('', [Validators.required, Validators.minLength(5)]);
  repeatPassword = new FormControl<string>('', [Validators.required, Validators.minLength(5)]);
  changePasswordForm: FormGroup;
  state3 = false;

  inlineNotification = {
    show: false,
    type: '',
    text: '',
  }

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.verifyEmailForm = this.formBuilder.group({
      email: this.email,
    });

    this.verifyOtpForm = this.formBuilder.group({
      otp: this.otp,
    });

    this.changePasswordForm = this.formBuilder.group({
      password: this.password,
      repeatPassword: this.repeatPassword,
    });
  }

  verifyEmail() {
    if(this.verifyEmailForm.valid) {
      this.isLoading = true;
      this.forgotPasswordService.verifyEmailService(this.verifyEmailForm.get('email')?.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log(response);
          this.savedEmail = this.verifyEmailForm.get('email')?.value;
          this.state1 = false;
          this.state2 = true;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        }
      });
    }
  }

  verifyOtp() {
    if(this.verifyOtpForm.valid) {
      this.isLoading = true;
      this.forgotPasswordService.verifyOtpService(this.verifyOtpForm.get('otp')?.value, this.savedEmail).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log(response);
          this.state2 = false;
          this.state3 = true;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        }
      });
    }
  }

  changePassword() {
    if(this.changePasswordForm.valid) {
      const changePassword: ChangePassword = {
        password: this.changePasswordForm.get('password')?.value,
        repeatPassword: this.changePasswordForm.get('repeatPassword')?.value,
      }

      this.isLoading = true;
      this.forgotPasswordService.changePasswordService(changePassword, this.savedEmail).subscribe({
        next:  (response) => {
          this.isLoading = false;
          console.log(response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        }
      })
    }
  }

}
