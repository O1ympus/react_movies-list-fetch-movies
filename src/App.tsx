import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          queryHandler={setQuery}
          movie={currentMovie}
          movieHandler={setCurrentMovie}
          movieList={movies}
          moviesListHandler={setMovies}
        />
      </div>
    </div>
  );
};
