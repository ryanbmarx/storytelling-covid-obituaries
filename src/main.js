import App from "./App.svelte";
import data from "./content/data.json";

Array.from(document.querySelectorAll("#covid-obituaries-names")).forEach(c => {
	const app = new App({
		hydrate: true,
		target: c,
		props: {
			...data,
		},
	});
});

export default app;
