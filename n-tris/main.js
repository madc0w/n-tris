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
const dropSlideTestDelayMs = 120;
const initYVel = 1.4;

// https://freesound.org/browse/tags/sound-effects/
const sounds = {
	click: new Audio('click.mp3'),
	gameOver: new Audio('game-over.mp3'),
	boom: new Audio('boom-2.mp3'),
	rotateRight: new Audio('rotate-right.mp3'),
	rotateLeft: new Audio('rotate-left.mp3'),
};

const keysDown = {};
const pieceQueue = [];
const backgroundImage = new Image();
var canvas, ctx, yVel, gameEndTime, piece, state, prevYVel, dropSlidePiece, isDropSlideTest = false, infoCanvas, infoCtx, score = 0;

function onLoad() {
	canvas = document.getElementById('game-canvas');
	ctx = canvas.getContext('2d');
	canvas.width = width * squareSize;
	canvas.height = height * squareSize;

	infoCanvas = document.getElementById('info-canvas');
	infoCtx = infoCanvas.getContext('2d');

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
	yVel = initYVel;

	for (var i = 0; i < 2; i++) {
		pushPiece();
	}

	window.requestAnimationFrame(draw);
}

function pushPiece() {
	const n = minPieceSize - 1 + Math.floor(Math.random() * (pieces.length - (minPieceSize - 1)));
	// const n = 1;
	const piece = new Piece(pieces[n][0].length);
	const m = Math.floor(Math.random() * pieces[n].length);
	const rPiece = pieces[n][m];
	// console.log('piece: ', n, m);
	piece.set(rPiece);
	piece.normalize();
	piece.position.x = Math.floor((canvas.width / (2 * squareSize)) - piece.center.x - 1);
	// piece.position.y = 500;
	pieceQueue.push(piece);

	infoCtx.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
	var y = 96;
	for (const piece of pieceQueue) {
		const x = Math.floor((infoCanvas.width / squareSize - (piece.max.x - piece.min.x)) / 2);
		piece.draw(infoCtx, {
			x,
			y
		}, squareSize);
		y += piece.max.y * squareSize + 42;
	}
}

function draw() {
	if (gameEndTime) {
		const x = (canvas.width / 2) - 156;
		const y = (canvas.height / 2) - 18;
		const text = 'GAME OVER';
		ctx.fillStyle = '#eee';
		ctx.font = 'bold 52px Lato';
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
					pushPiece();
					piece = pieceQueue.shift();
				}
			}
		}
	}

	drawState();
	piece.draw(ctx, null, squareSize, true);

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
			score++;
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

	infoCtx.fillStyle = '#eee';
	infoCtx.font = 'bold 32px Lato';
	infoCtx.fillText(score, (infoCanvas.width - 22) / 2, 42);

	infoCtx.strokeStyle = '#ddd';
	infoCtx.lineWidth = 2;
	infoCtx.beginPath();
	infoCtx.moveTo(8, 62);
	infoCtx.lineTo(infoCanvas.width - 8, 62);
	infoCtx.stroke();
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
	} else if (piece && !gameEndTime) {
		keysDown[e.code] = true;
		// console.log('keysDown', keysDown);
		if (keysDown.ArrowDown) {
			if (yVel < maxYVel) {
				prevYVel = yVel;
				yVel = maxYVel;
			}
		} else if (!isDropSlideTest && (keysDown.Space || keysDown.ArrowUp)) {
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

				if (x + piece.position.x < state.length) {
					for (var y = Math.floor(piece.position.y / squareSize); y < height; y++) {
						if (state[x + piece.position.x][y]) {
							boardMaxY[x] = height - y;
							break;
						}
					}
				} else {
					console.error();
				}
			}
			var maxX = 0, maxY = 0;
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
			}, dropSlideTestDelayMs);
		}
		if (keysDown.ArrowLeft || keysDown.ArrowRight) {
			if (keysDown.ShiftLeft || keysDown.ShiftRight) {
				// TODO check if rotation would intersect game grid
				var direction, sound;
				if (keysDown.ArrowLeft) {
					direction = 'left';
					sound = sounds.rotateLeft;
				} else {
					direction = 'right';
					sound = sounds.rotateRight;
				}
				piece.rotate(direction);
				playSound(sound);
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

function playSound(_sound) {
	for (const sound in sounds) {
		sounds[sound].pause();
		sounds[sound].currentTime = 0;
	}
	_sound.play();
}
