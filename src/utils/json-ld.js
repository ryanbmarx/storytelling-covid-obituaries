const publishers = {
	USAT: {
		"@type": "Organization",
		logo: {
			"@type": "ImageObject",
			height: 60,
			width: 338,
			url:
				"https://www.gannett-cdn.com/gannett-web/properties/usatoday/logos-and-branding/logo-amp-results.png",
		},
		name: "USA TODAY",
	},
	PDTF: {
		"@type": "Organization",
		name: "Detroit Free Press",
		logo: {
			"@type": "ImageObject",
			url: "https://www.gannett-cdn.com/sites/freep/images/site-nav-logo@2x.png",
			height: 80,
			width: 297,
		},
	},
	PIND: {
		"@type": "Organization",
		logo: {
			"@type": "ImageObject",
			height: 60,
			url:
				"https://www.gannett-cdn.com/gannett-web/properties/indystar/logos-and-branding/logo-amp-results.png",
			width: 212,
		},
		name: "The Indianapolis Star",
	},
};

export function json_ld({
	ssts = "",
	date_modified = "",
	date_published = "",
	title = "",
	canonical_url = "",
	site_code = "",
	share_image = "",
}) {
	const sstsColon = ssts ? `ssts:${ssts.split("/").join(":")}` : "";
	const jsonldMetadata = {
		contentSourceCode: site_code,
		siteCode: site_code,
		ssts: sstsColon,
		type: "story",
	};

	let json = {
		"@context": "http://schema.org",
		"@type": "NewsArticle",
		author: {},
		dateModified: date_modified,
		datePublished: date_published,
		headline: title,
		image: {
			"@type": "ImageObject",
			url: share_image,
		},
		isBasedOn: canonical_url,
		keywords: ["type:story", sstsColon],
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": canonical_url,
		},
		metadata: JSON.stringify(jsonldMetadata),
	};

	if (site_code && publishers[site_code.toUpperCase()]) {
		json.author = {
			"@type": "Organization",
			name: publishers[site_code.toUpperCase()].name,
		};
		json.publisher = publishers[site_code.toUpperCase()];
	}

	return json;
}
