/**
 *
 * Takes any valid hex and converts it to rgba, defaulting to an alpha of 1, if not provided
 * @param {string} h Any hex string, with or without the `#`
 * @param {float} a - The alpha/opacity value. 0 <= a <= 1
 * @returns {string}
 */
export function hexToRGBA(h, a = 1) {
	let r = 0,
		g = 0,
		b = 0;

	if (a < 0) a = 0;
	if (a > 1) a = 1;
	h = h.replace("#", "");

	if (h.length === 3) {
		r = "0x" + h[0] + h[0];
		g = "0x" + h[1] + h[1];
		b = "0x" + h[2] + h[2];
	} else if (h.length === 6) {
		r = "0x" + h[0] + h[1];
		g = "0x" + h[2] + h[3];
		b = "0x" + h[4] + h[5];
	}

	r = +((r / 255) * 100).toFixed(1);
	g = +((g / 255) * 100).toFixed(1);
	b = +((b / 255) * 100).toFixed(1);

	return `rgba(${r}%,${g}%,${b}%,${a})`;
}
