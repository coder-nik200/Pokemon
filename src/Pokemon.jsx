import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { PokemonCards } from "./PokemonCards";

const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=200";

  const fetchPokemon = async () => {
    try {
      const response = await axios.get(API);
      // console.log(response.data);  //For accessing axios data wen need => response.data

      const detailedPokemon = response.data.results.map(async (curPokemon) => {
        // console.log(curPokemon.url);
        const res = await axios.get(curPokemon.url);
        // console.log(res);
        return res.data;
      });

      // console.log(detailedPokemon);

      const detailedResponses = await Promise.all(detailedPokemon);
      // console.log(detailedResponses);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // Search functionality

  const searchData = pokemon.filter((curPokemon) => {
    return curPokemon.name.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }

  return (
    <>
      <section className="container">
        <header>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Let’s Catch Pokémon ⚡
          </h1>

          <div className="pokemon-search">
            <input
              type="text"
              placeholder="search Pokemon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div>
          <ul className="cards">
            {/* {pokemon.map((curPokemon) => { */}
            {searchData.map((curPokemon) => {
              return (
                <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Pokemon;
