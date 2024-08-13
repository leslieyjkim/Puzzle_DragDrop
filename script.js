"use strict";
// Enables 'strict mode' which helps catch common coding errors and "unsafe" actions such as defining global variables.

// ---- Variables ----

const piecesBox = document.getElementById("piecesBox");  
// Finds the HTML element with the ID "piecesBox" and assigns it to the variable piecesBox.
const piecesNumber = 18; //representing # of puzzle pcs
let pieces;              //later this will store all puzzle pcs

// ---- Creation of the puzzle ----



//Defines function that sorts puzzle pcs ramdomly.
function sortPieces() {
	// Randomize the position of the pieces inside a "deckPieces" array
	// This array is made to check if a piece is already created
	// deckPieces[n] == 0 means that the piece hasn't been created
	// deckPieces[n] == 1 means that the piece has been created
	const deckPieces = [];
	let j = 1;
	while (j < piecesNumber + 1) {
		deckPieces[j] = 0;
		j++;
	}

	j = 1;
	while (j < piecesNumber + 1) {
		createPiece(Math.floor(Math.random() * 17 + 1));  
		j++;
	}
	// Randomly selects a number from 1 to 18 and calls createPiece() with that number.

	function createPiece(p) {
		if (p > piecesNumber) createPiece(1);
		// If p is greater than 18, restart with 1.
		else if (deckPieces[p] == 1) createPiece(p + 1);
		// If the piece p is already created, try the next piece.
		else {
			const piece = document.createElement("div");
			piece.classList.add("grid-piece");
			piece.id = getPieceId();
			const img = document.createElement("img");
			img.alt = p;
			img.src = "images/" + p + ".jpg"; //ex) .images/1.jpg
			piece.appendChild(img);
			piecesBox.appendChild(piece);
			deckPieces[p] = 1;
		}
		// Create a new div element, 
		// set its class and ID, create an img element, 
		// set its attributes, 
		// append the img to the div, and append the div to the piecesBox. 
		// Mark the piece as created.
	}
}

function getPieceId() {
	// Creates an unique ID that doesn't exist in the DOM
	// Generates a random ID and checks if it exists. If not, returns it.
	while(true) {
		const id = Math.floor(Math.random() * 9999) + 1;
		if (document.getElementById("Piece" + id) === null) {
			return "Piece" + id;
		}
	}
}

function removePieces() {
	// Removes all the pieces with an animation
	pieces.forEach(i => i.style.animation = "1s ease forwards disapear"); //Adds an animationto each piece.
	setTimeout(() => {
		pieces.forEach(i => i.remove());
	}, 1300);  //waits 1.3 seconds and then removes all pieces.
}


sortPieces(); // Sorts the pieces and starts the game
pieces = document.querySelectorAll(".grid-piece"); // Saves all the pieces in a nodeList after sorting them
//selects all elements with the class "grid-piece" and stores them in the 'pieces'variable.





// --- Drag and drop actions ----

function dragStart(e) {         //when the drag action starts.
	this.style.opacity = "0.5"; //Changes the opacity of the dragged element to 0.5
	if (this.children.length == 1) {
		e.dataTransfer.clearData();
		e.dataTransfer.setData("text", this.id);
	}
} //If the element being dragged has one child, 
//clears the drag data and sets the data to the ID of the element. 


function dragOver(e) { e.preventDefault() }  //Prevents the default behavior when dragging over an element. 

function drop(e) {
	e.preventDefault();
	const data = e.dataTransfer.getData("text"); //Gets the ID of the dragged element. Retrieves the data that was set during the 'dragStart'.
	// if (data.length != 2) {                      //Checks if the length of the data(the ID) is not equal 2. IDs with a length of 2 are skipped.
		const element = document.getElementById(data);
		if (this.children.length == 0) 
			this.appendChild(element.children[0]);
		else if (this.children.length == 1) {
			this.appendChild(element.children[0]);
			element.appendChild(this.children[0]);
			element.style.opacity = "1";
		}
		comprobateComplete(); // Checks if the puzzle if completed
	// }
}
//If the dragged element's ID length is not 2, 
//handles the drop logic & checks if the puzzle is completed. 





function addEvents() {
	// Adds the event listeners to all the pieces
	pieces.forEach(i => {
		i.addEventListener("dragstart", dragStart);
		i.addEventListener("dragend", function() { this.style.opacity = "1" });
		i.addEventListener("dragover", dragOver);
		i.addEventListener("drop", drop);
	});
}

function removeEvents() {
	// Removes the event listeners to all the pieces
	pieces.forEach(i => {
		i.removeEventListener("dragstart", dragStart);
		i.removeEventListener("dragover", dragOver);
		i.removeEventListener("drop", drop);
	});
}

addEvents();

// ---- Various functions ----

function comprobateComplete() {
	// Checks if every piece is in the right place and finishes the game
	const piecesList = document.querySelectorAll(".grid-piece");  //Selects all pieces and stores them in 'piecesList'
	for (let i in piecesList) {
		if (piecesList[i].children[0].alt == parseInt(i) + 1) {
			if (i == 17) {
				makeAnimationPieces();
				break;
			}
		} else break;
	}
}
//Loops through all pieces and check if each piece is in the correct position. 
//If all pieces are in place, calls 'makeAnimationPieces()'.

function makeAnimationPieces() {
	// Creates the final animation for the pieces
	const piecesList = document.querySelectorAll(".grid-piece");
	for (let i in piecesList) {
		if (typeof piecesList[i] == "object") {
			removeEvents();
			setTimeout(() => {
				piecesList[i].style.animation = "2s ease-in-out forwards upPiece";
			}, 100 * i);
		}
	}
	setTimeout(()=>{
		resetGame();
	}, 3100); //after 3.1 seconds, calls 'resetGame()'
}

function resetGame() {
	// Resets all the pieces using an animation
	removePieces();
	setTimeout(() => {
		sortPieces(piecesNumber);
		pieces = document.querySelectorAll(".grid-piece");
		addEvents();
	}, 1300);
}

//After 1.3 seconds, calls 'sortPieces()' to create the pieces again, 
// selects the pieces, and adds the event listeners.