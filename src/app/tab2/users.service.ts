import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface UserData {
  email: string;
  userId: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _users = new BehaviorSubject<UserData[]>([]);
  get users() {
    return this._users.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers() {
    return this.http
      .get<{ [key: string]: UserData }>(
        `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        map((responseData) => {
          const users: UserData[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              users.push({ ...responseData[key] });
            }
          }
          return users;
        }),
        tap((users) => {
          this._users.next(users);
        })
      );
  }
}
