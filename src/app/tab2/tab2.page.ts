import { Component, OnInit } from '@angular/core';
import { Book } from '../tab1/book.model';
import { BooksService } from '../tab1/books.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  usersWithBooks: { username: string; books: Book[] }[] = [];
  filteredUsers: { username: string; books: Book[] }[] = [];
  searchTerm: string = '';

  constructor(
    private booksService: BooksService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
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

  sortUsersByBookCount() {
    this.usersWithBooks.sort((a, b) => b.books.length - a.books.length);
  }

  filterUsers() {
    this.filteredUsers = this.usersWithBooks.filter((user) => {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      return (
        this.matchesSearchTerm(user.username) ||
        user.books.some(
          (book) =>
            this.matchesSearchTerm(book.title) ||
            this.matchesSearchTerm(book.author)
        )
      );
    });
  }

  matchesSearchTerm(text: string): boolean {
    return text.toLowerCase().includes(this.searchTerm.toLowerCase());
  }
}
