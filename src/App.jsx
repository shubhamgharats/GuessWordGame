import { useState } from "react";
import Keyboard from "./components/Keyboard";
import { getHint } from "./ai";

function App() {
  const [generateWord, setGenerateWord] = useState("");
  const [generateWordLetterArr, setGenerateWordLetterArr] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [hint, setHint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lives, setLives] = useState([
    "❤️",
    "❤️",
    "❤️",
    "❤️",
    "❤️",
    "❤️",
    "❤️",
    "❤️",
  ]);

  const keyboard = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const GameOver = lives.length === 0;
  const GameWon =
    generateWordLetterArr.length > 0 &&
    generateWordLetterArr.every(
      (letter) =>
        !letter.isNotVisible ||
        guessedLetters.includes(letter.value.toUpperCase()),
    );

  function handleGuess(letter) {
    setGuessedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter],
    );

    const isCorrect = generateWordLetterArr.some(
      (item) => item.value.toUpperCase() === letter && item.isNotVisible,
    );

    if (!isCorrect) {
      setLives((prev) => prev.slice(1));
    }
  }

  async function generateRandomWord() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://random-word-api.herokuapp.com/word?length=${Math.floor(Math.random() * 6) + 5}`,
      );

      const data = await res.json();
      const randomWord = data[0];

      setGenerateWord(randomWord);

      setGenerateWordLetterArr(
        Array.from(randomWord, (letter, index) => ({
          id: index,
          value: letter,
          isNotVisible: Math.random() > 0.5,
        })),
      );

      setHint("Generating hint...");
      const hint = await getHint(randomWord);
      setHint(hint);
      setIsLoading(false);

      setGuessedLetters([]);

      setLives(["❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️"]);
    } catch (error) {
      console.error(error);
      setHint("Failed to generate hint.");
      setIsLoading(false);
    }
  }

  const keyboardElememnt = keyboard.map((prev) => (
    <Keyboard
      key={prev}
      value={prev}
      onClick={() => handleGuess(prev)}
      isGuessed={guessedLetters.includes(prev)}
      isCorrect={generateWordLetterArr.some(
        (item) => item.value.toUpperCase() === prev && item.isNotVisible,
      )}
    />
  ));

  const livesElement = lives.map((prev) => (
    <span key={prev}>
      {prev} <br />
    </span>
  ));

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center px-6 py-10 text-white">
      <h1 className="mb-3 text-5xl font-extrabold tracking-wide text-white">
        Guess The Word
      </h1>

      <p className="mb-8 max-w-xl text-center text-lg leading-relaxed text-slate-400">
        Guess the hidden word before every programming language disappears.
      </p>
      <div className="mb-8 w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-amber-400">💡 Hint</h3>

        <p className="text-center text-lg leading-relaxed text-slate-200">
          {hint}
        </p>
      </div>
{!isLoading && GameWon && (
  <div className="mb-6 rounded-lg bg-green-600 px-6 py-4 text-center">
    <h2 className="text-2xl font-bold">🎉 You Won!</h2>
    <p>You guessed the word correctly.</p>
  </div>
)}

{!isLoading && GameOver && (
  <div className="mb-6 rounded-lg bg-red-600 px-6 py-4 text-center">
    <h2 className="text-2xl font-bold">Out of Lives 💔</h2>

  </div>
)}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>

          <p className="mt-6 text-lg text-slate-300">Generating your word...</p>
        </div>
      ) : (
        <>
          {/* Word */}
          <div className="flex gap-2 mb-8">
            {generateWordLetterArr.map((letter) => (
              <div
                key={letter.id}
                className={`
  h-14
  w-14
  rounded-lg
  border-2
  border-slate-600
  text-2xl
  font-bold
  uppercase
  flex
  items-center
  justify-center
  shadow-md
  transition
  ${GameOver ? "bg-red-900" : "bg-slate-800"}
`}
              >
                {GameOver ||
                !letter.isNotVisible ||
                guessedLetters.includes(letter.value.toUpperCase())
                  ? letter.value.toUpperCase()
                  : ""}
              </div>
            ))}
          </div>

          {/* Lives */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {lives.map((language) => (
              <span key={language} className="">
                {language}
              </span>
            ))}
          </div>

          {/* Keyboard */}
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mb-8">
            {keyboardElememnt}
          </div>
        </>
      )}

      <button
        onClick={generateRandomWord}
        className="
mt-4
rounded-xl
bg-blue-600
px-8
py-3
text-lg
font-semibold
shadow-lg
transition-all
duration-200
hover:scale-105
hover:bg-blue-700
active:scale-95
"
      >
        {GameWon || GameOver ? "Play Again" : "Generate New Word"}
      </button>
    </main>
  );
}

export default App;
