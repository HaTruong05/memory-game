import Card from "./card.jsx";
import { useState, useEffect } from "react";
import "./board.css";

export default function Board() {
  const [pickedPokemons, setPickedPokemons] = useState([]);
  const [currentRoundData, setCurrentRoundData] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gen1PokemonData, setGen1PokemonData] = useState(null);

  function handlePick(pickedId) {
    let nextRound;
    if (pickedPokemons.includes(pickedId)) {
      setBestScore(currentScore);
      setCurrentScore(0);
      setPickedPokemons([]);
      nextRound = getNewRound([]);
    } else {
      setCurrentScore(currentScore + 1);
      setPickedPokemons([...pickedPokemons, pickedId]);
      nextRound = getNewRound([...pickedPokemons, pickedId]);
    }

    setCurrentRoundData(getNextRoundData(nextRound, gen1PokemonData));
  }

  useEffect(() => {
    async function fetchPokemons() {
      const gen1Ids = [];
      for (let i = 1; i < 152; i++) {
        gen1Ids.push(i);
      }

      const promises = gen1Ids.map(fetchPokemon);
      const data = await Promise.all(promises);
      setGen1PokemonData(data);
    }

    fetchPokemons();
  }, []);

  useEffect(() => {
    if (gen1PokemonData) {
      const pokemonsToDisplay = [];
      getNewPokemonsToDisplay(3, pokemonsToDisplay);

      setCurrentRoundData(getNextRoundData(pokemonsToDisplay, gen1PokemonData));
    }
  }, [gen1PokemonData]);

  return (
    <>
      <h1>Pokémon memory game</h1>
      <p>Don't pick the same Pokémon twice! </p>
      <p>Features the orginal 151 Pokémon from Generation 1.</p>
      <h2>Score: {currentScore}</h2>
      <h3>Best score: {bestScore}</h3>
      <div className="cards">
        {currentRoundData.map((pokemonData) => {
          return (
            <Card
              key={pokemonData.id}
              name={pokemonData.name}
              spriteUrl={pokemonData.spriteUrl}
              onClick={() => handlePick(pokemonData.id)}
            ></Card>
          );
        })}
      </div>
    </>
  );
}

async function fetchPokemon(pokemonId) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    console.log("Request failed");
  }
}

function getNextRoundData(pokemonIds, pokemonData) {
  return pokemonIds.map((id) => {
    const pokemon = pokemonData[id - 1];

    return {
      id: id,
      name: pokemon.name[0].toUpperCase() + pokemon.name.substring(1),
      spriteUrl: pokemon.sprites.front_default,
    };
  });
}

function getNewRound(pickedPokemons) {
  const pokemonsToDisplay = [];

  // Pick up to two pokemons from the ones already pick
  const pickedPokemonCount = Math.min(2, pickedPokemons.length);
  getPickedPokemonsToDisplay(
    pickedPokemonCount,
    pickedPokemons,
    pokemonsToDisplay
  );

  // Pick up to three new pokemons
  const newPokemonCount = 3 - pokemonsToDisplay.length;
  getNewPokemonsToDisplay(newPokemonCount, pokemonsToDisplay);
  return shuffleArray(pokemonsToDisplay);
}

function getPickedPokemonsToDisplay(count, pickedPokemons, pokemonsToDisplay) {
  for (let i = 0; i < count; i++) {
    let randomIdx = Math.floor(Math.random() * pickedPokemons.length);

    while (pokemonsToDisplay.includes(pickedPokemons[randomIdx])) {
      randomIdx = Math.floor(Math.random() * pickedPokemons.length);
    }

    pokemonsToDisplay.push(pickedPokemons[randomIdx]);
  }
}

function getNewPokemonsToDisplay(count, pokemonsToDisplay) {
  for (let i = 0; i < count; i++) {
    let randomPokemonIdx = Math.floor(Math.random() * 151) + 1;

    while (pokemonsToDisplay.includes(randomPokemonIdx)) {
      randomPokemonIdx = Math.floor(Math.random() * 151) + 1;
    }

    pokemonsToDisplay.push(randomPokemonIdx);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
