// const testPiece = [
// 	[false, true, true, false],
// 	[true, true, false, false],
// 	[false, false, false, false],
// 	[false, false, false, false],
// ];

// const testState = [
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff', '#fff', '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '#fff', null, '#fff'],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// 	[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
// ];

const gameEndDelay = 2000;
const squareSize = 20;
const width = 18;
const height = 32;
const yAcceleration = 0.00024;
const maxYVel = 6.2;
const minPieceSize = 3;
var yVel = 1.4;

// https://freesound.org/browse/tags/sound-effects/
const sounds = {
	click: new Audio('click.mp3'),
	gameOver: new Audio('game-over.mp3'),
	boom: new Audio('boom.mp3'),
};

var canvas, ctx;
const keysDown = {};
var gameEndTime;
var piece;
var state;
var prevYVel;
var dropSlidePiece = null;
var isDropSlideTest = false;
const backgroundImage = new Image();

function onLoad() {
	canvas = document.getElementById('game-canvas');
	ctx = canvas.getContext('2d');
	canvas.width = width * squareSize;
	canvas.height = height * squareSize;

	// img.onload = () => {
	// 	console.log('img load');
	// };
	backgroundImage.src = 'background.jpg';

	document.getElementById('game-container').className = '';
	init();
}

function init() {
	state = [];
	for (var x = 0; x < width; x++) {
		const col = [];
		for (var y = 0; y < height; y++) {
			col.push(null);
			// col.push(testState[x] ? testState[x][y] : null);
		}
		state.push(col);
	}
	gameEndTime = null;
	window.requestAnimationFrame(draw);
}

function draw() {
	if (gameEndTime) {
		const x = (canvas.width / 2) - 190;
		const y = (canvas.height / 2) - 8;
		const text = 'GAME OVER';
		ctx.fillStyle = '#eee';
		ctx.font = 'bold 62px Lato';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 8;
		ctx.strokeText(text, x, y);
		ctx.fillText(text, x, y);
		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 0.4;
	ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1;

	if (!isDropSlideTest) {
		var isAtBottom = false;
		if (piece && !dropSlidePiece) {
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
			if (dropSlidePiece) {
				dropSlidePiece = movePieceX() ? piece : null;
			} else {
				piece.position.y += yVel;
				if (yVel < maxYVel) {
					yVel += yAcceleration;
				}
				// console.log('yVel', yVel);
			}
		} else {
			var isSlidingPiece = false;
			if (piece) {
				if (keysDown.ArrowLeft || keysDown.ArrowRight) {
					// console.log('piece.position', piece.position);
					// console.log('newX', newX);
					isSlidingPiece = movePieceX();
					// console.log('isSlidingPiece ', isSlidingPiece);
				}

				if (!isSlidingPiece) {
					for (var x = piece.min.x; x <= piece.max.x; x++) {
						for (var y = piece.min.y; y <= piece.max.y; y++) {
							if (piece.grid[x][y]) {
								state[piece.position.x + x][Math.floor(piece.position.y / squareSize) + y] = piece.color;
							}
						}
					}

					clearLines();
				}
			}

			if (!isSlidingPiece) {
				playSound(sounds.click);
				if (piece && piece.position.y == 0) {
					gameEndTime = new Date();
					playSound(sounds.gameOver);
				} else {
					const n = minPieceSize - 1 + Math.floor(Math.random() * (pieces.length - (minPieceSize - 1)));
					// const n = 1;
					piece = new Piece(pieces[n][0].length);
					const m = Math.floor(Math.random() * pieces[n].length);
					const rPiece = pieces[n][m];
					// console.log('piece: ', n, m);
					piece.set(rPiece);
					piece.normalize();
					const centerX = piece.center.x;
					piece.position.x = Math.floor((canvas.width / (2 * squareSize)) - centerX - 1);
					// piece.position.y = 500;
				}
			}
		}
	}

	drawState();
	drawPiece();

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

	if (toClear.length > 0) {
		setTimeout(() => {
			playSound(sounds.boom);
		}, 40);
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

	ctx.strokeStyle = '#ddd';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(piece.position.x * squareSize, piece.position.y + (piece.max.y + 1) * squareSize);
	ctx.lineTo(piece.position.x * squareSize, canvas.height);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo((piece.position.x + piece.max.x + 1) * squareSize - 2, piece.position.y + (piece.max.y + 1) * squareSize);
	ctx.lineTo((piece.position.x + piece.max.x + 1) * squareSize - 2, canvas.height);
	ctx.stroke();
}

function onKeyUp(e) {
	delete keysDown[e.code];
	if (prevYVel) {
		yVel = prevYVel;
	}
}

function onKeyDown(e) {
	if (gameEndTime && new Date() - gameEndTime > gameEndDelay) {
		init();
	} else if (!gameEndTime) {
		keysDown[e.code] = true;
		// console.log('keysDown', keysDown);
		if (keysDown.ArrowDown) {
			if (yVel < maxYVel) {
				prevYVel = yVel;
				yVel = maxYVel;
			}
		} else if (keysDown.Space || keysDown.ArrowUp) {
			// console.log('keysDown', keysDown);
			// drop piece
			const pieceMaxY = [];
			const boardMaxY = [];
			for (var x = piece.min.x; x <= piece.max.x; x++) {
				for (var y = piece.min.y; y <= piece.max.y; y++) {
					if (piece.grid[x][y]) {
						pieceMaxY[x] = Math.max(y, pieceMaxY[x] || 0);
					}
				}

				for (var y = Math.floor(piece.position.y / squareSize); y < height; y++) {
					if (state[x + piece.position.x][y]) {
						boardMaxY[x] = height - y;
						break;
					}
				}
			}
			var maxX = 0;
			var maxY = 0;
			for (const x in pieceMaxY) {
				const y = pieceMaxY[x] + (boardMaxY[x] || 0);
				if (y > maxY) {
					maxY = y;
					maxX = x;
				}
			}

			piece.position.y = ((height - (boardMaxY[maxX] || 0) - pieceMaxY[maxX]) - 1) * squareSize;
			isDropSlideTest = true;
			setTimeout(() => {
				isDropSlideTest = false;
				if (keysDown.ArrowRight || keysDown.ArrowLeft) {
					// console.log('isDropSlide');
					dropSlidePiece = piece;
				} else if (dropSlidePiece != piece) {
					for (var x = piece.min.x; x <= piece.max.x; x++) {
						for (var y = piece.min.y; y <= piece.max.y; y++) {
							if (piece.grid[x][y]) {
								state[piece.position.x + x][(height - (boardMaxY[maxX] || 0) - pieceMaxY[maxX]) + y - 1] = piece.color;
							}
						}
					}

					piece = null;
					clearLines();
				}
			}, 120);
		}
		if (piece && (keysDown.ArrowLeft || keysDown.ArrowRight)) {
			if (keysDown.ShiftLeft || keysDown.ShiftRight) {
				// TODO check if rotation would intersect game grid
				piece.rotate(keysDown.ArrowLeft ? 'left' : 'right');
			} else {
				movePieceX();
			}
		}
	}
}

function movePieceX() {
	var newX = piece.position.x;
	if (keysDown.ArrowLeft) {
		if (piece.position.x - piece.min.x > 0) {
			newX--;
		}
	} else if (keysDown.ArrowRight) {
		if (piece.position.x + piece.max.x < width - 1) {
			newX++;
		}
	} else {
		return false;
	}
	for (var x = piece.min.x; x <= piece.max.x && state[newX + x]; x++) {
		for (var y = piece.min.y; y <= piece.max.y; y++) {
			const boardY = y + Math.ceil(piece.position.y / squareSize);
			// if (piece.grid[x][y] && (state[newX + x][boardY] || state[newX + x][boardY - 1])) {
			if (piece.grid[x][y] && state[newX + x][boardY]) {
				return false;
			}
		}
	}

	piece.position.x = newX;
	return true;
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

function playSound(_sound) {
	for (const sound in sounds) {
		sounds[sound].pause();
		sounds[sound].currentTime = 0;
	}
	_sound.play();
}
