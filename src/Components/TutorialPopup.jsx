import React from 'react';

function TutorialPopup({text,position="right"}) {

    const oppositePositions = {
        "left": "right",
        "right": "left",
        "top": "bottom",
        "bottom": "top"
    }

    const translates = {
        "left": "X(50%)",
        "right": "X(-50%)",
        "top": "Y(50%)",
        "bottom": "Y(-50%)"
    }

    return (
        <div className='tutorial-popup position-absolute d-flex align-items-center justify-content-center' style={{[oppositePositions[position]]:"calc(100% + 1rem)"}}>
            <div className='tutorial-popup-text bg-black p-3 fs-5'>{text}</div>
            <div className='tutorial-popup-pointer position-absolute'
            style={{[oppositePositions[position]]:"0",transform:`translate${translates[position]} rotate(45deg)`}}
            ></div>
        </div>
    );
}

export default TutorialPopup;