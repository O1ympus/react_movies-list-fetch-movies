import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ResponseError';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';

function isResponseError(
  result: MovieData | ResponseError,
): result is ResponseError {
  return (result as ResponseError).Response === 'False';
}

type Props = {
  query: string;
  queryHandler: (str: string) => void;
  movie: Movie | null;
  movieHandler: (movie: Movie | null) => void;
  movieList: Movie[];
  moviesListHandler: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  queryHandler,
  movie,
  movieHandler,
  movieList,
  moviesListHandler,
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': isError })}
              value={query}
              onChange={event => {
                queryHandler(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={query === ''}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': isLoading })}
              onClick={event => {
                event.preventDefault();

                setIsError(false);
                setIsLoading(true);

                getMovie(query)
                  .then(result => {
                    if (isResponseError(result)) {
                      setIsError(true);

                      return;
                    }

                    const mappedMovie: Movie = {
                      title: result.Title,
                      description: result.Plot,
                      imgUrl:
                        result.Poster === 'N/A'
                          ? 'https://via.placeholder.com/360x270.png?' +
                            'text=no%20preview'
                          : result.Poster,
                      imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
                      imdbId: result.imdbID,
                    };

                    movieHandler(mappedMovie);
                  })
                  .catch(() => {
                    setIsError(true);
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
            >
              Find a movie
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={event => {
                  event.preventDefault();

                  queryHandler('');

                  if (
                    !movie ||
                    movieList.some(
                      existingMovie => existingMovie.imdbId === movie.imdbId,
                    )
                  ) {
                    movieHandler(null);

                    return;
                  }

                  moviesListHandler([...(movieList || []), movie]);
                  movieHandler(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
