/**
 * Title of Project
 * Heather Chester 
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 */

"use strict";

/**
 * Description of preload
*/

let video = undefined; 
let handpose = undefined; 
let predictions = []; 

let hands = [];

let soundMaker = {
    sound: [], 
    numSound: 7, 
    soundNote: [60, 62, 64, 65, 67, 69, 71]
}

let state = `loading`; // Initial loading state 
let modelName = `Handpose`; 

let handPositions = { // Change later... 
    thumbTip: {
        x: undefined,
        t: undefined
    },
    indexTip: {
        x: undefined,
        y: undefined
    }, 
    indexBase: {
        x: undefined,
        y: undefined
    } 
}

function preload() {

}


/**
 * Description of setup
*/
function setup() {
    createCanvas(640, 480); 
    userStartAudio(); // Starts audio in the program 

    video = createCapture(VIDEO); 
    video.hide(); 

    handpose = ml5.handpose(video, {
        fliphorizontal: true 
    }, function() {
        console.log(`Model loaded.`); 
        state = `simulation`; 
    }); 

    handpose.on(`predict`, function(results) {
        console.log(results); 
        predictions = results;  
    });

    // handpose.on("hand", results => {
    //     console.log(results); 
    //     predictions = results;  
    // });

    // For setting up Sounds class 
    for (let i = 0; i < soundMaker.numSound; i++) {
        let x = width; 
        let y = height; 
        let sounds = new Sounds(x, y); 
        let note = soundMaker.soundNote[i]; 
        sounds.oscillator.freq(midiToFreq(note)); 
        soundMaker.sound.push(sounds);  
    }
}

/**
 * Description of draw()
*/
function draw() {
    if (state === `loading`) {
        loading(); 
    }
    else if (state === `simulation`) {
        simulation(); 
    }
}

function loading() {
    background(255); 

    push(); 
    textSize(32); 
    textStyle(BOLD); 
    textAlign(CENTER, CENTER); 
    text(`Loading ${modelName}...`, width/2, height/2); 
    pop(); 
}

function simulation() {
    // User webcam display 
    const flippedVideo = ml5.flipImage(video);
    image(flippedVideo, 0, 0, width, height); 

    // Check for new predeictions 
    if (predictions.length > 0) {
        // let hand = predictions[0]; 
        // highlightHand(hand); 
        let results = predictions[0]; 
        handleResults(results); 
    }
}

function highlightHand(hand) {
    let index = hand.annotations.indexFinger[3]; 
    let indexX = index[0]; 
    let indexY = index[1];

    push(); 
    fill(255, 255, 0); 
    ellipse(indexX, indexY, 50); 
    pop(); 
}

function updateHandData() {
    // Get the annptated data in the predictions 
    const annotations = predictions[0].annotations; 

    // Store the relevant positions of the thumb and index finger 
    // Chnage to reflect the functions of this program 
    handPosition.thumbTip.x = annotations.thumb[3][0]; 
    handPosition.thumbTip.y = annotations.thumb[3][1]; 
    handPosition.indexBase.x = annotations.indexFinger[0][0];
    handPosition.indexBase.y = annotations.indexFinger[0][1]; 
    handPosition.indexTip.x = annotations.indexFinger[3][0]; 
    handPosition.indexTip.y = annotations.indexFinger[3][1];  
}

function handleResults(results) { // function for if hands are detected 
    // have function for handling sounds seprate from the results?? 

    // If hand is detected, sounds.soundsOn() will play sound  
    for (let i = 0; i < soundMaker.sound.length; i++) {
        let sounds = soundMaker.sound[i]; 
        sounds.soundsOn(); 
    }
}