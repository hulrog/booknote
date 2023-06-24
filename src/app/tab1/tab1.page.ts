import { Component, OnInit } from '@angular/core';
import { BooksService } from './books.service';
import { Book } from './book.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  books: Book[] = [];
  author: string = '';
  title: string = '';

  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.booksService.getBooks().subscribe((books) => {
      this.books = books;
    });
  }

  addBook() {
    this.booksService.addBook(this.author, this.title).subscribe();
    this.author = '';
    this.title = '';
  }
}
