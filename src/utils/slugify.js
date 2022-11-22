/**
 *	Util function that takes a string and makes it a nice, slugified version. To do this, we:
	- split the words, then join on hyphens
	- make it lower case
	- pull punctuation
 * 
 * @param  {...any} words A string with as many words as you want.
 * @returns {string} Slugified version of `words`
 */
function slugify(...words) {
	return words
		.join("-")
		.toLowerCase()
		.replace(/[,.]+/g, "")
		.replace(/\s+/g, "-")
		.replace(/^-|-$/, "");
}

module.exports = slugify;
