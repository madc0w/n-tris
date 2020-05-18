// const testPiece = [
// 	[false, true, true, false],
// 	[true, true, false, false],
// 	[false, false, false, false],
// 	[false, false, false, false],
// ];

// const testState = [
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#ffffff'],
// ];

const gameEndDelay = 2000;
const squareSize = 20;
const width = 22;
const height = 40;
const yAcceleration = 0.0001;
const maxYVel = 3.6;
var yVel = 1.2;

var canvas, ctx;
const keysDown = {};
var gameEndTime;
var piece;
var state;

function onLoad() {
	canvas = document.getElementById('game-canvas');
	ctx = canvas.getContext('2d');
	canvas.width = width * squareSize;
	canvas.height = height * squareSize;
	init();
}

function init() {
	// state = testState;
	state = [];
	for (var x = 0; x < width; x++) {
		const col = [];
		for (var y = 0; y < height; y++) {
			col.push(null);
		}
		state.push(col);
	}
	window.requestAnimationFrame(draw);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var isAtBottom = false;
	if (piece) {
		for (var x = piece.min.x; x <= piece.max.x && state[piece.position.x + x]; x++) {
			var maxY = 0;
			for (var py = 0; py <= piece.max.y; py++) {
				if (piece.grid[x][py] && py > maxY) {
					maxY = py;
				}
			}
			if (state[piece.position.x + x][Math.floor(piece.position.y / squareSize) + maxY + 1]) {
				isAtBottom = true;
				break;
			}
		}
	}

	if (piece && piece.position.y < canvas.height - ((piece.max.y + 1) * squareSize) && !isAtBottom) {
		piece.position.y += yVel;
		if (yVel < maxYVel) {
			yVel += yAcceleration;
		}
		// console.log('yVel', yVel);
	} else {
		if (piece) {
			for (var x = piece.min.x; x <= piece.max.x; x++) {
				for (var y = piece.min.y; y <= piece.max.y; y++) {
					if (piece.grid[x][y]) {
						state[piece.position.x + x][Math.floor(piece.position.y / squareSize) + y] = piece.color;
					}
				}
			}

			clearLines();
		}
		const n = Math.floor(Math.random() * pieces.length);
		piece = new Piece(pieces[n][0].length);
		const rPiece = pieces[n][Math.floor(Math.random() * pieces[n].length)];
		piece.set(rPiece);
		piece.normalize();
		const centerX = piece.center.x;
		piece.position.x = Math.floor((canvas.width / (2 * squareSize)) - centerX - 1);
	}

	drawState();
	drawPiece();

	// ctx.strokeStyle = 'white';
	// ctx.lineWidth = 1;
	// ctx.beginPath();
	// ctx.moveTo(canvas.width / 2, 0);
	// ctx.lineTo(canvas.width / 2, canvas.height);
	// ctx.stroke();

	window.requestAnimationFrame(draw);
}

function clearLines() {
	const toClear = [];
	for (var y = state[0].length - 1; y >= 0; y--) {
		var isFullLine = true;
		for (var x = 0; x < state.length; x++) {
			if (!state[x][y]) {
				isFullLine = false;
				break;
			}
		}
		if (isFullLine) {
			toClear.push(y);
		}
	}

	for (const line of toClear) {
		for (var n = line; n >= 0; n--) {
			for (var x = 0; x < state.length; x++) {
				state[x][n] = state[x][n - 1];
			}
		}
	}
}

function drawState() {
	// console.log('state', state);
	for (var x = 0; x < state.length; x++) {
		for (var y = 0; y < state[x].length; y++) {
			if (state[x][y]) {
				// console.log(state[x][y]);
				ctx.fillStyle = state[x][y];
				const px = x * squareSize;
				const py = y * squareSize;
				ctx.fillRect(px, py, squareSize - 2, squareSize - 2);
			}
		}
	}
}

function drawPiece() {
	ctx.fillStyle = piece.color;
	for (var x = 0; x < piece.grid.length; x++) {
		for (var y = 0; y < piece.grid[0].length; y++) {
			if (piece.grid[x][y]) {
				const px = (piece.position.x + x) * squareSize;
				const py = y * squareSize + piece.position.y;
				ctx.fillRect(px, py, squareSize - 2, squareSize - 2);
			}
		}
	}
	// ctx.strokeStyle = 'white';
	// ctx.lineWidth = 2;
	// ctx.beginPath();
	// ctx.rect(piece.position.x * squareSize, piece.position.y, piece.grid.length * squareSize, piece.grid[0].length * squareSize);
	// ctx.stroke();
}

function onKeyUp(e) {
	delete keysDown[e.key];
}

function onKeyDown(e) {
	if (gameEndTime && new Date() - gameEndTime > gameEndDelay) {
		init();
	} else {
		// console.log(e.key);
		keysDown[e.key] = true;
		if (keysDown.ArrowLeft || keysDown.ArrowRight) {
			if (keysDown.Shift) {
				piece.rotate(keysDown.ArrowLeft ? 'left' : 'right');
			} else {
				var newX = null;
				if (keysDown.ArrowLeft) {
					if (piece.position.x > -piece.min.x) {
						newX = piece.position.x - 1;
					}
				} else if (keysDown.ArrowRight) {
					// console.log('***');
					// console.log('piece.position.x ', piece.position.x);
					// console.log('piece.grid.length ', piece.grid.length);
					// console.log('piece.max.x', piece.max.x);
					if (piece.position.x + piece.max.x < width - 1) {
						newX = piece.position.x + 1;
					}
				}

				if (newX != null) {
					var isOverlap = false;
					for (var x = piece.min.x; x <= piece.max.x && state[newX + x]; x++) {
						for (var y = piece.min.y; y <= piece.max.y; y++) {
							if (piece.grid[x][y] && state[newX + x][y + Math.floor(piece.position.y / squareSize)]) {
								isOverlap = true;
								break;
							}
						}
					}

					if (!isOverlap) {
						piece.position.x = newX;
					}
				}
			}
		}
	}
}

function renderPiece(piece) {
	var table = '<table class="pieces-table">';
	table += generatePieceHtml(piece, 0);
	table += '</table>';
	document.getElementById('pieces-table-container').innerHTML = table;
}

function generatePiecesTable() {
	document.getElementById('spinner').className = '';
	document.getElementById('go-button').className = 'hidden';
	const maxN = parseInt(document.getElementById('n-field').value);
	setTimeout(() => {
		const pieces = generatePieces(maxN);
		document.getElementById('spinner').className = 'hidden';
		document.getElementById('go-button').className = '';
		var out = [];
		var html = '';
		for (var n in pieces) {
			const levelPieces = [];
			out.push(levelPieces);
			// console.log(`=== ${n} ===`);
			n = parseInt(n);
			html += `<div class="pieces-header">${pieces[n].length} &nbsp;&nbsp;${n + 1}-tris pieces :</div>`;
			html += '<div class="pieces-table-wrapper">';
			html += '<table class="pieces-table">';
			var pieceNum = 0;
			for (const piece of pieces[n]) {
				const grid01 = [];
				levelPieces.push(grid01);
				for (const col of piece.grid) {
					const gridCol = [];
					grid01.push(gridCol);
					for (const square of col) {
						gridCol.push(square ? 1 : 0);
					}
				}

				// console.log(`=== pieceNum ${pieceNum} ===`);
				// displayPiece(piece);
				html += generatePieceHtml(piece, pieceNum++);
			}
			html += '</table>';
			html += '</div>';
		}
		document.getElementById('pieces-table-container').innerHTML = html;
		console.log('OUTPUT:');
		console.log(JSON.stringify(out));
	}, 0);
}

function generatePieceHtml(piece, num) {
	var tableRows = '';
	const color = hsvToRgb(num / piece.grid.length, 1, 0.6);
	for (const col of piece.grid) {
		tableRows += '<tr>';
		for (const square of col) {
			tableRows += '<td' + (square ? ` style="background-color: ${color};"` : '') + '/>';
		}
		tableRows += '</tr>';
	}
	return tableRows;
}


function generatePieces(n) {
	const pieces = [];
	const p = new Piece(n + 2);
	pieces.push([p]);
	const initSquarePos = Math.floor(n / 2);
	p.grid[initSquarePos][initSquarePos] = true;

	for (var i = 1; i < n; i++) {
		console.log(`${new Date()} : generating ${i + 1}-tris pieces`);
		for (const piece of pieces[i - 1]) {
			pieces[i] = (pieces[i] || []).concat(addOneSquare(piece));
		}
	}

	for (var i = 1; i < n; i++) {
		console.log(`${new Date()} : filtering ${i + 1}-tris pieces`);
		const dupIndexes = [];
		for (var pieceNum = 0; pieceNum < pieces[i].length; pieceNum++) {
			const piece = pieces[i][pieceNum];
			if (!dupIndexes.includes(pieceNum)) {
				for (var k = pieceNum + 1; k < pieces[i].length; k++) {
					if (!dupIndexes.includes(k)) {
						const testingPiece = pieces[i][k];
						if (testingPiece.equals(piece)) {
							dupIndexes.push(k);
						}
					}
				}
			}

			if (pieceNum > 0 && pieceNum % 100 == 0) {
				const percentDone = (100 * pieceNum / pieces[i].length).toFixed(1);
				console.log(`${new Date()} : ${percentDone}%`);
			}
		}

		const uniquePieces = [];
		for (var pieceNum = 0; pieceNum < pieces[i].length; pieceNum++) {
			if (!dupIndexes.includes(pieceNum)) {
				uniquePieces.push(pieces[i][pieceNum]);
			}
		}
		pieces[i] = uniquePieces;
	}
	console.log(`${new Date()} : DONE`);
	return pieces;
}

function addOneSquare(p) {
	const grid = p.grid;
	const pieces = [];
	for (var x = 0; x < grid.length; x++) {
		for (var y = 0; y < grid[x].length; y++) {
			if (grid[x][y]) {
				if (x > 0 && !grid[x - 1][y]) {
					const piece = p.copy();
					piece.grid[x - 1][y] = true;
					pieces.push(piece);
				}
				if (x < grid.length - 1 && !grid[x + 1][y]) {
					const piece = p.copy();
					piece.grid[x + 1][y] = true;
					pieces.push(piece);
				}
				if (y > 0 && !grid[x][y - 1]) {
					const piece = p.copy();
					piece.grid[x][y - 1] = true;
					pieces.push(piece);
				}
				if (y < grid.length - 1 && !grid[x][y + 1]) {
					const piece = p.copy();
					piece.grid[x][y + 1] = true;
					pieces.push(piece);
				}
			}
		}
	}
	return pieces;
}
