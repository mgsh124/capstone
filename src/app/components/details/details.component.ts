import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/app/interfaces/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  movieDetail: Movie | undefined;
  id: number = 0;
  watchListIds: number[] = [];

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      this.getDetails(this.id);
    });

    this.movieService.getWatchList$().subscribe((movies) => {
      this.watchListIds = movies.reduce((prev: number[], curr) => {
        return [...prev, curr.id];
      }, []);
    });
  }

  getDetails(id: number) {
    this.movieService.getMovie(id).subscribe((response) => {
      this.movieDetail = response;
    });
  }

  getImageSource(path: string | undefined) {
    if (path === undefined) {
      return '';
    }
    return this.movieService.getImageSource(path);
  }

  getGenresList() {
    const list = this.movieDetail?.genres.reduce(
      (previousValue, currentValue) => {
        previousValue.push(currentValue.name);
        return previousValue;
      },
      ['']
    );
    return list?.filter((value) => value !== '').join(', ');
  }

  addToWatchList(movie: Movie | undefined) {
    this.movieService.addToWatchList(movie)?.subscribe({
      next: (response) => console.log(response),
      error: (err) => console.log(err),
    });
  }

  isInWatchList(movie: Movie | undefined) {
    if (!movie) return false;
    return this.watchListIds.includes(movie.id);
  }

  removeFromWatchList(objectId: string | undefined) {
    console.log(objectId);
    if (!objectId) return;

    this.movieService.removeFromWatchList(objectId).subscribe({
      next: (response) => console.log(response),
      error: (err) => console.log(err),
    });
  }
}
