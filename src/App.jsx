import "./App.css";
import { useState } from "react";

function App() {
  const [aiResponse, setAiResponse] = useState();
  const [pokemon, setPokemon] = useState([]);
  const [userInput, setUserInput] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;

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

  async function loadData() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon-species/");
    if (response.ok) {
      const data = await response.json();
      setPokemon(data.results);
      console.log(data.results);
    } else {
      console.log("something went wrong");
      console.log(response.status);
    }
  }
  return (
    <>
      <h1>Pokemon API Exercise</h1>
      <form action="search">
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
      <p>AI Response: {aiResponse}</p>
      <button onClick={loadData}>Show me Pokemon!</button>
      {pokemon.map((item) => {
        return (
          <div key={item.url}>
            <h2>{item.name}</h2>
          </div>
        );
      })}
    </>
  );
}

export default App;
