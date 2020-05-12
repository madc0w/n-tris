function Piece(n) {
	this.grid = [];
	for (var x = 0; x < n; x++) {
		const row = [];
		for (var y = 0; y < n; y++) {
			row.push(false);
		}
		this.grid.push(row);
	}

	this.copy = () => {
		const copy = new Piece(this.grid.length);
		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[0].length; y++) {
				copy.grid[x][y] = this.grid[x][y];
			}
		}
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
				const px = rPoint.y - y + this.grid.length;
				const py = x - rPoint.x + this.grid.length;
				// console.log(px, py);
				if (!newPiece.grid[px]) {
					newPiece.grid[px] = [];
					// console.log(px);
				}
				newPiece.grid[px][py] = this.grid[x][y];
			}
		}
		newPiece.normalize();
		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				this.grid[x][y] = newPiece.grid[x][y];
			}
		}
	};

	this.normalize = () => {
		var minX = this.grid.length;
		var minY = this.grid[0].length;
		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				if (this.grid[x][y]) {
					minX = Math.min(minX, x);
					minY = Math.min(minY, y);
				}
			}
		}

		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				this.grid[x][y] = (this.grid[x + minX] || [false])[y + minY] || false;
			}
		}
		return {
			minX,
			minY
		};
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
