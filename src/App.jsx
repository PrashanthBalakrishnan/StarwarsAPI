import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CharacterView from './CharacterView';
import CharacterList from './CharacterList';
import endpoint from './endpoint';
import { isFunction } from 'lodash';

const initialState = {
  result: null,
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        characters: [],
        loading: true,
        error: null,
      };
    case 'RESPONSE_COMPLETE':
      return {
        characters: action.payload.characters,
        loading: false,
        error: null,
      };

    case 'ERROR':
      return {
        result: null,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const fetchCharacters = (dispatch) => {
  dispatch({ type: 'LOADING' });
  fetch(endpoint + '/characters')
    .then((response) => response.json())
    .then((response) =>
      dispatch({
        type: 'RESPONSE_COMPLETE',
        payload: { characters: response.characters },
      })
    )
    .catch((error) => dispatch({ type: 'ERROR', payload: { error } }));
};

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = useCallback((action) => {
    if (isFunction(action)) {
      action(dispatch);
    } else {
      dispatch(action);
    }
  });

  return [state, enhancedDispatch];
};

function App() {
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters } = state;

  useEffect(() => {
    dispatch((dispatch) => {});
  }, [dispatch]);

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button onClick={() => dispatch(fetchCharacters)}>
            Fetch Characters
          </button>
          <CharacterList characters={characters} />
        </section>
        <section className="CharacterView">
          <Routes>
            {characters ? (
              <Route path="/characters/:id" element={<CharacterView />} />
            ) : null}
          </Routes>
        </section>
      </main>
    </div>
  );
}

export default App;
