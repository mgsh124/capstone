import { Movie } from './movie';

export interface RestDb {
  _id: string;
  movie: Movie;
}
