function load() {
	generatePiecesTable();
}

function generatePiecesTable() {
	const maxN = parseInt(document.getElementById('n-field').value);
	const pieces = generatePieces(maxN);
	var table = '<table class="pieces-table">';
	for (var n in pieces) {
		n = parseInt(n);
		table += `<tr><td colspan="100">${n + 1}-tris pieces:</td></tr>`;
		var pieceNum = 0;
		for (const piece of pieces[n]) {
			table += `<tr><td></td></tr>`;
			const rgb = hsvToRgb(pieceNum / pieces[n].length, 1, 0.6);
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
				table += '<tr>';
				for (const square of col) {
					table += '<td' + (square ? ` style="background-color: ${color};"` : '') + '/>';
				}
				table += '</tr>';
			}
			pieceNum++;
		}
	}
	table += '</table>';
	document.getElementById('pieces-table-container').innerHTML = table;
}


function generatePieces(n) {
	const pieces = [];
	const grid = makeGrid(n);
	pieces.push([grid]);
	grid[0][0] = true;

	for (i = 1; i < n; i++) {
		for (const piece of pieces[i - 1]) {
			pieces[i] = (pieces[i] || []).concat(addOneSquare(piece));
		}
	}
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
					pieces.push(piece);
				}
				if (x < grid.length - 1 && !grid[x + 1][y]) {
					const piece = copyGrid(grid);
					piece[x + 1][y] = true;
					pieces.push(piece);
				}
				if (y > 0 && !grid[x][y - 1]) {
					const piece = copyGrid(grid);
					piece[x][y - 1] = true;
					pieces.push(piece);
				}
				if (y < grid.length - 1 && !grid[x][y + 1]) {
					const piece = copyGrid(grid);
					piece[x][y + 1] = true;
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
