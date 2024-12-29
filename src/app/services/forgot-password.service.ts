import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  public BASE_URL = "http://localhost:8080";

  http = inject(HttpClient);

  verifyEmailService(email: string): Observable<String> {
    return this.http.post<string>(`${this.BASE_URL}/forgotPassword/verifyMail/${email}`, null, {
      responseType: 'text' as 'json'
    });
  }

  verifyOtpService(otp: string, email: string): Observable<String> {
    console.log("OTP = ", otp);
    return this.http.post<string>(`${this.BASE_URL}/forgotPassword/verifyOtp/${otp}/${email}`, null, {
      responseType: 'text' as 'json'
    });
  }

  changePasswordService(changePassword: ChangePassword, email: string): Observable<String> {
    return this.http.post<string>(`${this.BASE_URL}/forgotPassword/changePassword/${email}`, changePassword, {
      responseType: 'text' as 'json'
    });
  }
}

export type ChangePassword = {
  password: string,
  repeatPassword: string,
}