import React from 'react';
import moment from 'moment';
import { useNavigate  } from 'react-router-dom';

function ListIndividualMovie(props) {
    const { movie, isFavorite } = props;
    const navigate = useNavigate();

    const handleMovieClick = (movie) => {
        if (movie.media_type == 'tv' || movie.media_type == 'person'){
            return null;
        }
        navigate(`/movie/${movie.id}`);
    };

    //switch pour changer l'affichage en fonction de si l'objet est un film, série tv ou personne
    function renderSwitch(movie) {
        switch(movie.media_type){
            case 'movie':
                return <React.Fragment>
                    <img alt="pas d'image disponible" src={"https://image.tmdb.org/t/p/w300" + movie.poster_path} default></img>
                    <p className="normalText">{ movie.title }</p>
                    <p className="normalText"> Date de Sortie: {moment(movie.release_date).format('DD/MM/YYYY')}</p>
                    <p className="lesserText">{isFavorite(movie.id) ? "Dans les favoris" : ""}</p>
                </React.Fragment>
            case 'tv':
                return <React.Fragment>
                    <img alt="pas d'image disponible" src={"https://image.tmdb.org/t/p/w300" + movie.poster_path}></img>
                    <p className="normalText">{ movie.name }</p>
                    <p className="normalText"> Date de Sortie: {moment(movie.release_date).format('DD/MM/YYYY')}</p>
                </React.Fragment>
            case 'person':
                return <React.Fragment>
                    <img alt="pas d'image disponible" src={"https://image.tmdb.org/t/p/w300" + movie.profile_path}></img>
                    <p className="normalText">{ movie.name }</p>
                </React.Fragment>
            //default = pas de recherche multi
            default: 
                return <React.Fragment>
                    <img alt="pas d'image disponible" src={"https://image.tmdb.org/t/p/w300" + movie.poster_path}></img>
                    <p className="normalText">{ movie.title }</p>
                    <p className="normalText"> Date de Sortie: {moment(movie.release_date).format('DD/MM/YYYY')}</p>
                    <p className="lesserText">{isFavorite(movie.id) ? "Dans les favoris" : ""}</p>
                </React.Fragment>
        }
    }

    return(
        <li key={movie.id} className="movie" onClick={() => handleMovieClick(movie)}>
            {renderSwitch(movie)}
        </li>
    )
}
export default ListIndividualMovie;
