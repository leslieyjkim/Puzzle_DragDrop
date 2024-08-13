"use strict";

// ---- Variables ----

const piecesBox = document.getElementById("piecesBox");
const piecesNumber = 18;
let pieces;

// ---- Creation of the puzzle ----

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

	function createPiece(p) {
		if (p > piecesNumber) createPiece(1);
		else if (deckPieces[p] == 1) createPiece(p + 1);
		else {
			const piece = document.createElement("div");
			piece.classList.add("grid-piece");
			piece.id = getPieceId();
			const img = document.createElement("img");
			img.alt = p;
			img.src = "images/" + p + ".jpg";
			piece.appendChild(img);
			piecesBox.appendChild(piece);
			deckPieces[p] = 1;
		}
	}
}

function getPieceId() {
	// Creates an unique ID that doesn't exist in the DOM
	while(true) {
		const id = Math.floor(Math.random() * 9999) + 1;
		if (document.getElementById("Piece" + id) === null) {
			return "Piece" + id;
		}
	}
}

function removePieces() {
	// Removes all the pieces with an animation
	pieces.forEach(i => i.style.animation = "1s ease forwards disapear");
	setTimeout(() => {
		pieces.forEach(i => i.remove());
	}, 1300);
}

sortPieces(); // Sorts the pieces and starts the game
pieces = document.querySelectorAll(".grid-piece"); // Saves all the pieces in a nodeList after sorting them

// --- Drag and drop actions ----

function dragStart(e) {
	this.style.opacity = "0.5";
	if (this.children.length == 1) {
		e.dataTransfer.clearData();
		e.dataTransfer.setData("text", this.id);
	}
}
function dragOver(e) { e.preventDefault() }
function drop(e) {
	e.preventDefault();
	const data = e.dataTransfer.getData("text");
	if (data.length != 2) {
		const element = document.getElementById(data);
		if (this.children.length == 0) this.appendChild(element.children[0]);
		else if (this.children.length == 1) {
			this.appendChild(element.children[0]);
			element.appendChild(this.children[0]);
			element.style.opacity = "1";
		}
		comprobateComplete(); // Checks if the puzzle if completed
	}
}

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
	const piecesList = document.querySelectorAll(".grid-piece");
	for (let i in piecesList) {
		if (piecesList[i].children[0].alt == parseInt(i) + 1) {
			if (i == 17) {
				makeAnimationPieces();
				break;
			}
		} else break;
	}
}

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
	}, 3100);
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