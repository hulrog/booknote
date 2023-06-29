import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BooksService } from '../tab1/books.service';
import { Book, Comment, Reader } from '../tab1/book.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-update-book-modal',
  templateUrl: './update-book-modal.component.html',
  styleUrls: ['./update-book-modal.component.scss'],
})
export class UpdateBookModalComponent {
  @Input() book!: Book;
  author: string = '';
  commentText: string = '';
  genre: string = '';
  rating: number = 0;
  readerRating: number = 0;
  title: string = '';
  username: string = '';

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
    this.readerRating = this.getReaderRating();
    this.title = this.book.title;
    this.username = this.authService.getUsername();
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
    let total = 0;
    let numberOfRatings = 0;
    for (const reader of readers) {
      if (reader.rating != 0) {
        total += reader.rating;
        numberOfRatings++;
      }
    }

    const averageRating = Math.round(total / numberOfRatings);
    return averageRating;
  }

  deleteBook() {
    const username = this.authService.getUsername();
    const readerIndex = this.book.readers.findIndex(
      (reader) => reader.username === username
    );

    // Ako je jedini citac, brisi knjigu
    if (this.book.readers.length === 1) {
      this.booksService.deleteBook(this.book.id).subscribe(() => {
        this.dismissModal();
      });
    } else {
      // Nije jedini citac, samo joj izbrisi rating i updatuj u bazi sa novim prosekom
      this.book.readers.splice(readerIndex, 1);
      const averageRating = this.calculateAverageRating(this.book.readers);
      this.book.rating = averageRating;

      this.booksService.updateBook(this.book).subscribe(() => {
        this.dismissModal();
      });
    }
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

  // Komentari
  addComment() {
    const username = this.authService.getUsername();
    const comment = { username: username, text: this.commentText };
    this.book.comments.push(comment);
    this.booksService.updateBook(this.book).subscribe();
    this.commentText = ''; // Clear the comment input field
  }

  editComment(comment: Comment) {
    if (comment.username === this.authService.getUsername()) {
      this.booksService.updateBook(this.book).subscribe();
    }
  }

  deleteComment(comment: Comment) {
    const index = this.book.comments.indexOf(comment);

    if (index > -1) {
      this.book.comments.splice(index, 1);
      this.booksService.updateBook(this.book).subscribe();
    }
  }
}
