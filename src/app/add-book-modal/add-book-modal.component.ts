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
  genre: string = '';
  rating: number = 0;
  title: string = '';

  constructor(
    private modalController: ModalController,
    private booksService: BooksService
  ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  addBook() {
    this.booksService
      .addBook(this.author, this.genre, this.rating, this.title)
      .subscribe(() => {
        this.dismissModal();
      });
  }

  // Funkcije za ocenu knjige
  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  // Ako je manja od ratinga onda obojena - ako nije onda samo outline
  starIconName(star: number): string {
    return star <= this.rating ? 'star' : 'star-outline';
  }
  selectRating(rating: number): void {
    this.rating = rating;
  }
}
