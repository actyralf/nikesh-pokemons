import { useEffect, useState } from "react";
import { useParams } from "react-router";

function PokemonDetails() {
  const { pokemonName } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log("Pokemon URL has changed to:", pokemonName);
    async function loadData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        // await wait();
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setPokemon(data);
        } else {
          console.log("something went wrong");
          console.log(response.status);
          throw new Error("Something went wrong");
        }
        setIsLoading(false);
      } catch (err) {
        alert("Something went wrong in Details");
      }
    }
    if (pokemonName) {
      loadData();
    }
  }, [pokemonName]);
  if (!pokemon) {
    return <h2>Please select a Pokemon</h2>;
  }
  if (isLoading) {
    return (
      <div className="detail-container">
        <h2>{pokemonName}</h2>
        <p>Loading Pokemon details...</p>
      </div>
    );
  }
  return (
    <div className="detail-container">
      <h2>{pokemonName}</h2>
      <img src={pokemon.sprites.front_default} alt="" />
      <ul>
        {pokemon.types.map((pokemonType) => {
          return <li key={pokemonType.type.name}>{pokemonType.type.name}</li>;
        })}
      </ul>
    </div>
  );
}

export default PokemonDetails;
