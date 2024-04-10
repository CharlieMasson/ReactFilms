import { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListMovies from "./assets/List.jsx";
import ShowMovie from "./assets/ShowMovie.jsx";
import useDebounce from "../src/useDebounce.js";
import Menu from "./assets/Menu.jsx";
import options from "../src/options.js"
import "../styles/App.sass";

function App() {
  //gère la recherche de film
  const [search, setSearch] = useDebounce(1000);
  //contient l'id du film à afficher à l'écran (ShowMovie.jsx)
  const [currentMovieId, setCurrentMovieId] = useState(null);
  //contient le film à afficher à l'écran (ShowMovie.jsx)
  const [currentMovie, setCurrentMovie] = useState(null);
  //contient liste des films à afficher à l'écran (List.jsx)
  const [movies, setMovies] = useState(null);
  //Gestion de la notation
  const [rating, setRating] = useState(null);
  //booléen pour suppression de la notation
  const [deleteRatingRequested, setDeleteRatingRequested] = useState(false);
  //gestion commentaire
  const [comment, setComment] = useState("");
  //gestion des films favoris: on les récupère de localstorage, si localstorage est vide initialization d'une liste vide
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  //idem pour les notes
  const [ratings, setRatings] = useState(() => {
    const storedRatings = localStorage.getItem('ratings');
    return storedRatings ? JSON.parse(storedRatings) : {};
  });
  //gestion de la liste des catégories de film
  const [allCategories, setAllCategories] = useState(null);
  //choix de catégorie de l'utilisateur
  const [category, setCategory] = useState("");
  const baseUrl = "https://api.themoviedb.org/3";

  //initialisse bdd indexedDB pour les commentaires
  function initializeDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('movieCommentsDB', 1);
  
      request.onerror = function(event) {
        reject('Erreur ouverture bdd');
      };
  
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore('comments', { keyPath: 'movieId' });
        objectStore.createIndex('movieId', 'movieId', { unique: true });
      };
  
      request.onsuccess = function(event) {
        const db = event.target.result;
        resolve(db);
      };
    });
  }

  //retourne un/des films
  useEffect( () => {
    //retourne tt les films en tendance
    const fetchMovies = async () => {
      try{
        const response = await fetch(`${baseUrl}/trending/movie/day?language=fr`, options.get)
        const jsonData = await response.json();
        setMovies(jsonData.results);
      } catch(error) {
          console.log("Erreur: " + error)
      }
    };
    //retourne des film recherchés
    const fetchMoviesBySearch = async () => {
      try {
        const response = await fetch(`${baseUrl}/search/multi?query=${search}&language=fr`, options.get);
        //const response = await fetch(`${baseUrl}/search/movie?query=${search}&language=fr`, options.get);
        const jsonData = await response.json();
        console.log(jsonData);
        setMovies(jsonData.results);
      } catch (error) {
        console.log("Erreur: " + error);
      }
    };
    //retourne des films par rapport à une catégorie
    const fetchMoviesByCategory = async () => {
      try {
        const response = await fetch(`${baseUrl}/discover/movie?with_genres=${category}&language=fr`, options.get)
        const jsonData = await response.json();
        setMovies(jsonData.results);
      } catch (error) {
        console.log("Erreur: " + error);
      }
    }

    if (search.trim() !== "") {
      fetchMoviesBySearch();
    } else if (category != null){
      fetchMoviesByCategory();
    } else {
      fetchMovies();
    }
  }, [search, category]);

  //retourne un film specifique et son cast
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setCurrentMovie(null);
        const favoriteMovie = favorites.find(movie => movie.id === parseInt(currentMovieId));
            if (favoriteMovie) {
                // si le film est dans les favs, on utilise la copie local au lieu de le récuperer à nouveau
                setCurrentMovie(favoriteMovie);
            } else {
              const response = await fetch(`${baseUrl}/movie/${currentMovieId}?&append_to_response=credits&language=fr`, options.get);
              const jsonData = await response.json();
              setCurrentMovie(jsonData);
            }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    if (currentMovieId != null){
      fetchMovieDetails();
    }
  }, [currentMovieId]);

  //recup des catégories du site, useMemo pour executer qu'une fois
  useMemo( () => {
    const fetchCategories = (async () => {
      try {
        const response = await fetch(baseUrl + "/genre/movie/list?language=fr", options.get);
        const jsonData = await response.json();
        setAllCategories(jsonData.genres);
      } catch (error) {
        console.error("Error fetching categories:", error);
        return null; // Return null in case of error
      }
    });
    fetchCategories();
  }, []);

  //ajoute un film au favs
  const addToFavorites = (movie) => {
    setFavorites(prevFavorites => [...prevFavorites, movie]);
  };

  //enlève un film des favs
  const removeFromFavorites = (movieId) => {
    setFavorites(prevFavorites => prevFavorites.filter(movie => movie.id !== movieId));
  };

  //verif si un film est fav
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  //enregistre les films favoris quand le state favorites est modif
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  //ajoute une note d'un film au notes 
  const addRating = (movieId, rating) => {
    setRatings(prevRatings => {
      const updatedRatings = { ...prevRatings, [movieId]: rating };
      localStorage.setItem('ratings', JSON.stringify(updatedRatings));
      return updatedRatings;
    });
  };
  
  // Supprime la note d'un film
  const removeRating = (movieId) => {
    setRatings(prevRatings => {
      const { [movieId]: _, ...updatedRatings } = prevRatings;
      localStorage.setItem('ratings', JSON.stringify(updatedRatings));
      return updatedRatings;
    });
  };
  
  // Vérifie si un film a été noté
  const hasRating = (movieId) => {
    return ratings.hasOwnProperty(movieId);
  };
  
  // Récupère la note d'un film, null sinon
  const getRating = (movieId) => {
    return ratings[movieId] || null;
  };

  //donne une note au film affiché quand rating est modif
  useEffect(() => {
    const rateMovie = async () => {
      try {
        const response = await fetch(`${baseUrl}/movie/${currentMovie.id}/rating?api_key=${options.api_key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: options.get.headers.Authorization
          },
          body: JSON.stringify({
            value: rating
          })
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la notation');
        } else {
          //enregistre la note en local pour pouvoir l'afficher
          addRating(currentMovie.id, rating)
        }
        console.log('Noté avec succés');
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    if (rating != null){
      rateMovie();
    }
  }, [rating]);

  //supprime la note d'un film
  useEffect(() => {
    const deleteMovieRating = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${currentMovie.id}/rating?api_key=${options.api_key}`, {
          method: 'DELETE',
          headers: {
            'Authorization': options.get.headers.Authorization,
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json'
          },
        });
        if (response.ok) {
          console.log('Note supprimée avec succés');
        } else {
          console.error('Erreur lors de la supression');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    if (deleteRatingRequested){
      deleteMovieRating();
      setDeleteRatingRequested(false);
    }
  }, [deleteRatingRequested]);

  // Fonction pour ajouter un commentaire à IndexedDB
  async function addComment(movieId, comment) {
    const db = await initializeDatabase();
    const transaction = db.transaction(['comments'], 'readwrite');
    const objectStore = transaction.objectStore('comments');
    objectStore.put({ movieId, comment });
  }

  // Fonction pour recup un commentaire de IndexedDB
  async function getComment(movieId) {
    const db = await initializeDatabase();
    const transaction = db.transaction(['comments'], 'readonly');
    const objectStore = transaction.objectStore('comments');
    const request = objectStore.get(movieId);
    return new Promise((resolve, reject) => {
      request.onsuccess = function(event) {
        const comment = event.target.result ? event.target.result.comment : "";
        resolve(comment);
      };
      request.onerror = function(event) {
        reject('Error retrieving comment');
      };
    });
  }

  // Fonction pour supprimer un commentaire de IndexedDB
  async function deleteComment(movieId) {
    const db = await initializeDatabase();
    const transaction = db.transaction(['comments'], 'readwrite');
    const objectStore = transaction.objectStore('comments');
    objectStore.delete(movieId);
  }

  return (
    <div>
      <Router>
        <Menu onSearch={setSearch} onCategory={setCategory} allCategories={allCategories} />
        <Routes>
          <Route path="/" element={<ListMovies movies={movies} isFavorite={isFavorite} favoriteMovies={favorites} />} />
          <Route 
            path="/movie/:movieId" 
            element={<ShowMovie 
              currentMovie={currentMovie} 
              onMovie={setCurrentMovieId} 
              onFavorite={addToFavorites} 
              onUnfavorite={removeFromFavorites} 
              isFavorite={isFavorite} 
              onRating={setRating} 
              hasRating={hasRating}
              getRating={getRating}
              removeRating={removeRating}
              onRatingDelete={setDeleteRatingRequested}
              comment={comment}
              onComment={setComment}
              addComment={addComment}
              getComment={getComment}
              deleteComment={deleteComment}
            />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
