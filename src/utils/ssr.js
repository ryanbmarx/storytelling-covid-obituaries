#!/usr/bin/env node

require = require("esm")(module);
require("svelte/register");
const path = require("path");
const sander = require("sander");
const { json_ld } = require("./json-ld.js");

const App = require("../App.svelte").default;
const { UW } = require("./uw.js");

const PROJECT_SLUG = path.basename(process.cwd());
const GIT_BRANCH = process.env.GIT_BRANCH || "dev";
const CDN_ROOT =
	"https://www.gannett-cdn.com/usat-storytelling/storytelling-studio-apps";
const PROJECT_PATH = `${CDN_ROOT}/${GIT_BRANCH}/${PROJECT_SLUG}`;

const CANONICAL_URL =
	"https://www.freep.com/storytelling/coronavirus-obituaries-michigan/";
const SITE_CODE = "PDTF";

module.exports = { render };

// render static html for embedding
async function render() {
	const seed = Date.now();
	const content = await sander
		.readFile(__dirname, "../content/data.json")
		.then(JSON.parse);

	const { html } = App.render(content);

	const styles = [`${PROJECT_PATH}/bundle.css?c=${seed}`];
	const scripts = [`${PROJECT_PATH}/bundle.js?c=${seed}`];
	const shareImage = `${PROJECT_PATH}/share.png`;

	const sstsColon = `ssts:${content.ssts.split("/").join(":")}`;
	const DATE_PUBLISHED = new Date(content.date_published);
	const DATE_MODIFIED = new Date();

	const jsonldMetadata = {
		contentSourceCode: SITE_CODE,
		siteCode: SITE_CODE,
		ssts: sstsColon,
		type: "story",
	};

	return UW({
		title: content.title,
		description: content.meta_description,
		url: CANONICAL_URL,
		share_image: shareImage.toString(),
		share_text: "",
		scripts,
		styles,
		ssts: content.ssts,
		html: `<main id="covid-obituaries-names">${html}</main>`,
		jsonld: json_ld({
			ssts: content.ssts,
			date_modified: DATE_MODIFIED,
			date_published: DATE_PUBLISHED,
			title: content.title,
			canonical_url: CANONICAL_URL,
			site_code: SITE_CODE,
			share_image: shareImage,
		}),
	});
}

if (require.main === module) {
	render()
		.catch(console.error)
		.then(uw => JSON.stringify(uw, null, 2))
		.then(console.log);
}
