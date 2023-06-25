import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BooksService } from '../tab1/books.service';
import { Book } from '../tab1/book.model';

@Component({
  selector: 'app-update-book-modal',
  templateUrl: './update-book-modal.component.html',
  styleUrls: ['./update-book-modal.component.scss'],
})
export class UpdateBookModalComponent {
  @Input() book!: Book;
  author: string = '';
  genre: string = '';
  rating: number = 0;
  title: string = '';

  constructor(
    private modalController: ModalController,
    private booksService: BooksService
  ) {}

  ngOnInit() {
    // Kroz parametar dobija polja koja se prepopulisu
    this.author = this.book.author;
    this.genre = this.book.genre;
    this.rating = this.book.rating;
    this.title = this.book.title;
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  updateBook() {
    this.booksService
      .updateBook(
        this.book.id,
        this.author,
        this.genre,
        this.rating,
        this.title
      )
      .subscribe(() => {
        this.dismissModal();
      });
  }

  deleteBook() {
    this.booksService.deleteBook(this.book.id).subscribe(() => {
      this.dismissModal();
    });
  }

  // Iste funkcije kao u modalu za add
  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  starIconName(star: number): string {
    return star <= this.rating ? 'star' : 'star-outline';
  }
  selectRating(rating: number): void {
    this.rating = rating;
  }
}
