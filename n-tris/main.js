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
	var tableRows = '';
	const rgb = hsvToRgb(num / piece.grid.length, 1, 0.6);
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
						// TODO copy??
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
