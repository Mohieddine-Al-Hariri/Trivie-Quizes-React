import React from 'react'

export default function StartPage(props) {
    return(
        <div>
            <h1 className='title'>Quizzical</h1>
            <h4 className='description'>Draft Done By: <br />Mohieddine</h4>
            <button className='start-button' onClick={props.startQuiz}>Start Quiz</button>
            <div className='circle two'></div>
        </div>
    )
}