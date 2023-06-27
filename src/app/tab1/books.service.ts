import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface BookData {
  author: string;
  comments: Comment[];
  genre: string;
  rating: number;
  readers: Reader[];
  title: string;
}

interface Comment {
  username: string;
  text: string;
}

interface Reader {
  username: string;
  rating: number;
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

  addBook(author: string, genre: string, rating: number, title: string) {
    let generatedId: string;
    const username = this.authService.getUsername();
    const newReader = {
      username: username,
      rating: rating,
    };

    return this.http
      .post<{ name: string }>(
        `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/books.json?auth=${this.authService.getToken()}`,
        { author, genre, rating, title, readers: [newReader] }
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
              comments: [],
              genre,
              rating,
              readers: [newReader],
              title,
            })
          );
        })
      );
  }

  getBooks(username: string) {
    return this.http
      .get<{ [key: string]: BookData }>(
        `https://booknote-mr-default-rtdb.europe-west1.firebasedatabase.app/books.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        map((booksData) => {
          const books: Book[] = [];
          for (const key in booksData) {
            const book: Book = {
              id: key,
              author: booksData[key].author,
              comments: booksData[key].comments
                ? [...booksData[key].comments]
                : [],
              genre: booksData[key].genre,
              rating: booksData[key].rating,
              readers: booksData[key].readers
                ? [...booksData[key].readers]
                : [],
              title: booksData[key].title,
            };

            if (book.readers.some((reader) => reader.username === username)) {
              books.push(book);
            }
          }
          return books;
        }),
        tap((books) => {
          this._books.next(books);
        })
      );
  }

  updateBook(book: Book) {
    const { id, author, comments, genre, rating, readers, title } = book;
    const bookData: BookData = {
      author,
      comments,
      genre,
      rating,
      readers,
      title,
    };

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
