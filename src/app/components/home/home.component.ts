import { Component, OnInit } from '@angular/core';
import { Filter } from 'src/app/interfaces/filter';
import { Genre } from 'src/app/interfaces/genre';
import { Movie } from 'src/app/interfaces/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  filter: Filter = {
    genre: '',
    rating: 7,
    year: 2000,
  };

  genres: Genre[] = [];
  movies: Movie[] = [];
  watchListIds: number[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService
      .getGenres()
      .subscribe((response) => (this.genres = response));

    this.movieService.getWatchList().subscribe((response) => {
      const list = response.reduce((prev: Movie[], curr) => {
        let movie = curr.movie;
        movie._id = curr._id;
        return [...prev, movie];
      }, []);
      this.movieService.addToWatchList(undefined);

      list.forEach((movie) => {
        this.movieService.addToWatchList(movie);
      });
    });

    this.movieService.getWatchList$().subscribe((movies) => {
      this.watchListIds = movies.reduce((prev: number[], curr) => {
        return [...prev, curr.id];
      }, []);
    });

    this.getMovies();
  }

  submitForm() {
    console.log(this.filter);
    this.getMovies();
  }

  getMovies() {
    this.movieService.getMovies(this.filter).subscribe((response) => {
      this.movies = response;
    });
  }

  getImageSource(path: string) {
    return this.movieService.getImageSource(path);
  }

  addToWatchList(movie: Movie) {
    this.movieService.addToWatchList(movie)?.subscribe({
      next: (response) => this.getMovies(),
      error: (err) => console.log(err),
    });
  }

  isInWatchList(movie: Movie) {
    return this.watchListIds.includes(movie.id) ? 'disabled' : '';
  }
}
