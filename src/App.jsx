import "./App.css";
import { useState, useEffect } from "react";
import PokemonDetails from "./components/PokemonDetails";
import { Link } from "react-router";

const API_KEY = import.meta.env.VITE_API_KEY;

const wait = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      return resolve();
    }, 2000)
  );
};

function App() {
  const [aiResponse, setAiResponse] = useState();
  const [pokemon, setPokemon] = useState([]);
  const [isPokemonLoading, setIsPokemonLoading] = useState(true);
  const [userInput, setUserInput] = useState("");

  console.log("App has been rendered with", pokemon);

  useEffect(() => {
    async function loadData() {
      try {
        setIsPokemonLoading(true);
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon-species/"
        );
        // await wait();
        if (response.ok) {
          const data = await response.json();
          setPokemon(data.results);
        } else {
          console.log("something went wrong");
          console.log(response.status);
          throw new Error("Something went wrong");
        }
        setIsPokemonLoading(false);
      } catch (err) {
        alert("Something went wrong");
      }
    }
    loadData();
  }, []);

  async function askAboutPokemon() {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userInput }],
            },
          ],
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch AI Response");

    const result = await response.json();
    console.log(result);

    setAiResponse(result.candidates[0].content.parts[0].text);
  }

  return (
    <main>
      <h1>Pokemon API Exercise</h1>
      {/* <form action="search">
        <label className="label" htmlFor="pokemon-question">
          Ask me about Pokemon!
        </label>
        <input
          type="text"
          name="userInput"
          id="userInput"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </form>
      <button onClick={askAboutPokemon}>Ask!</button>
      <p>AI Response: {aiResponse}</p> */}
      <div className="content-container">
        {isPokemonLoading ? (
          <h2>Loading Pokemons...</h2>
        ) : (
          <ul>
            {pokemon.map((item) => {
              return (
                <li key={item.url}>
                  <Link to={`/${item.name}`}>
                    <h2>{item.name}</h2>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {/* <PokemonDetails pokemonName={selectedPokemonName} /> */}
      </div>
    </main>
  );
}

export default App;
