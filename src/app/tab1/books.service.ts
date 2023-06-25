import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface BookData {
  author: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private _books = new BehaviorSubject<Book[]>([]);
  get books() {
    return this._books.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBook(id: string): Book {
    return {
      id: 'b2',
      author: 'John Doe',
      title: 'Sample Book',
    };
  }

  addBook(author: string, title: string) {
    let generatedId: string;

    return this.http
      .post<{ name: string }>(
        `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/books.json?auth=${this.authService.getToken()}`,
        { author, title }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.books;
        }),
        take(1),
        tap((books) => {
          this._books.next(
            books.concat({
              id: generatedId,
              author,
              title,
            })
          );
        })
      );
  }

  getBooks() {
    return this.http
      .get<{ [key: string]: BookData }>(
        `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/books.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        map((booksData) => {
          const books: Book[] = [];
          for (const key in booksData) {
            books.push({
              id: key,
              author: booksData[key].author,
              title: booksData[key].title,
            });
          }
          return books;
        }),
        tap((books) => {
          this._books.next(books);
          console.log('service:');
          console.log(books); // Check if the array is populated correctly
        })
      );
  }
}
