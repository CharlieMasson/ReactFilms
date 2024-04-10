import React from 'react';
import { useNavigate  } from 'react-router-dom';
import '../../styles/List.sass';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ListIndividualMovie from "./ListIndividualMovie";

function ListMovies(props) {
    const { movies, isFavorite, favoriteMovies } = props;
    
    const navigate = useNavigate();

    //liste des films
    let displayMovies = movies?.map(movie => (
        <ListIndividualMovie key={movie.id} movie={movie} isFavorite={isFavorite} />
    ));

    //liste des films favoris
    let displayFavoriteMovies = favoriteMovies?.map(movie => (
        <ListIndividualMovie key={movie.id} movie={movie} isFavorite={isFavorite} />
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