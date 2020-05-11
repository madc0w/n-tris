// const testPiece = [
// 	[false, true, true, false],
// 	[true, true, false, false],
// 	[false, false, false, false],
// 	[false, false, false, false],
// ];

function load() {
	// renderPiece(testPiece);
	// const copy = copyGrid(testPiece);
	// rotatePiece(copy);
	// console.log(equalPieces(copy, testPiece));
	generatePiecesTable();
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
		var html = '';
		for (var n in pieces) {
			// console.log(`=== ${n} ===`);
			n = parseInt(n);
			html += `<div class="pieces-header">${pieces[n].length} &nbsp;&nbsp;${n + 1}-tris pieces :</div>`;
			html += '<div class="pieces-table-wrapper">';
			html += '<table class="pieces-table">';
			var pieceNum = 0;
			for (const piece of pieces[n]) {
				// console.log(`=== pieceNum ${pieceNum} ===`);
				// displayPiece(piece);
				html += generatePieceHtml(piece, pieceNum++);
			}
			html += '</table>';
			html += '</div>';
		}
		document.getElementById('pieces-table-container').innerHTML = html;
	}, 0);
}

function generatePieceHtml(piece, num) {
	var tableRow = `<tr><td></td></tr>`;
	const rgb = hsvToRgb(num / piece.length, 1, 0.6);
	var r = rgb.r.toString(16);
	if (r.length < 2) {
		r = '0' + r;
	}
	var g = rgb.g.toString(16);
	if (g.length < 2) {
		g = '0' + g;
	}
	var b = rgb.b.toString(16);
	if (b.length < 2) {
		b = '0' + b;
	}
	var color = `#${r}${g}${b}`;
	for (const col of piece) {
		tableRow += '<tr>';
		for (const square of col) {
			tableRow += '<td' + (square ? ` style="background-color: ${color};"` : '') + '/>';
		}
		tableRow += '</tr>';
	}
	return tableRow;
}


function generatePieces(n) {
	const pieces = [];
	const grid = makeGrid(n + 2);
	pieces.push([grid]);
	const initSquarePos = Math.floor(n / 2);
	grid[initSquarePos][initSquarePos] = true;

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
						const testingPiece = copyGrid(pieces[i][k]);
						if (equalPieces(testingPiece, piece)) {
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

function addOneSquare(grid) {
	const pieces = [];
	for (var x = 0; x < grid.length; x++) {
		for (var y = 0; y < grid[x].length; y++) {
			if (grid[x][y]) {
				if (x > 0 && !grid[x - 1][y]) {
					const piece = copyGrid(grid);
					piece[x - 1][y] = true;
					// normalizePiece(piece);
					pieces.push(piece);
				}
				if (x < grid.length - 1 && !grid[x + 1][y]) {
					const piece = copyGrid(grid);
					piece[x + 1][y] = true;
					// normalizePiece(piece);
					pieces.push(piece);
				}
				if (y > 0 && !grid[x][y - 1]) {
					const piece = copyGrid(grid);
					piece[x][y - 1] = true;
					// normalizePiece(piece);
					pieces.push(piece);
				}
				if (y < grid.length - 1 && !grid[x][y + 1]) {
					const piece = copyGrid(grid);
					piece[x][y + 1] = true;
					// normalizePiece(piece);
					pieces.push(piece);
				}
			}
		}
	}
	return pieces;
}

function makeGrid(n) {
	const grid = [];
	for (var x = 0; x < n; x++) {
		const row = [];
		for (var y = 0; y < n; y++) {
			row.push(false);
		}
		grid.push(row);
	}
	return grid;
}

function copyGrid(grid) {
	const copy = [];
	for (var x = 0; x < grid.length; x++) {
		const row = [];
		for (var y = 0; y < grid[0].length; y++) {
			row.push(grid[x][y]);
		}
		copy.push(row);
	}
	return copy;
}

function displayPiece(piece) {
	for (const col of piece) {
		var rowStr = '';
		for (const square of col) {
			rowStr += square ? 'X' : '-';
		}
		rowStr += '      ' + Math.random();
		console.log(rowStr);
	}
}


/**
 * in:  0 <= h, s, v <= 1
 * out: 0 <= r, g, b <= 255
 */
function hsvToRgb(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

function rotatePiece(piece, direction) {
	normalizePiece(piece);
	var maxX = 0;
	var maxY = 0;
	for (var x = 0; x < piece.length; x++) {
		for (var y = 0; y < piece[x].length; y++) {
			if (piece[x][y]) {
				maxX = Math.max(maxX, x);
				maxY = Math.max(maxY, y);
			}
		}
	}
	const rPoint = {
		x: Math.floor(maxX / 2),
		y: Math.floor(maxY / 2)
	};

	const newPiece = makeGrid(piece.length);
	for (var x = 0; x < piece.length; x++) {
		for (var y = 0; y < piece[x].length; y++) {
			const px = rPoint.y - y + piece.length;
			const py = x - rPoint.x + piece.length;
			// console.log(px, py);
			if (!newPiece[px]) {
				newPiece[px] = [];
				// console.log(px);
			}
			newPiece[px][py] = piece[x][y];
		}
	}
	normalizePiece(newPiece);
	for (var x = 0; x < piece.length; x++) {
		for (var y = 0; y < piece[x].length; y++) {
			piece[x][y] = newPiece[x][y];
		}
	}
}

function normalizePiece(piece) {
	var minX = piece.length;
	var minY = piece[0].length;
	for (var x = 0; x < piece.length; x++) {
		for (var y = 0; y < piece[x].length; y++) {
			if (piece[x][y]) {
				minX = Math.min(minX, x);
				minY = Math.min(minY, y);
			}
		}
	}

	for (var x = 0; x < piece.length; x++) {
		for (var y = 0; y < piece[x].length; y++) {
			piece[x][y] = (piece[x + minX] || [false])[y + minY] || false;
		}
	}
	return {
		minX,
		minY
	};
}

function equalPieces(p1, p2) {
	if (p1.length != p2.length) {
		return false;
	}

	function equal(_p1, _p2) {
		for (var x = 0; x < _p1.length; x++) {
			for (var y = 0; y < _p1[x].length; y++) {
				if (_p2[x][y] != _p1[x][y]) {
					return false;
				}
			}
		}
		return true;
	}
	p1 = copyGrid(p1);
	normalizePiece(p1);
	p2 = copyGrid(p2);
	normalizePiece(p2);

	for (var r = 0; r < 4; r++) {
		if (equal(p1, p2)) {
			return true;
		}
		rotatePiece(p1);
	}

	return false;
}
