import React from 'react';
import moment from 'moment';
import { useNavigate  } from 'react-router-dom';
import '../../styles/List.sass';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';

function ListMovies(props) {
    const { movies, isFavorite, favoriteMovies } = props;
    
    const navigate = useNavigate();
    const handleMovieClick = (movie) => {
        navigate(`/movie/${movie.id}`);
    };

    //liste des films
    let displayMovies = movies?.map(movie => (
        <li key={movie.id} className="movie" onClick={() => handleMovieClick(movie)}>
            <img src={"https://image.tmdb.org/t/p/w300" + movie.poster_path}></img>
            <p className="normalText">{ movie.title }</p>
            <p className="normalText"> Date de Sortie: {moment(movie.release_date).format('DD/MM/YYYY')}</p>
            <p className="lesserText">{isFavorite(movie.id) ? "Dans les favoris" : ""}</p>
        </li>
    ));

    //liste des films favoris
    let displayFavoriteMovies = favoriteMovies?.map(movie => (
        <li key={movie.id} className="movie">
            <a className="movieLink" onClick={() => handleMovieClick(movie)}>
                <img src={"https://image.tmdb.org/t/p/w300" + movie.poster_path}></img>
                <p className="normalText">{ movie.title }</p>
                <p className="normalText"> Date de Sortie: {moment(movie.release_date).format('DD/MM/YYYY')}</p>
            </a>
        </li>
    ));

    if (!displayMovies) {
        return <p>Chargement...</p>;
    }

  return (
    <section className="parentMovies">
        <ul className="movies">
            { displayMovies }
        </ul>
        {favoriteMovies.length > 0 && (
            <React.Fragment>
                <h2 className="favoritesTitle"><FontAwesomeIcon icon={faStar} /> Films Favoris: </h2>
                <ul className="movies">
                    { displayFavoriteMovies }
                </ul>
            </React.Fragment>
        )}
    </section>
  );
}

export default ListMovies;