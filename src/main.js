'use strict';

import WaveSurfer from 'wavesurfer.js';

const waveFormContainer = document.getElementById('waveform');
const audiofileInput = document.getElementById('audio-file-input');
const playPauseButton = document.getElementById('play-pause-button');
const animatedElement = document.getElementById('animated-element');



const wavesurfer = WaveSurfer.create({
    container: waveFormContainer,
    progressColor: "purple",
    barGap: 2,
    barWidth: 3,
    barRadius: 3,
    cursorWidth: 3,
    cursorColor: "purple",
})

wavesurfer.once('decode', () => {
    const slider = document.querySelector('input[type="range"]');

    slider.addEventListener('input', (e) => {
        const minPxPerSec = e.target.valueAsNumber;
        wavesurfer.zoom(minPxPerSec);
    })
})

audiofileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || !files[0]) {
        return;
    }
    const fileUrl = URL.createObjectURL(files[0]);
    wavesurfer.load(fileUrl);
})

playPauseButton.addEventListener('click', () => {
    wavesurfer.playPause();
})

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

const timeEl = document.getElementById('time');
const durationEl = document.getElementById('duration');

wavesurfer.on('decode', (duration) => {
    durationEl.textContent = formatTime(duration);
})

wavesurfer.on('timeupdate', (time) => {
    timeEl.textContent = formatTime(time);
})


