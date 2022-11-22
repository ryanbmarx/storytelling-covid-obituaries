# Covid Obituaries | Gannett Storytelling Studio

This is a project template for [Svelte](https://svelte.dev) apps. Hopefully you've cloned this into [storytelling-studio-apps](https://github.com/GannettDigital/storytelling-studio-apps), which handles most deployment and testing tasks.

_Note that you will need to have [Node.js](https://nodejs.org) installed._

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit GannettDigital/s2-apps-template storytelling-studio-apps/<new-project-slug>
cd <new-project-slug>
```

**Please note:** Your project directory will become the project slug used for deployment, so choose carefully. Calling your project _election_ is bad, _election-2018_ is slightly better, _election-faq-2020_ is much better.

## PROJECT-SPECIFIC STUFF

### Analytics

The base event string will be `storytelling-covid-obits-{propertyName}`. the property name should (will) be the domain for easy differentiating, such as "lohud" or "northjersey."

The following events are tracked in the app:

In view: `{base}-in-view`
In view is not supported in the user's browser: `{base}-no-in-view`
Names opened: `{base}-names-open`
Names collapsed: `{base}-names-close`
County searched: `{base}-county-search`
Name searched: `{base}-name-search` ... the search occurs as the user types, but this only will fire once every 500ms (0.5 seconds) so it's a _suggestion_ of how much it's being used, but not an empirical fact.
Search fields reset with button: `{base}-in-view`
Modal opened: `{base}-in-view`
Modal closed: `{base}-in-view`
Link to obit clicked (from inside modal): `{base}-in-view`

## Get started

Install the dependencies...

```bash
cd <new-project-slug>
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

The dev server will listen on `$PORT` (5000 by default). Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it. The page should reload with your changes.

## Connecting to Google Docs and Sheets

You should be doing this any time there's an editor or reporter involved. Which is to say, almost every project. We use [gootenberg](https://github.com/The-Politico/gootenberg) to pull files from Google Drive. We use a shared Google service account and [JWT authentication](https://github.com/The-Politico/gootenberg/blob/master/docs/docs.jwt.md). If you don't have credentials, please ask.

You will need:

- An environment variable, `$GOOGLE_AUTH_FILE`, pointing to the location of a credentials file (again, ask if you don't have this)
- a spreadsheet or document key, or both, or many of those, depending on the project

Run `gulp auth` to ensure you can authenticate with Google. From there, follow the Gootenberg docs to download and parse [documents with ArchieML](https://github.com/The-Politico/gootenberg/blob/master/docs/parse.archie.md) or [spreadsheets as JSON](https://github.com/The-Politico/gootenberg/blob/master/docs/parse.table.md). These usually live in a `data` task in `gulpfile.js`.

## Using Content API

We can fetch data about Presto assets, which can save us the trouble of managing media or large text files. You'll need `$CONTENT_API_KEY` defined. See past projects for example GraphQL code.

## Handling Google spreadsheet data

Very often, the content for our svelte apps lives in a google spreadsheet. This app template has certain Google Sheets features right out of the box, using gulp to fetch and process that data (after assigning the spreadsheet key to `const SPREADSHEET_KEY`):

- The sheet content is converted into a data.json and stored in `src/content`
- Each tab in that sheet becomes a top-level property of the resulting data object.
- Tab names beginning with underscores are excluded
- By default, each tab is an array of objects and each row in that tab becomes an object of key/value pairs (i.e. `columnName:cellValue`) similar to how `d3.csvParse()` works. Columns whose name begins with an underscore (such as `_notes`) are excluded.
- If the tab contains a column named "key", then that tab simply becomes an object of key/value pairs
- A special case exists for a tab named "top." It is converted to key/value pairs, but those are added as propeties not to `data.top.*` but to the root of `data` object (`data.*`). This is good for things like headlines, titles and decks.

### If you need custom data handling

Sometimes you need to do more work than just what is in a spreadsheet. Maybe your sheet is a series of content IDs, and you need to fetch each one and add it to your data. To facilitate cusstom handling, there is a `const DATA_HANDLERS = {}`. Write your custom function to perform your custom data tasks, and add it to this object using the tab name.

_Example:_

You have a spreadsheeet with a tab named "tweets" containing a list of Twitter post IDs. You can write this function to get the tweets:

```
function getTweets(id){
    // ... Get the tweet ... it's easy
    return tweetEmbed
}
```

Then, instead of using the default tab handling, you can direct `gulp data()` to use this function:

```
const DATA_HANDLERS = {
    tweets: getTweets
}
```

You can mix and match handlers all you want:

```
const DATA_HANDLERS = {
    tweets: getTweets,
    tabName: handlerFunc,
    anotherTabName: anotherHandlerFunc,
    thirdTabName: handlerFunc,
}
```

## Where to put data

For the most part, we're dealing with small amounts of data for each project. By the time it reaches us, whatever data we need should be clean and well-organized. If it's not, we should be talking to the reporters and editors we're working with and/or building in time to do that work.

For small data files, it's often easiest to simply import a JSON (or CSV) file into our codebase. That way everything is available immediately, without waiting for an AJAX call. We don't need a loading state because the data is already loaded.

In these cases, data should live in the `src/content` directory. One plugin, `rollup-plugin-json` is already installed. For CSV, install [`rollup-plugin-dsv`](https://github.com/rollup/rollup-plugin-dsv).

If that doesn't work, or if we need to load data asynchronously, data can live in `public` and be loaded via `fetch()`. Just remember to handle cases where requests take longer than expected or fail entirely.

## Deploying to the web

For the most part, this is automated. The include `Makefile` runs two commands on every pull request and merge: `install` and `build`. Running those commands should put a fully rendered app in `public/`, which Jenkins will upload to the CDN.

If you need to build more frequently, or without going through a PR process, a `deploy.sh` script is included. Please use this judiciously.

You'll need to have Google Cloud configured locally, plus two environment variables for this to work:

- `$CDN_AUTH`
- `$USAT_AUTH`

Both variables allow you to cache bust assets on deploy. Again, use wisely.

## Automation and continuous integration

The platform team uses Jenkins for automated testing and continuous integration, and so do we, but it is disabled by default. Most of the apps built in this repo rely on a manual publishing workflow, in coordination with editorial partners and an automated deployment runs the risk of publishing stale or otherwise bad content. To enable automated deploys on every merge into dev and master, add your needed install and build scripts to the `./Makefile`.

## SSR/UW responses

Most of the apps using this template will be statically rendered into a UW response. It'd probably easiest to crib from the `ssr.js` used in another project. A recent addition to this app is improved JSON-LD

### JSON LD

The JSON-LD data is how robots (i.e. Google and Facebook) access our page's content. The `uw()` function accepts a blob of JSON-LD and will add it to the UW response. The `json_ld()` helper function takes a few inputs and returns the properly-formatted JSON. You don't _need_ all the information to get some JSON, but it's all helpful in maximizing SEO and social metadata, so it's important to include as much as you can.

The function takes the following inputs;

- `ssts`: A single string, with slashes (e.g. "section/subsection/topic/subtopic"). This not only is used as-is but also reformatted for a different JSON-LD field, so it's important to uses the slashes.
- `date_modified` and `date_published`: A standard UTC time code as a string.
- `title`: The page title attribute (not the written-for-humans headline).
- `canonical_url`
- `site_code`: This should be the four-letter code for the canonical content source. This is used in a couple of ways, but primarily to retrieve publisher information in a proper Schema.org format. Right now Indy Star and USAT are loaded. Add the information as needed.
- `share_image`: The absolute CDN path to the share image (make sure it is the `/master/` path and not the `/dev/` path.)

_NOTE: If you have entered a site code and don't see any publisher information, make sure the code is correct (obviously) and that the publisher information is in `json-ld.js`. A future iteration of this feature might fetch that data dynamically from ... somewhere ... but today is not that day._

## Static assets

Static assets (such as images, data files destined for the CDN, etc.) should be stored in `src/static`. The script `npm run static` will copy them into `./public`, copying the file structure of the static folder. This can happen manually, or first thing on `npm run build` and `npm run dev`.

## Components

At your disposal are a few pre-built components. Use and modify as needed. They have their own comments and notes in their respective files:

- Advertisements
- Social buttons
- Timestamp
- Icons: The logos of several social networks, along with several useful shapes, such as chevrons and arrows, are available as individual svelte components. It's best to assign the `title` property to be a good a11y.
