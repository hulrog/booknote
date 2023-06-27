import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BooksService } from '../tab1/books.service';
import { Book, Reader } from '../tab1/book.model';
import { AuthService } from '../auth/auth.service';

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
  readerRating: number = 0;
  title: string = '';

  constructor(
    private modalController: ModalController,
    private booksService: BooksService,
    private authService: AuthService
  ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    // Kroz parametar dobija polja koja se prepopulisu
    console.log(this.book);
    this.author = this.book.author;
    this.genre = this.book.genre;
    this.rating = this.book.rating;
    this.title = this.book.title;
    this.readerRating = this.getReaderRating();
  }

  getReaderRating(): number {
    const username = this.authService.getUsername();
    const reader = this.book.readers.find(
      (reader) => reader.username === username
    );
    return reader ? reader.rating : 0;
  }

  updateBook() {
    this.book.author = this.author;
    this.book.genre = this.genre;
    this.book.title = this.title;
    const updatedReaders = this.updateReaderRating();
    const averageRating = this.calculateAverageRating(updatedReaders);

    // Update the book object with the new values
    this.book.rating = averageRating;
    this.book.readers = updatedReaders;

    this.booksService.updateBook(this.book).subscribe(() => {
      this.dismissModal();
    });
  }

  updateReaderRating(): Reader[] {
    const username = this.authService.getUsername();
    return this.book.readers.map((reader) =>
      reader.username === username
        ? { username, rating: this.readerRating }
        : reader
    );
  }

  // Prosek se zaokruzuje na ceo broj da selektuje broj zvezdica
  calculateAverageRating(readers: Reader[]): number {
    let totalRatings = 0;
    for (const reader of readers) {
      totalRatings += reader.rating;
    }
    const averageRating = Math.round(totalRatings / readers.length);
    return averageRating;
  }

  deleteBook() {
    this.booksService.deleteBook(this.book.id).subscribe(() => {
      this.dismissModal();
    });
  }

  // Iste funkcije kao u modalu za add,
  // samo sto ovde sada postoje 2 niza zvezdica, jedan za overall rating
  // i jedan za korisnikov rating
  // Iste funkcije kao u modalu za add
  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  starIconName(star: number, ratingType: 'overall' | 'reader'): string {
    if (ratingType === 'overall') {
      return star <= this.book.rating ? 'star' : 'star-outline';
    } else {
      return star <= this.readerRating ? 'star' : 'star-outline';
    }
  }

  selectReaderRating(rating: number): void {
    this.readerRating = rating;
  }
}
