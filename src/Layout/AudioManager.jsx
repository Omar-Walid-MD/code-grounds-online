import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playAudio, stopAudio } from '../Store/Audio/audioSlice';

function AudioManager() {

    const sounds = {
        correct: require("../assets/audio/correct.mp3"),
        incorrect: require("../assets/audio/incorrect.mp3"),
        end: require("../assets/audio/end.mp3"),
        countdown: require("../assets/audio/countdown.mp3")

    };

    const audioPlaying = useSelector(store => store.audio.audioPlaying);


    const dispatch = useDispatch();


    return (
        <div className='audio-container'>
        {
            audioPlaying.map((audioKey,index) =>
                <audio autoPlay preload="metadata" src={sounds[audioKey]} key={`audio-${index}`} onEnded={()=>dispatch(stopAudio(audioKey))}></audio>
            )
        }
        </div>
    );
}

export default AudioManager;