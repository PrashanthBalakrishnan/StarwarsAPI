import React, { useReducer, useState } from 'react';
import CharacterList from './CharacterList';
import endpoint from './endpoint';

const initialState = {
  result: null,
  loading: true,
  error: null,
};

const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        result: null,
        loading: true,
        error: null,
      };
    case 'RESPONSE_COMPLETE':
      return {
        result: action.payload.response,
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

const useFetch = (url) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  React.useEffect(() => {
    dispatch({ type: 'LOADING' });

  const fetchUrl = async ()=>{
    try{
      const response = await fetch(url);
      const data = response.json()
      dispatch({type:'RESPONSE_COMPLETE', payload:{response}})
      
    }catch(error){
      dispatch({type:'ERROR', payload:{error}})
    }finally{

    }
  }
    
};

function App() {
  const [response, loading, error] = useFetch(endpoint + '/characters');
  const characters = (response && response.characters) || [];
  return (
    <div className="App">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <CharacterList characters={characters} />
          )}
          {error && <p className="error">{error.message}</p>}
        </section>
      </main>
    </div>
  );
}

export default App;
