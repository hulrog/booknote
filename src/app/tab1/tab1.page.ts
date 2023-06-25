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
  genre: string = '';
  rating: number = 1;
  title: string = '';

  genreOptions: string[] = [
    'all',
    'history',
    'fantasy',
    'horror',
    'thriller',
    'nonfiction',
    'comedy',
    'drama',
  ];
  selectedGenre: string = 'all';

  constructor(
    private booksService: BooksService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.booksService.getBooks().subscribe((books) => {
      this.books = books;
    });
  }

  // Funkcija za update -  ide u novu komponentu  gde se nalazi sama funkcija
  // kad se dissmissuje updatuje listu knjiga
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

  // Funkcija za update -  ide u novu komponentu gde se nalazi sama funkcija
  // kad se dissmissuje updatuje listu knjiga
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

  // Pravi bezveze niz od nula duzine rating-a, pa se na frontu to slika u zvezde
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  // Filter po selektovanom zanru
  filterBooks() {
    if (this.selectedGenre != 'all') {
      this.booksService.getBooks().subscribe((books) => {
        this.books = books.filter((book) => book.genre === this.selectedGenre);
      });
    } else {
      this.booksService.getBooks().subscribe((books) => {
        this.books = books;
      });
    }
  }

  // Ciklicno kretanje kroz zanrove
  selectPreviousGenre() {
    const currentIndex = this.genreOptions.indexOf(this.selectedGenre);
    const previousIndex =
      currentIndex === 0 ? this.genreOptions.length - 1 : currentIndex - 1;
    this.selectedGenre = this.genreOptions[previousIndex];
    this.filterBooks();
  }

  selectNextGenre() {
    const currentIndex = this.genreOptions.indexOf(this.selectedGenre);
    const nextIndex =
      currentIndex === this.genreOptions.length - 1 ? 0 : currentIndex + 1;
    this.selectedGenre = this.genreOptions[nextIndex];
    this.filterBooks();
  }
}
