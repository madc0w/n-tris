function Piece(n) {
	this.grid = [];
	this.position = {
		x: 0,
		y: 0
	};
	this.color = null;
	this.min = null;
	this.max = null;
	this.center = null;

	for (var x = 0; x < n; x++) {
		const row = [];
		for (var y = 0; y < n; y++) {
			row.push(false);
		}
		this.grid.push(row);
	}

	this.set = (pieceGrid, isSuppressColorChange) => {
		var n = 0;
		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[0].length; y++) {
				this.grid[x][y] = pieceGrid[x][y];
				if (!isSuppressColorChange && this.grid[x][y]) {
					n += (17 * (x + 1)) + (23 * (y + 1));
				}
			}
		}
		if (!isSuppressColorChange) {
			this.color = hsvToRgb((n % 256) / 256, 1, 0.9);
		}
		this.min = {
			x: this.grid.length,
			y: this.grid[0].length
		};
		this.max = {
			x: 0,
			y: 0
		};
		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				if (this.grid[x][y]) {
					this.min.x = Math.min(this.min.x, x);
					this.min.y = Math.min(this.min.y, y);
					this.max.x = Math.max(this.max.x, x);
					this.max.y = Math.max(this.max.y, y);
				}
			}
		}
		this.center = {
			x: Math.floor(this.min.x + (this.max.x - this.min.x) / 2),
			y: Math.floor(this.min.y + (this.max.y - this.min.y) / 2),
		};
	};

	this.copy = () => {
		const copy = new Piece(this.grid.length);
		copy.set(this);
		return copy;
	};

	this.toString = () => {
		var str = '';
		for (const col of this.grid) {
			for (const square of col) {
				str += square ? 'X' : '-';
			}
			str += '\n';
		}
		return str;
	};

	this.rotate = direction => {
		// console.log('direction ', direction);
		this.normalize();
		var maxX = 0;
		var maxY = 0;
		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				if (this.grid[x][y]) {
					maxX = Math.max(maxX, x);
					maxY = Math.max(maxY, y);
				}
			}
		}
		const rPoint = {
			x: Math.floor(maxX / 2),
			y: Math.floor(maxY / 2)
		};

		const newPiece = new Piece(this.grid.length);
		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				var px, py;
				if (!direction || direction == 'right') {
					px = rPoint.y - y;
					py = x - rPoint.x;
				} else {
					px = y - rPoint.y;
					py = rPoint.x - x;
				}
				px += this.grid.length;
				py += this.grid.length;
				// console.log(px, py);
				if (!newPiece.grid[px]) {
					newPiece.grid[px] = [];
					// console.log(px);
				}
				newPiece.grid[px][py] = this.grid[x][y];
			}
		}
		newPiece.normalize();
		this.set(newPiece.grid, true);
	};

	this.normalize = () => {
		if (this.min == null) {
			this.set(this.grid, true);
		}
		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				this.grid[x][y] = (this.grid[x + this.min.x] || [false])[y + this.min.y] || false;
			}
		}
		this.set(this.grid, true);
	};

	this.equals = (p2) => {
		if (this.grid.length != p2.grid.length) {
			return false;
		}

		function equal(_p1, _p2) {
			for (var x = 0; x < _p1.grid.length; x++) {
				for (var y = 0; y < _p1.grid[x].length; y++) {
					if (_p2.grid[x][y] != _p1.grid[x][y]) {
						return false;
					}
				}
			}
			return true;
		}
		const p1 = this.copy();
		p1.normalize();
		p2 = p2.copy();
		p2.normalize();

		for (var r = 0; r < 4; r++) {
			if (equal(p1, p2)) {
				return true;
			}
			p1.rotate();
		}

		return false;
	};

}
