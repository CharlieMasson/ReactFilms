import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/ShowMovie.sass';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk, faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function ShowMovie(props) {
    const navigate = useNavigate();
    let { movieId } = useParams();

    const [currentRating, setCurrentRating] = useState(0);
    const [clickedRating, setClickedRating] = useState(0); 
    //recup détails du film
    const { onMovie, 
        currentMovie, 
        //gestion des films favoris
        onFavorite, 
        onUnfavorite, 
        isFavorite, 
        //gestion des notes
        onRating, 
        hasRating, 
        getRating, 
        removeRating, 
        onRatingDelete, 
        //gestion des commentaires
        comment, 
        onComment, 
        addComment, 
        getComment,
         deleteComment 
    } = props;

    //renvoie movieId à App pour chercher les détails du film
    useEffect(() => {
        onMovie(movieId);
    }, [movieId, onMovie]);

    const handleBackClick = () => {
        navigate('/');
    };

    //ces trois consts pour gérer l'affichage des étoiles
    //quand une étoile est cliqué, enregistre l'étoile cliqué pour illuminer tt les préccedentes
    const handleRatingClick = (index) => {
        setCurrentRating(index);
        setClickedRating(index);
        onRating(index);
    };

    const handleHover = (index) => {
        setCurrentRating(index);
    }

    //quand la souris quitte le champ, si une étoile a été cliqué, on repositionne les étoiles actives
    const handleMouseLeave = (index) => {
        if (clickedRating > 0){
            setCurrentRating(clickedRating);
        }
    }

    //switch pour ajouter/supprimer des favoris
    const handleFavoriteClick = () => {
        if (isFavorite(currentMovie.id)) {
            onUnfavorite(currentMovie.id);
        } else {
            onFavorite(currentMovie);
        }
    }

    //supprime la note du stockage local et envoie requete de supression à l'api
    const handleRemoveRating = () => {
        removeRating(currentMovie.id);
        setCurrentRating(0);
        onRatingDelete(true);
    }

    //cherche la note du film si elle en a une
    useEffect(() => {
        if (hasRating(movieId)){
            let rat = getRating(movieId);
            setCurrentRating(rat);
            setClickedRating(rat);
        }
    }, [clickedRating]);

    //recup commentaire
    useEffect(() => {
        const fetchComment = async () => {
        const movieComment = await getComment(movieId);
        onComment(movieComment);
        };
        fetchComment();
    }, [movieId]);

//ajoute commentaire
const handleAddComment = async () => {
    await addComment(movieId, comment);
    onComment(comment);
    };

    //supprime commentaire
    const handleRemoveComment = async () => {
    await deleteComment(movieId);
    onComment('');
    };

    let displayMovie;
    if (currentMovie != null){
        displayMovie = 
        <React.Fragment>
            <div className="movieFlexbox">
                <div className="imageWrapper">
                    <img alt="pas d'image disponible" src={"https://image.tmdb.org/t/p/w300" + currentMovie.poster_path}></img>
                </div>
                <div className="movieInfos">
                    <h1> {currentMovie.title} </h1>

                    {currentMovie.overview && (<p className="normalText"> Synopsis: {currentMovie.overview} </p>)}

                    {/* date de sortie ou score utilisateur en fonction de si le film est sortie ou nn */}
                    {currentMovie.status == "Released" ? (
                        <p className="normalText">Score: {currentMovie.vote_average}/10 pour {currentMovie.vote_count} votes</p>
                    ) : (
                        <p className="normalText">Sort le: {moment(currentMovie.release_date).format('DD/MM/YYYY')}</p>
                    )}

                    {/* Montre les entreprises de prod */}
                    <p className="normalText"> Produit par:{" "}
                        {currentMovie.production_companies.map((company, index, array) => (
                            <React.Fragment key={index}>
                                {company.name}
                                {index !== array.length - 1 ? ", " : ""}
                            </React.Fragment>
                        ))}
                    </p>

                    {/* directeur */}
                    {currentMovie.credits && currentMovie.credits.crew && currentMovie.credits.crew.map((crewMember, index) => {
                        if (crewMember.department === "Directing" && crewMember.job === "Director") {
                            return <p className="normalText" key={index}>Directeur: {crewMember.name}</p>;
                        }
                        return null;
                    })}

                    {/* acteurs avec une popularité > 1.5 */}
                    <p className="normalText">Acteurs connus:{" "}
                        {currentMovie.credits && currentMovie.credits.cast && currentMovie.credits.cast
                            .filter(actor => actor.popularity > 1.5)
                            .map((actor, index, array) => (
                                <React.Fragment key={index}>
                                    {actor.name}
                                    {index !== array.length - 1 ? ", " : ""}
                                </React.Fragment>
                            ))}
                    </p>

                    {/* Affichage de la note personnel du film */}
                    <div className="flexboxRating">
                        {hasRating(currentMovie.id) && (
                            <div className="flexboxRatingOption">
                                <p className="lesserText">Note: {getRating(currentMovie.id)}</p>
                                <button className="lesserText" onClick={handleRemoveRating}>Supprimer la note <FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                        ) || <p className="lesserText">Note: </p>}

                        <p className="star-rating">
                            {[...Array(10)].map((_, index) => (
                                <i
                                    className={`my-star star-${index + 1} ${index < currentRating ? 'is-active' : ''}`}
                                    key={index + 1}
                                    onMouseEnter={() => handleHover(index + 1)}
                                    onClick={() => handleRatingClick(index + 1)}
                                    onMouseLeave={() => handleMouseLeave(index + 1)}
                                ></i>
                            ))}
                        </p>
                    </div>
                </div>
            </div>
            <div className="otherMovieOptions">
                <div>
                    {/* Commentaire */}
                    <h2><label htmlFor="comment">Commentaire:</label></h2>
                    <textarea id="comment" value={comment ? comment : ""} onChange={(e) => onComment(e.target.value)} />
                    <div className="optionButtons">
                        <div className="commentButtons">
                            <button onClick={handleAddComment}>Enregistrer Commentaire <FontAwesomeIcon icon={faFloppyDisk} /></button>
                            <button className="commentButton" onClick={handleRemoveComment}>Enlever Commentaire <FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                        <div className="otherButtons">
                            {/* Favories */}
                            <button className="favoriteButton" onClick={handleFavoriteClick}>
                                {isFavorite(currentMovie.id) ? "Retirer des favoris" : "Ajouter aux favoris"} <FontAwesomeIcon icon={faStar} />
                            </button>
                            <button className="backButton" onClick={handleBackClick}>Retour <FontAwesomeIcon icon={faArrowLeft} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    } else {
        return <p>Chargement...</p>;
    }

  return (
    <section className="movie">
        {displayMovie}
    </section>
  );
}

export default ShowMovie;