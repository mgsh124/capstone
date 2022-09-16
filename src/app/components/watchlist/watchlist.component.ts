import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from 'src/app/interfaces/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  _watchlist$: Observable<Movie[]> | undefined;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this._watchlist$ = this.movieService.getWatchList$();
  }

  getWatchList() {}

  getImageSource(path: string | undefined) {
    if (path === undefined) {
      return '';
    }
    return this.movieService.getImageSource(path);
  }

  removeFromWatchList(objectId: string) {
    this.movieService.removeFromWatchList(objectId).subscribe({
      next: (response) => this.getWatchList(),
      error: (err) => console.log(err),
    });
  }
}
