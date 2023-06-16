import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import { User } from './user.model';

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
  username?: string;
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isUserAuthenticated = false;
  private instanceId: number;
  private user: User;
  constructor(private http: HttpClient) {
    this.instanceId = Date.now();
    this.user = new User('', '', '', null);
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
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.webAPIKey}`,
        { email: user.email, password: user.password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          // token istice za
          // sadasnje vreme u miliseknduma +
          // istek (po defaultu u firebasu 3600 sekundi * 1000 u miliseknduma)
          // + operator konvertuje string u broj jer je "3600" string
          const expirationTime = new Date(
            new Date().getTime() + +userData.expires * 1000
          );
          this.user = new User(
            userData.localId,
            userData.email,
            userData.idToken,
            expirationTime
          );
        })
      );
  }

  logOut() {
    this._isUserAuthenticated = false;
  }

  getToken() {
    return this.user.token;
  }

  getUserId() {
    return this.user.id;
  }
}
