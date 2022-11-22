<script>
	import { names, places, namesToShow } from "../stores";
	import debounce from "lodash.debounce";
	import { fireEvent } from "../utils/analytics";
	import { instructions } from "../content/data.json";

	import Button from "./Button.svelte";
	import InputText from "./InputText.svelte";
	import InputSelect from "./InputSelect.svelte";

	import MagnifyingGlass from "../icons/MagnifyingGlass.svelte";
	import Clear from "../icons/Clear.svelte";
	export let event;
	export let count = 0;
	export let location_filter_label = "Location";
	
	let nameInput;
	let placeInput;

	const ALL_PLACES = "all-counties";
	let showAll = { label: "Show all counties", value: ALL_PLACES };
	
	// This is our list of counties or places. They will be in alpha order
	// and any blank/empty places (resulting from non-entries in the spreadsheet)
	// will be omitted.
	let options = $places.map(c => {
		return { label: c, value: c };
	}).sort((a,b)=> a.label > b.label ? 1 : -1);

	// This is the value holding the text search input
	let nameSearch = "";

	$: placeSearch = ALL_PLACES;
	$: searching = nameSearch === "" && placeSearch != ALL_PLACES;

	function handleSearch(e) {
		searching = true;
		$namesToShow = $names.filter(
			n =>
				n.name_display.toLowerCase().indexOf(nameSearch.toLowerCase()) > -1 &&
				(n.place === placeSearch || placeSearch === ALL_PLACES)
		);
	}

	function resetSearch(e) {
		fireEvent(`${event}-search-reset`);
		searching = false;
		placeInput.value = ALL_PLACES;
		resetNameSearch();
	}

	function resetNameSearch() {
		nameSearch = "";
		handleSearch(null);
	}

	handleSearch = debounce(handleSearch, 100);

	const handleNameSearch = debounce(function(e) {
		fireEvent(`${event}-name-search`);
	}, 500);
</script>

<style>
	.filters {
		font: bold 13px/1.3em var(--fonts-sans-serif);
		display: grid;
		grid-template: auto / 1fr 100px;
		grid-gap: 15px;
		text-align: left;
		color: var(--text-color);
	}

	.field--name {
		grid-column: 1 / -1;
		width: 100%;
	}

	.filters :global(.btn) {
		width: 100%;
		align-self: end;
	}

	@media all and (min-width: 768px) {
		.filters {
			grid-template: 1fr / 1fr 1fr 100px;
		}

		.field--name {
			grid-column: auto;
		}
	}
</style>

<div class="max-width">
	<p>{instructions}</p>
</div>
<div class="filters">
	<div class="field field--name">
		<InputText
			id="nameSearch"
			label="Search by name"
			bind:value={nameSearch}
			bind:this={nameInput}
			buttonClearFunction={resetNameSearch}
			buttonClearTitle="Clear this search"
			on:input={e => {
				handleNameSearch(e);
				handleSearch(e);
			}} />
	</div>
	<div class="field field--counties">
		<InputSelect
			id="placeSearch"
			label={location_filter_label}
			bind:value={placeSearch}
			bind:this={placeInput}
			on:input={handleSearch}
			on:input={e => {
				fireEvent(`${event}-place-search`);
			}}
			{options}
			{showAll} />
	</div>
	<Button label="Clear" muted={!searching} on:click={resetSearch} />
</div>
{#if count > 1}
	<p>Now showing {count} people</p>
{:else if count === 1}
	<p>Now showing 1 person</p>
{/if}
