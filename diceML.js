
/* 
---
Title: Dice recognition using a Teachable Machine trained model
Author: Adhavan Mohana Sivaraj
Abstract: Creating machine learning models for aiding the elderly in game play

Readme: This model recognises dice faces and can be used to count the total value.This was trained and tested on a homemade dice. I have not yet tested it out on enough contexts. It also recognises pieces on the board. One piece was a coin and another a wall hook. While they both are similar, the TM model is able to distinguish.
--- 
*/







// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}