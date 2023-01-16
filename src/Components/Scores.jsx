import { useState, useEffect } from 'react'

export default function Scores(props){
    
    return(
        <div className='main-scores-container'>
            <h1 className='saved-scores-title'>Scores</h1>
            <div className='saved-scores-container'>
                <button className='localstorage-reset-button' onClick={props.handleClick}> Clear </button>
                {props.displaySavedScores}
            </div>
        </div>
    )
}