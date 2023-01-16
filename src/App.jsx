import { useState, useEffect, useRef } from "react";
import "./App.css";
import StartPage from "./Components/StartPage";
import Question from "./Components/Question";
import Scores from "./Components/Scores";

// https://opentdb.com/api.php?amount=10 //<-- The API link

function App() {
  /********************************** */
  // Task: add delay before starting page
  /********************************** */
  const [mainPage, setMainPage] = useState(true);
  const [data, setData] = useState([]);
  const [areAnswersChecked, setareAnswersChecked] = useState(false);
  const [correctAnswersCounter, setCorrectAnswersCounter] = useState(0);
  const [reset, setReset] = useState(false);
  const [savedScores, setSavedScores] = useState(
    JSON.parse(localStorage.getItem("savedScoresInLocal")) || []
  );

  // get data from API
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then((res) => res.json())
      .then((response) => setData(response.results.slice(0, 4))); // gets only first 4 questions, when needed addition is possible
  }, [reset]);

  const questionsRef = useRef([]);
  const questions = data.map((item, index) => {
    return (
      <Question
        key={item.question} // The question is unique
        question={item.question}
        answers={[...item.incorrect_answers, item.correct_answer]}
        correctAnswer={item.correct_answer}
        isChecked={areAnswersChecked} // for css to know whether the check button is pressed or not
        ref={(el) => (questionsRef.current[index] = el)}
        thisrandomIndex={item.randomIndex}
      />
    );
  });

  /**
   * Check questions answers
   *
   * @return void
   */
  function checkAnswers() {
    setCorrectAnswersCounter(() => {
      return getCorrectAnswersCount(); //update state of correctAsnwersCounter
    });
    refreshScores();

    setSavedScores(JSON.parse(localStorage.getItem("savedScoresInLocal")));
    setareAnswersChecked(true);
  }

  // Starts the quiz
  function toQuizPage() {
    let array = data;
    array = data.map((item) => {
      return {
        ...item,
        randomIndex: Math.floor(
          Math.random() * (item.incorrect_answers.length + 1)
          // To pass a fixed random number to place the correct answer randomly
        ),
      };
    });
    setData(array);
    setMainPage(false);
  }

  function getCorrectAnswersCount() {
    let counter = 0;
    questionsRef.current.forEach((question) => {
      if (question === null) {
        return question;
      }
      if (question.checkAnswer()) {
        counter++;
      }
    });
    return counter;
  }
  function refreshScores() {
    let a = [];
    let local = JSON.parse(localStorage.getItem("savedScoresInLocal"));
    if (local != null && local.constructor === Array) {
      a = [...local];
      a.push(getCorrectAnswersCount());
    } else {
      a = [getCorrectAnswersCount()];
    }
    localStorage.setItem("savedScoresInLocal", JSON.stringify(a));
  }
  function clearScores() {
    localStorage.setItem("savedScoresInLocal", "[]");
    refreshScores();
    setSavedScores([]);
  }
  function newGame() {
    setMainPage(true);
    setareAnswersChecked(false);
    setReset((prev) => !prev);
  }

  let displaySavedScores = [];
  if (savedScores.constructor === Array) {
    displaySavedScores = savedScores.map((each, index) => {
      return (
        <h2 key={"score: " + index} className="h2-displayed-scores">
          {each}{" "}
        </h2>
      );
    });
    displaySavedScores.shift(); //To remove the initial zero
  } else {
    displaySavedScores = (
      <h2 key={"score: 0"} className="h2-displayed-scores">
        {savedScores ?? 0}{" "}
      </h2>
    );
  }
  return (
    <main>
      <Scores
        displaySavedScores={displaySavedScores}
        handleClick={clearScores}
      />
      <div className="circle one"></div>
      <button className="upper-button"></button>
      {mainPage && <StartPage startQuiz={toQuizPage} />}
      {!mainPage && questions}
      <div className="circle two"></div>
      <div className="score-button-container">
        {areAnswersChecked && (
          <h3 className="score">{`You scored ${correctAnswersCounter}/${data.length} correct answers`}</h3>
        )}
        {!mainPage && (
          <button
            className="check-answer"
            onClick={!areAnswersChecked ? checkAnswers : newGame}
          >
            {!areAnswersChecked ? "Check answers" : "New Game"}
          </button>
        )}
      </div>
    </main>
  );
}

export default App;
