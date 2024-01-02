import { movies, languages, countries, genres } from './movies.js';
import { hindiMovies } from './hindiMovies.js';
import { allmovies } from './allmovies.js';
export const getCounts = () => {
  const counts = {};
  counts.movies = movies.length;
  counts.hindiMovies = hindiMovies.length;
  counts.languages = languages.length;
  counts.countries = countries.length;
  counts.genres = genres.length;

  return counts;
}

export { movies, languages, countries, genres } from './movies.js';
export { hindiMovies } from './hindiMovies.js';
export { allmovies } from './allmovies.js';