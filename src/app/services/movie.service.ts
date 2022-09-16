import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Movie } from '../interfaces/movie';
import { Genre } from '../interfaces/genre';
import { Filter } from '../interfaces/filter';
import { RestDb } from '../interfaces/rest-db';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private _watchList = new BehaviorSubject<Movie[]>([]);
  private _watchList$ = this._watchList.asObservable();

  constructor(private http: HttpClient) {}

  getMovies(filter: Filter) {
    return this.http.get<Movie[]>(`${environment.movieApi}/discover/movie`, {
      params: {
        with_genres: filter.genre,
        'vote_average.gte': filter.rating,
        year: filter.year,
      },
    });
  }

  getMovie(id: number) {
    return this.http.get<Movie>(`${environment.movieApi}/movie/${id}`);
  }

  getGenres() {
    return this.http.get<Genre[]>(`${environment.movieApi}/genre/movie/list`);
  }

  getImageSource(path: string) {
    if (path === null) {
      return `${environment.placeholderSource}?text=MovieDB`;
    }
    return `${environment.movieImgSource}/${path}`;
  }

  getWatchList$() {
    return this._watchList$;
  }

  getWatchList() {
    return this.http.get<RestDb[]>(`${environment.restDbApi}`);
  }

  addToWatchList(movie: Movie | undefined) {
    if (movie === undefined) {
      this._watchList.next([]);
      return;
    }
    this._watchList.next(this._watchList.getValue().concat(movie));
    return this.http.post<Movie>(`${environment.restDbApi}`, { movie });
  }

  removeFromWatchList(objectId: string) {
    let removeIdx = this._watchList
      .getValue()
      .findIndex((movie) => movie._id === objectId);
    if (removeIdx !== -1) {
      this._watchList.getValue().splice(removeIdx, 1);
      this._watchList.next(this._watchList.getValue());
    }
    return this.http.delete<RestDb>(`${environment.restDbApi}/${objectId}`);
  }
}
