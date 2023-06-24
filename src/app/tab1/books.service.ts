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
    const userId = this.authService.getUserId();
    let generatedId: string;

    return this.http
      .post<{ name: string }>(
        `https://your-firebase-project.firebaseio.com/books.json?auth=${this.authService.getToken()}`,
        { author, title, userId }
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
    //     return this.http
    //       .get<{ [key: string]: BookData }>(
    //         `https://your-firebase-project.firebaseio.com/books.json?auth=${this.authService.getToken()}`
    //       )
    //       .pipe(
    //         map((booksData) => {
    //           const books: Book[] = [];

    //           for (const key in booksData) {
    //             books.push({
    //               id: key,
    //               author: booksData[key].author,
    //               title: booksData[key].title,
    //             });
    //           }

    //           return books;
    //         }),
    //         tap((books) => {
    //           this._books.next(books);
    //         })
    //       );
    //   }
    const mockedBooks: Book[] = [
      {
        id: '1',
        author: 'John Doe',
        title: 'Sample Book 1',
      },
      {
        id: '2',
        author: 'Jane Smith',
        title: 'Sample Book 2',
      },
      {
        id: '3',
        author: 'George R.R. Martin',
        title: 'A Game of Thrones',
      },
    ];

    this._books.next(mockedBooks);
    return this.books;
  }
}
