import React, { useState, useEffect, useReducer, useMemo, useRef, useCallback } from "react";
import "../styles/Characters.css";
import Search from "./Search";

const initialState = {
  favorites: [],
};

const favoriteReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_FAVORITE":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    default:
      return state;
  }
};

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, dispatch] = useReducer(favoriteReducer, initialState);
  const [search, setSearch] = useState('');
  const searchInput = useRef(null);

  const validateStatus = (status) => {
    if (status == "Alive") {
      return `❤️ ${status}`;
    } else if (status == "unknown") {
      return `❔ ${status}`;
    } else {
      return `👻 ${status}`;
    }
  };

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character/")
      .then((response) => response.json())
      .then((data) => setCharacters(data.results));
  }, []);

  const handleClick = (favorite) => {
    dispatch({ type: "ADD_TO_FAVORITE", payload: favorite });
  };

//   const handleSearch = () => {
//     setSearch(searchInput.current.value);
//   };

  const handleSearch = useCallback(() => {
    setSearch(searchInput.current.value);
  }, [])

  //   const filteredUsers = characters.filter((user) => {
  //     return user.name.toLowerCase().includes(search.toLowerCase());
  //   })

  const filteredUsers = useMemo(
    () =>
      characters.filter((user) => {
        return user.name.toLowerCase().includes(search.toLowerCase());
      }),
    [characters, search]
  );

  return (
    <>
      {favorites.favorites.map((favorite) => (
        <li key={favorite.id}>{favorite.name}</li>
      ))}

      <Search search={search} searchInput={searchInput} handleSearch={handleSearch} />

      <div className="margin-cart">
        {filteredUsers.map((character) => (
          <div className="cart" key={character.id}>
            <img src={character.image} alt={character.name} />
            <div className="description">
              <p>{character.name}</p>
              <p>{validateStatus(character.status)}</p>
              <p>{character.species}</p>
              <p>{character.location.name}</p>
              <button type="button" onClick={() => handleClick(character)}>
                Agregar a favoritos
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Characters;
