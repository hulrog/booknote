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
  isAuthorEmpty: boolean = false;
  isCommentEmpty: boolean = false;
  isGenreEmpty: boolean = false;
  isTitleEmpty: boolean = false;
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
    if (this.author.trim().length === 0) this.isAuthorEmpty = true;
    if (this.genre.trim().length === 0) this.isGenreEmpty = true;
    if (this.title.trim().length === 0) this.isTitleEmpty = true;
    if (this.isAuthorEmpty || this.isTitleEmpty) return;

    this.isAuthorEmpty = false;
    this.isGenreEmpty = false;
    this.isTitleEmpty = false;
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
