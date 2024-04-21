/**
 * Final Project - Particle Board 
 * Heather Chester 
 * 
 * Summary 
 * 
 * 

/**
 * Description of preload
*/

"use strict";

// Setup for ml5 handpose, sampled from Pippin Barr's bubble-popper activity
let video; 
let handpose; 
let predictions = []; 
let modelName = `Handpose`; 

// Global variables for sounds 
let fft; 
let synth; 
let pitchValue = 0; 

let field = {
    balls: [], 
    numBalls: 20
}; 

// Initial loading state 
let state = `loading`; 


function preload() {

}


/**
 * Description of setup
*/
function setup() {
    createCanvas(640, 480); 
    // userStartAudio(); // Starts audio in the program 

    // Setup code for ml5 handPose was sampled from Pippin Barr's bubble-popper activity 
    // User video 
    video = createCapture(VIDEO); 
    video.hide(); 

    // Ml5 setup 
    handpose = ml5.handpose(video, {
        flipHorizontal: true 
    }, function() {
        console.log(`Model loaded.`); 
        state = `simulation`; 
    }); 
    // Listens to presdictions 
    handpose.on(`predict`, function(results) {
        console.log(results); 
        predictions = results;  
    });

    // Set up Balls 
    for (let i = 0; i < field.numBalls; i++) {
        let x = random(0, width); 
        let y = random(0, height); 
        let ball = new Ball(x, y); 
        field.balls.push(ball); 
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

    // simulation(); 
}

function loading() {
    // Sampled loading state from Pippin Barr's bubble-popper acitivity
    background(255); 

    push(); 
    textSize(32); 
    textStyle(BOLD); 
    textAlign(CENTER, CENTER); 
    text(`Loading ${modelName}...`, width/2, height/2); 
    pop(); 
}

function simulation() {
    // User webcam display HANDPOSE 
    const flippedVideo = ml5.flipImage(video);
    image(flippedVideo, 0, 0, width, height); 

    // for (let i = 0; i < field.balls.length; i++) {
    //     let ball = field.balls[i]; 
    //     ball.display(); 
    //     ball.move(); 
    // }

    // Check for new predictions HANDPOSE 
    handleResults();
}

function handleResults() {
    if (predictions.length > 0) {
        const annotations = predictions[0].annotations; 
        handShown(annotations); 
    }
}

function handShown(annotations) {
    let thumbTipY = annotations.thumb[3][1]; 
    let indexTipY = annotations.indexFinger[3][1];
    let middleTipY = annotations.middleFinger[3][1]; 
    let ringTipY = annotations.ringFinger[3][1]; 
    let pinkyTipY = annotations.pinky[3][1];  

    if (indexTipY < thumbTipY && middleTipY < thumbTipY && ringTipY < thumbTipY && pinkyTipY < thumbTipY) {
        console.log("open hand");
    }
    else if (thumbTipY < indexTipY && thumbTipY < middleTipY && thumbTipY < ringTipY && thumbTipY < pinkyTipY) {
        console.log("thumb");
    }
    else if (indexTipY < thumbTipY && indexTipY < middleTipY && indexTipY < ringTipY && indexTipY < pinkyTipY) {
        console.log("index");
    }
    else if (pinkyTipY < thumbTipY && pinkyTipY < indexTipY && pinkyTipY < middleTipY && pinkyTipY < ringTipY) {
        console.log("pinky");
    }
}

function handleBalls() {
    for (let i = 0; i < field.balls.length; i++) {
        let ball = field.balls[i];  
        // ball.update(); 
        // ball.grow(); 
        ball.center(); 
    }
}