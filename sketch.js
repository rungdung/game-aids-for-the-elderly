
/* 
---
Title: Snakes and Ladders with ML for dice recognition
Author: Adhavan Mohana Sivaraj
Snakes and Ladders code: Thanks to Daniel Shiffman
Abstract: Creating machine learning models for aiding the elderly in game play
Date Last Edited: 19/02/2022

Readme: This is a prototype concept for developing game accessibility aids for the elderly and impaired. 
--- 
*/
let gameState = 0;

//what is the size?
const widthBoard = 500;
const heightBoard = 600;

// What is the state?
const ROLL_STATE = 0; // Rolling the die
const MOVE_STATE = 1; // Moving to next spot
const SNADDER_STATE = 2; // Moving along a Snake or Ladder
let state = ROLL_STATE;

// Array of tiles
let tiles = [];
// One player
let player;

// Unecessary for playing the game
// these variables or for storing all the rolls over time
let rolls = [];
let index = 0;
let averageRolls = 0;
let avgP;

//-------------------------------------------------------------------
//ML from teachable machine

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/ZlJOQ0kU9/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "2";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

const sleep = (millis) => { 
    return new Promise(resolve => setTimeout(resolve, millis)) 
}

//-----------------------------------------------------------------
function setup() {

  createCanvas(800, 800);
  avgP = createP('');

  rolls[index] = 0;

  // Size of tile, columns and rows
  let resolution = 50;
  let cols = width/ resolution;
  let rows = (height / resolution)-4;

  // Create all the tiles from bottom to top
  let x = 0;
  let y = (rows - 1) * resolution;
  let dir = 1;
  for (let i = 0; i < cols * rows; i++) {
    let tile = new Tile(x, y, resolution, i, i + 1);
    tiles.push(tile);
    x = x + (resolution * dir);
    // Move along a winding path up the rows
    if (x >= width || x <= -resolution) {
      dir *= -1;
      x += resolution * dir;
      y -= resolution;
    }
  }

  // Pick random Snakes
  for (let i = 0; i < 3; i++) {
    let index = floor(random(cols, tiles.length - 1));
    // -1 makes in a Snake (drop down a number of spots)
    tiles[index].snadder = -1 * floor(random(index % cols, index - 1));
  }

  // Pick random Ladders
  for (let i = 0; i < 3; i++) {
    let index = floor(random(0, tiles.length - cols));
    tiles[index].snadder = floor(random(cols - (index % cols), tiles.length - index - 1));
  }

  // A new player
  player = new Player();
  
  //video capture
  video = createCapture(VIDEO);
  video.size(100, 100);
  video.hide();
  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

async function draw() {
  frameRate(5);
  background(0);
  
  image(flippedVideo, 50, 650);
  
  
  
  // Draw the label
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text(label,60, 680);
  
  // Draw all the tiles, snakes, and ladders
  for (let tile of tiles) {
    tile.show();
  }
  for (let tile of tiles) {
    tile.showSnadders();
  }

  // Rolling the die
  if (state === ROLL_STATE) {
    player.rollDie();
    
    rolls[index]++;
    player.showPreview();
    state = MOVE_STATE;
    
    // Moving the player
  } else if (state === MOVE_STATE) {
    player.move();
    if (player.isSnadder()) {
      state = SNADDER_STATE;
    } else {
      state = ROLL_STATE;
    }
    // Moving along a Snake or Ladder
  } else if (state === SNADDER_STATE) {
    player.moveSnadder();
    state = ROLL_STATE;
  }

  // Draw the player
  player.show();
  
  
  // Is the game over?
  if (player.spot >= tiles.length - 1) {
    state = ROLL_STATE;
    player.reset();
    index++;
    rolls[index] = 0;
    console.log("GAME OVER")
  }

  // // Compute average rolls to complete game
  // let sum = 0;
  // for (let i = 0; i < rolls.length - 1; i++) {
  //   sum += rolls[i];
  // }
  // let avg = sum / (rolls.length - 1);
  // if (avg) {
  //   avgP.html(avg);
  // }
}

function mousePressed(){
  noLoop()
}

function mouseReleased(){
  loop()
}


function keyPressed() {
  if (keyCode === 32 && gameState==0) {
    noLoop();
    gameState = 1;
  } else if(keyCode === 32 && gameState==1){
    loop();
    gameState = 0;
  }
}