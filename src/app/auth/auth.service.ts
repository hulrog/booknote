import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs';
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
  email: string;
  password: string;
  username: string;
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
    this.user = new User('', '', '', '', null);
    console.log(`Constructor activated! Instance ID: ${this.instanceId}`);
  }

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  register(user: UserData) {
    this._isUserAuthenticated = true;
    const { email, password, username } = user;
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.webAPIKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        switchMap((authResponse) => {
          const userId = authResponse.localId;
          const userData = {
            email,
            userId,
            username,
          };
          return this.http
            .put(
              `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${authResponse.idToken}`,
              userData
            )
            .pipe(
              switchMap(() => {
                //loguje usera automatski nakon registracije
                return this.logIn(user);
              })
            );
        })
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
        switchMap((authResponse) => {
          const userId = authResponse.localId;
          const getUserUrl = `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`;

          return this.http.get<{ username: string }>(getUserUrl).pipe(
            map((userData) => {
              const expirationTime = new Date(
                new Date().getTime() + +authResponse.expires * 1000
              );
              return {
                userId: authResponse.localId,
                email: authResponse.email,
                username: userData.username,
                token: authResponse.idToken,
                expirationDate: expirationTime,
              };
            })
          );
        }),
        tap((user) => {
          this.user = new User(
            user.userId,
            user.email,
            user.username,
            user.token,
            user.expirationDate
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

  getUserEmail() {
    return this.user.email;
  }

  getUsername() {
    return this.user.username;
  }
}
