// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  //get canvas
  var canvas = document.getElementById("user-image");
  var context = canvas.getContext("2d");
  
  //clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //enable and disable buttons
  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;

  //fill canvas
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  //get dimesnions
  var object = getDimmensions(canvas.width, canvas.height, img.width, img.height);

  //draw image
  context.drawImage(img, object.startX, object.startY, object.width, object.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const image = document.getElementById("image-input");
//loads the image
image.addEventListener('change', () => {
  img.src = URL.createObjectURL(image.files[0]);
  img.alt = image.files[0].name;
});

const meme = document.getElementById("generate-meme");
//creates the meme
meme.addEventListener('submit', (e) => {
  //disable refresh
  e.preventDefault();

  //get canvas and text
  var canvas = document.getElementById("user-image");
  var context = canvas.getContext("2d");
  var top = document.getElementById("text-top").value;
  var bottom = document.getElementById("text-bottom").value;
  
  //style text
  context.font = "30px Comic Sans MS";
  context.textAlign = "center";
  context.fillStyle = "red";
  context.strokeStyle = "black";
  context.strokeText(top, canvas.width/2, 30);
  context.fillText(top, canvas.width/2, 30);
  context.strokeText(bottom, canvas.width/2, canvas.height - 15);
  context.fillText(bottom, canvas.width/2, canvas.height - 15);

  //enable and disable buttons
  document.querySelector("[type='submit']").disabled = true;
  document.querySelector("[type='reset']").disabled = false;
  document.querySelector("[type='button']").disabled = false;
  document.getElementById("voice-selection").disabled = false;
});

const clear = document.querySelector("[type='reset']");
//clears meme canvas
clear.addEventListener('click', () => {
  //get canvas
  var canvas = document.getElementById("user-image");
  var context = canvas.getContext("2d");
  
  //clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //enable and disable buttons
  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;
  document.getElementById("voice-selection").disabled = true;
});

var voice;

speechSynthesis.addEventListener("voiceschanged", () => {
  //get voices
  voice = speechSynthesis.getVoices();

  //place voice into option list
  for(let i = 0; i < voice.length; i++){
    let element = document.createElement("option");
    //name element
    element.textContent = '(' + voice[i].lang + ')' + ' ' + voice[i].name;

    //add default tag 
    if(voice[i].default){
      element.textContent = element.textContent + ' -- Default';
      element.selected = true;
    }

    //add attribute
    element.setAttribute('name', voice[i].name);
    element.setAttribute('lang', voice[i].lang);

    //add element to list
    document.getElementById("voice-selection").appendChild(element);
  }
});

const readText = document.querySelector("[type='button']");
//reads meme text
readText.addEventListener('click', () => {
  var top = document.getElementById("text-top").value;
  var bottom = document.getElementById("text-bottom").value;
  var sayTop = new SpeechSynthesisUtterance(top);
  var sayBottom = new SpeechSynthesisUtterance(bottom);
  var voiceSelected = document.getElementById("voice-selection").value;
  var slide = document.querySelector("[type='range']").value;

  for(let i = 0; i < voice.length; i++){
    if(voice[i].name == voiceSelected){
      sayTop.voice = voice[i];
      sayBottom.voice = voice[i];
    }
  }

  sayTop.volume = slide/100;
  sayBottom.volume = slide/100;
  speechSynthesis.speak(sayTop);
  speechSynthesis.speak(sayBottom);
});

var vol = document.querySelector("[type='range']");

vol.addEventListener('input', () => {
  var slide = vol.value;
  const image = document.querySelector("[id='volume-group']>img");

  if(slide > 66){
    image.src = "icons/volume-level-3.svg";
    image.alt = "Volume Level 3";
  }

  else if(slide > 33){
    image.src = "icons/volume-level-2.svg";
    image.alt = "Volume Level 2";
  }

  else if(slide > 0){
    image.src = "icons/volume-level-1.svg";
    image.alt = "Volume Level 1";
  }

  else {
    image.src = "icons/volume-level-0.svg";
    image.alt = "Volume Level 0";
  }
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
