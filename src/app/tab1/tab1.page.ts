import { Component, OnInit } from '@angular/core';
import { BooksService } from './books.service';
import { Book } from './book.model';
import { ModalController } from '@ionic/angular';
import { AddBookModalComponent } from '../add-book-modal/add-book-modal.component';
import { UpdateBookModalComponent } from '../update-book-modal/update-book-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  books: Book[] = [];
  author: string = '';
  title: string = '';

  constructor(
    private booksService: BooksService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.booksService.getBooks().subscribe((books) => {
      this.books = books;
    });
  }

  addBook() {
    this.booksService.addBook(this.author, this.title).subscribe(() => {
      this.author = '';
      this.title = '';
    });
  }

  async openAddBookModal() {
    const modal = await this.modalController.create({
      component: AddBookModalComponent,
    });

    modal.onDidDismiss().then(() => {
      this.booksService.getBooks().subscribe((books) => {
        this.books = books;
      });
    });
    await modal.present();
  }

  async openUpdateBookModal(book: Book) {
    const modal = await this.modalController.create({
      component: UpdateBookModalComponent,
      componentProps: {
        book: book,
      },
    });

    modal.onDidDismiss().then(() => {
      this.booksService.getBooks().subscribe((books) => {
        this.books = books;
      });
    });

    await modal.present();
  }
}
