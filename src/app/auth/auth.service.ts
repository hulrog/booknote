import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expires: string;
  registered?: boolean;
}

export interface UserData {
  name?: string;
  surname?: string;
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isUserAuthenticated = false;
  private instanceId: number;
  constructor(private http: HttpClient) {
    this.instanceId = Date.now();
    console.log(`Constructor activated! Instance ID: ${this.instanceId}`);
  }

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  register(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.webAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    );
  }

  logIn(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.webAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    );
  }

  logOut() {
    this._isUserAuthenticated = false;
  }
}
