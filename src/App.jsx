import React, { useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Die from "./components/Die";
import "./style.css";
import { useEffect } from "react";
import { useRef } from "react";
import BestScore from "./components/BestScore";

function App() {
  const [dice, setDice] = useState(allNewDice);
  const [rolls, setRolls] = useState(0);
  const [status, setStatus] = useState("start");
  const [time, setTime] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [score, setScore] = useState(
    () =>
      JSON.parse(localStorage.getItem("best-score")) || {
        numberOfRolls: 0,
        time: {
          minutes: 0,
          seconds: 0,
        },
      }
  );
  const intervalId = useRef(null);

  function startGame() {
    setStatus("pending");

    let seconds = 0;
    intervalId.current = setInterval(() => {
      if (seconds < 60) {
        setTime((prevTime) => ({ ...prevTime, seconds }));
      } else {
        let minutes = Math.floor(seconds / 60);
        setTime({
          minutes,
          seconds: seconds - minutes * 60,
        });
      }
      seconds++;
    }, 1000);
  }

  useEffect(() => {
    const allHolding = dice.every((die) => die.isHeld === true);
    const isSame = dice.every((die) => die.value === dice[0].value);

    if (allHolding && isSame) {
      saveScore();
      clearInterval(intervalId.current);
      setStatus("finished");
    }
  }, [dice]);

  function saveScore() {
    let newScore;
    if (JSON.parse(localStorage.getItem("best-score"))) {
      newScore = {
        numberOfRolls:
          rolls < score.numberOfRolls ? rolls : score.numberOfRolls,
        time: {
          minutes:
            time.minutes < score.time.minutes
              ? time.minutes
              : score.time.minutes,
          seconds:
            time.seconds < score.time.seconds
              ? time.seconds
              : score.time.seconds,
        },
      };
    } else {
      newScore = {
        numberOfRolls: rolls,
        time,
      };
    }

    setScore(newScore);
    localStorage.setItem("best-score", JSON.stringify(newScore));
  }

  function allNewDice() {
    const dice = [];

    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.ceil(Math.random() * 6);
      dice.push({
        id: nanoid(),
        value: randomNumber,
        isHeld: false,
      });
    }

    return dice;
  }

  function rollDice() {
    if (status === "pending") {
      const newDice = allNewDice();

      setDice((prevDice) => {
        return prevDice.map((die, index) => {
          return die.isHeld ? die : newDice[index];
        });
      });

      setRolls((prevRolls) => prevRolls + 1);
    } else if (status === "finished") {
      setDice(allNewDice);
      setStatus("start");
      setRolls(0);
      setTime({
        minutes: 0,
        seconds: 0,
      });
    }
  }

  function holdDice(id) {
    setDice((prevDice) => {
      return prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      });
    });
  }

  return (
    <>
      <BestScore score={score} />
      <main className="container">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dies-grid">
          {dice.map((die) => (
            <Die
              key={die.id}
              value={die.value}
              isHeld={die.isHeld}
              holdDice={() => holdDice(die.id)}
              status={status}
            />
          ))}
        </div>
        <div className="flex">
          <div>
            {time.minutes}m, {time.seconds}s
          </div>
          {status === "start" ? (
            <button className="roll-button" onClick={startGame}>
              Start
            </button>
          ) : (
            <button className="roll-button" onClick={rollDice}>
              {status === "pending" && "Roll"}
              {status === "finished" && "New Game"}
            </button>
          )}
          <div>{rolls} rolls</div>
        </div>
        {status === "finished" && <Confetti />}
      </main>
    </>
  );
}

export default App;
