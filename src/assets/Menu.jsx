import { useNavigate  } from 'react-router-dom';
import React from 'react';
import '../../styles/Menu.sass';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFilm } from '@fortawesome/free-solid-svg-icons';


const Menu = ({ onSearch, onCategory, allCategories }) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const { value } = e.target;
    onSearch(value);
  };

  //choix d'une catégorie
  const handleCategory = (e) => {
    const { value } = e.target;
    onCategory(value);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  //affichage catégories
  let displayCategories = allCategories?.map(category => (
    <option key={category.id} value={category.id} className="category">
        {category.name}
    </option>
));

  return (
    <nav className="menuWrapper">
      <div className="menu">
        <div className="menuLeft">
          <h2> POC Films <FontAwesomeIcon icon={faFilm} /></h2>
          <input type="text" placeholder="Recherche..." className="inputSearch" onChange={(e) => handleSearch(e) } />
          <h3>Genre:</h3>
          <select className="inputCategory" onChange={(e) => handleCategory(e) }>
            <option key="default" value=""></option>
            { displayCategories }
        </select>
        </div>
        <div>
          <button className="homeButton" onClick={handleHomeClick}>accueil <FontAwesomeIcon icon={faHouse} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Menu;