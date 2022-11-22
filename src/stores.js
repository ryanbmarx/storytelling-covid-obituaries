import { writable, derived } from "svelte/store";
export let names = writable([]);

// Takes the names, makes a list of the counties used
// Then formats a data blob suitable for our select menu.
export const places = derived(names, $names => {
	if ($names.length <= 1) return [];
	return Array.from(new Set($names.map(n => n.place)));
});

export const namesToShow = writable([]);
