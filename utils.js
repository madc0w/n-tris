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
	const rgb = {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
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
	const color = `#${r}${g}${b}`;
	return color;

}
