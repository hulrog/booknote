import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BooksService } from '../tab1/books.service';

@Component({
  selector: 'app-add-book-modal',
  templateUrl: './add-book-modal.component.html',
  styleUrls: ['./add-book-modal.component.scss'],
})
export class AddBookModalComponent {
  author: string = '';
  title: string = '';

  constructor(
    private modalController: ModalController,
    private booksService: BooksService
  ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  addBook() {
    this.booksService.addBook(this.author, this.title).subscribe(() => {
      this.dismissModal();
    });
  }
}
