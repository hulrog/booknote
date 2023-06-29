import { Component, OnInit } from '@angular/core';
import { Book } from '../tab1/book.model';
import { BooksService } from '../tab1/books.service';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  usersWithBooks: { username: string; books: Book[] }[] = [];
  filteredUsers: { username: string; books: Book[] }[] = [];
  userSearchTerm: string = '';
  bookSearchTerm: string = '';
  likedBooks: string[] = [];

  constructor(
    private authService: AuthService,
    private booksService: BooksService,
    private usersService: UsersService
  ) {}

  ionViewWillEnter() {
    this.fetchUsersWithBooks();
  }

  ionViewDidLeave() {
    this.clearUsersWithBooks();
  }

  fetchUsersWithBooks() {
    this.usersService.getUsers().subscribe((users) => {
      for (const user of users) {
        this.booksService.getBooks(user.username).subscribe((books) => {
          this.usersWithBooks.push({ username: user.username, books });
          this.filteredUsers = this.usersWithBooks;
          this.sortUsersByBookCount();
        });
      }
    });
  }

  clearUsersWithBooks() {
    this.usersWithBooks = [];
    this.filteredUsers = [];
    this.likedBooks = [];
  }

  sortUsersByBookCount() {
    this.usersWithBooks.sort((a, b) => b.books.length - a.books.length);
  }

  // Ova funkcije ne iskljucuje prikaz knjiga, samo prikaz korisnika koji nemaju knjige
  // i takodje filtrira korisnike po korisnickom imenu tj. izbacuje ih iz niza ako nisu to
  filterUsersAndBooks() {
    const lowerCaseUserSearchTerm = this.userSearchTerm.toLowerCase();
    const lowerCaseBookSearchTerm = this.bookSearchTerm.toLowerCase();

    // Izbacuje iz niza korisnike koji nisu searchovani
    this.filteredUsers = this.usersWithBooks.filter((user) => {
      const matchesUser = user.username
        .toLowerCase()
        .includes(lowerCaseUserSearchTerm);

      // Provera da li prikazani korisnici sadrze unetu knjigu
      if (lowerCaseBookSearchTerm === '') {
        return matchesUser;
      } else {
        const matchesBook = user.books.some(
          (book) =>
            book.title.toLowerCase().includes(lowerCaseBookSearchTerm) ||
            book.author.toLowerCase().includes(lowerCaseBookSearchTerm)
        );

        return matchesUser && matchesBook; // Ne prikazuje korisnike koji nemaju knjige
      }
    });
  }

  // Ova funkcija iskljucuje sam prikaz knjiga za one koji ne matchuju search
  matchesSearchTerm(text: string): boolean {
    return text.toLowerCase().includes(this.bookSearchTerm.toLowerCase());
  }

  likeBook(book: Book) {
    const username = this.authService.getUsername();
    const reader = { username: username, rating: 0 };
    book.readers.push(reader);
    this.booksService.updateBook(book).subscribe(() => {
      this.disableLikeButtons(book.id);
    });
  }

  disableLikeButtons(bookId: string) {
    if (!this.likedBooks.includes(bookId)) {
      this.likedBooks.push(bookId);
    }
  }

  isReader(book: Book): boolean {
    const username = this.authService.getUsername();
    return book.readers.some((reader) => reader.username === username);
  }
}
