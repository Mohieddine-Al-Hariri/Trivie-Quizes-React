import React from "react";
import { useImperativeHandle, forwardRef, useEffect, useState } from "react";

const Question = forwardRef((props, ref) => {
  const [clickedAnswerIndex, setClickedAnswerIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  useEffect(() => {
    if (props.isChecked) {
      setIsCorrect(changeIsCorrect()); // in useState to prevent an error
    }
  }, [props.isChecked]);

  // To reference the function in the parent, so parameters can be sent
  useImperativeHandle(ref, () => ({
    checkAnswer() {
      changeIsCorrect();
    },
  }));

  /**
   * changes css and returns true if the clicked answer is correct
   * @returns boolean
   */
  function changeIsCorrect() {
    if (clickedAnswerIndex >= 0) {
      let temp_isCorrect =
        props.answers[clickedAnswerIndex] == props.correctAnswer;
      return temp_isCorrect;
    }
    return false;
  }
  let answerbuttons1 = []; // array to hold the answer buttons created down in the loop
  for (let i = 0; i <= props.answers.length - 1; i++) {
    answerbuttons1.push(
      <button
        className="answer-button"
        style={getAnswerStyle(i)}
        disabled={props.isChecked} // This removes function from each answer button if "check_answers" button is pressed
        key={`b-${i}-${props.question}`}
        onClick={() => handleAnswer(i)}
      >
        {props.answers[i]}
      </button>
    );
  }

  /**
   * Get answer button style
   *
   * @param int answerIndex
   *
   * @return void
   */
  function getAnswerStyle(answerIndex) {
    if (isCorrect === null && clickedAnswerIndex == answerIndex) {
      return { backgroundColor: "#D6DBF5" /*blue*/ };
    } else if (isCorrect === true && clickedAnswerIndex == answerIndex) {
      return { backgroundColor: "#94D7A2" }; // greenish
    } else if (isCorrect === false && clickedAnswerIndex == answerIndex) {
      return { backgroundColor: "#F8BCBC" }; // pinkish
    }
    return { backgroundColor: "white" };
  }

  // to place answers randomly
  let answerbuttons = [];
  let j=0;
  let i = 0;
  while(j<props.answers.length-1){
    if(i == props.thisrandomIndex  ){
      answerbuttons.push(answerbuttons1[props.answers.length - 1]);
    }
    else{ 
      answerbuttons.push(answerbuttons1[j]);
      j++
    }
    if(props.thisrandomIndex == props.answers.length-1 && j == props.answers.length-1){
      answerbuttons.push(answerbuttons1[props.answers.length - 1]);
    }
    i++;
  }

  /**
   * Handle question answering
   *
   * @param int answerIndex
   *
   * @return void
   */
  function handleAnswer(answerIndex) {
    setClickedAnswerIndex(answerIndex);
  }

  return (
    <div className="questions-container">
      <h3 className="Question">{props.question}</h3>
      <div className="buttons-container">{answerbuttons}</div>
    </div>
  );
});

export default Question;