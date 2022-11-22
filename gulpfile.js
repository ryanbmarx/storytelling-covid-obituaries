const assert = require("assert");
const path = require("path");
const ssr = require("./src/utils/ssr.js");

const Gootenberg = require("gootenberg");
const sander = require("sander");
const slugify = require("./src/utils/slugify");

// the directory we're in is our project slug, always
// if you need a different project URL, use UW config
const PROJECT_SLUG = path.basename(process.cwd());

const REQUIRED_ENVS = ["GAPI_CLIENT_EMAIL", "GAPI_PRIVATE_KEY"];

const OUTPUT_DIR = "./src/content";
const STATIC_DIR = "./src/static";

const GIT_BRANCH = process.env.GIT_BRANCH || "dev";
const CDN_ROOT =
	"https://www.gannett-cdn.com/usat-storytelling/storytelling-studio-apps";
const PROJECT_PATH = `${CDN_ROOT}/${GIT_BRANCH}/${PROJECT_SLUG}`;

const SPREADSHEET_KEY = "***";

module.exports = {
	default: check,
	auth,
	data,
	embed,
	uw,
};

async function uw() {
	const uw = await ssr.render();

	return sander.writeFile(
		"./public/uw",
		`${PROJECT_SLUG}.json`,
		JSON.stringify(uw, null, 2)
	);
}

async function check() {
	console.log("Checking configuration.");

	REQUIRED_ENVS.forEach(key => {
		assert(
			key in process.env,
			`${key} not found. Please check your .env and try again.`
		);
	});

	console.log("Good to gulp.");
}

async function auth() {
	const goot = new Gootenberg();
	await goot.auth.jwt();

	return goot;
}

/**
 * This boilerplate data function will pull the contents
 * of a google sheet and process it with the following rules:
 *
 * -  Tab names that begin with an underscore are skipped.
 * -  Tabs with a 'key' column are processed into key-value pairs at data.tab_name
 * -  Tabs without a 'key' column are turned into arrays of objects at data.tab_name
 *    (columns whose name begins with an underscore are skipped)
 * -  If a "top" tab exists, it will be turned into key/value pairs as properties
 *    of the main data object: data.key = value.
 * -  For custom data handling (for any sheet except "top"), write the function you
 *    need and add it to the DATA_HANDLERS object. This will supercede the standard processing
 *    in favor of whatever you need to have happen.
 */

DATA_HANDLERS = {
	// tabname: function
	people: processNames,
};

function processNames(sheet, filename) {
	// We just want the data as it is from the spreadsheet, but written to its own file in static;
	// Without returning anything, it's conveniently omitted from the main data bundle.

	// 1. Get our names in a usuable format
	console.debug(`Starting with ${sheet.length} names.`);
	const names = filterFields(sheet).filter(row =>
		Boolean(row.name_sort || row.name_display)
	);
	console.debug(`Found ${names.length} actual names.`);

	// 2. Add a unique id to make filtering easier
	names.forEach(f => {
		if (f.name_display) f.id = slugify(f.name_display);
	});

	// 3. Make sure the names are in sort order, as defined by the spreadsheet
	names.sort((a, b) => {
		let nameA = a.name_sort || a.name_display;
		let nameB = b.name_sort || b.name_display;
		return nameA.localeCompare(nameB, { sensitivity: "base" });
	});
	sander.writeFile(STATIC_DIR, `${filename}.json`, JSON.stringify(names));
}

async function data() {
	await check();

	// fetch data here
	const goot = await auth();

	const table = await goot.parse.table(SPREADSHEET_KEY);
	let data = {};

	// First, look for a top tab and handle that.
	if (table.top) {
		// Put the key/value pairs into our data container
		data = { ...kv(table.top) };
		// Remove the top from the source data, so we don't also
		// end up with the same content in data["top"]
		delete table.top;
	}

	// iterate over the rest of the sheets

	Object.keys(table).forEach(sheetName => {
		// Skip if sheetname begins with underscore
		if (sheetName.indexOf("_") === 0) return;

		// Is there a custom handler? Use that.
		if (DATA_HANDLERS[sheetName]) {
			data[sheetName] = DATA_HANDLERS[sheetName](table[sheetName], "detroit");
			// Here, `return` works like `continue` in a for loop
			return;
		}

		// Should this sheet be treated as a key/value pair?
		// If it has a column 'key', then yes.
		const isKv = table[sheetName][0].hasOwnProperty("key");
		if (isKv) {
			data[sheetName] = kv(table[sheetName]);
		} else {
			data[sheetName] = filterFields(table[sheetName]);
		}
	});

	return Promise.all([
		sander.writeFile(OUTPUT_DIR, "data.json", JSON.stringify({ ...data }, null, 2)),
	]);
}

// Takes a sheet form Goot and returns an array of the rows
// Automatically strips any column beginning with "_"
function filterFields(sheet) {
	return sheet.map(row => {
		// Strip all underscore-prefixed columns
		Object.keys(row).forEach(k => {
			if (k.indexOf("_") === 0) delete row[k];
		});
		return row;
	}, {});
}

// Takes a sheet from Goot and returns an object of k/v pairs
// Requires columns of "key" and "value"
function kv(obj) {
	return obj.reduce((m, row) => {
		// This, by default, will only pick up the "key" and "value" columns.
		// Anything else, like a "notes" column, will be ignored.
		m[row.key] = row.value;
		return m;
	}, {});
}

/*
Generate an embed.html file that can be used within an In Depth story.
*/
async function embed() {
	const seed = Date.now();
	const css = `${PROJECT_PATH}/bundle.css?c=${seed}`;
	const js = `${PROJECT_PATH}/bundle.js?c=${seed}`;

	const html = `
<div id="${PROJECT_SLUG}"></div>
<link href="${css}" rel="stylesheet" />
<script defer src="${js}"></script>
`;

	return sander.writeFile("./public", "embed.html", html);
}
