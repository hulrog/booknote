import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface BookData {
  author: string;
  genre: string;
  rating: number;
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
      id: 'neki-id-123',
      genre: 'Fantasy',
      rating: 5,
      author: 'J.R.R Tolkien',
      title: 'Lor of the Rings',
    };
  }

  addBook(author: string, genre: string, rating: number, title: string) {
    let generatedId: string;

    return this.http
      .post<{ name: string }>(
        `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/books.json?auth=${this.authService.getToken()}`,
        { author, genre, rating, title }
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
              genre,
              rating,
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
              genre: booksData[key].genre,
              rating: booksData[key].rating,
              title: booksData[key].title,
            });
          }
          return books;
        }),
        tap((books) => {
          this._books.next(books);
        })
      );
  }

  updateBook(
    id: string,
    author: string,
    genre: string,
    rating: number,
    title: string
  ) {
    const bookData: BookData = { author, genre, rating, title };

    return this.http.put(
      `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json?auth=${this.authService.getToken()}`,
      bookData
    );
  }

  deleteBook(id: string) {
    return this.http
      .delete(
        `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        switchMap(() => {
          return this.books;
        }),
        take(1),
        tap((books) => {
          this._books.next(books.filter((book) => book.id !== id));
        })
      );
  }
}
