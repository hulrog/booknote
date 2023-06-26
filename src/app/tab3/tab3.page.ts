import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BooksService } from '../tab1/books.service';
import { Book } from '../tab1/book.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  genreBreakdown: { genre: string; count: number }[] = [];
  totalBooks: number = 0;
  username: string = '';

  constructor(
    private authService: AuthService,
    private booksService: BooksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.calculateBookStatistics();
  }

  calculateBookStatistics() {
    this.booksService.getBooks().subscribe((books: Book[]) => {
      this.totalBooks = books.length;
      const genreBreakdown: { genre: string; count: number }[] = [];

      // Prebrojavanje knjiga jedna po jedna
      for (const book of books) {
        let genreExists = false;

        for (const genreItem of genreBreakdown) {
          if (genreItem.genre === book.genre) {
            genreItem.count++;
            genreExists = true;
            break;
          }
        }

        if (!genreExists) {
          genreBreakdown.push({ genre: book.genre, count: 1 });
        }
      }

      this.genreBreakdown = genreBreakdown;
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
