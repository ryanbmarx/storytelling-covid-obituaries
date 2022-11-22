<script>
	// UTILS
	import { onMount } from "svelte";
	import * as analytics from "./utils/analytics.js";
	import { hexToRGBA } from "./utils/colors";
	import { names, namesToShow } from "./stores";
	import { base } from "./utils/links";
	import { processText } from "./utils/process-text";

	// COMPONENTS
	import Names from "./components/Names.svelte";
	import Filters from "./components/Filters.svelte";
	import Modal from "./components/Modal.svelte";
	import Flourish from "./components/Flourish.svelte";
	import LoadingDashCircle from "./icons/LoadingDashCircle.svelte";
	import Button from "./components/Button.svelte";

	export let headline;
	export let intro;
	export let submit_label = "Submit a name";
	export let submit_link = "#";
	export let no_names_label = "No names.";
	export let location_filter_label = "Location";

	let event = `storytelling-covid-obits-detroit`;

	let obits;
	let hidden = false;
	let { BASE_URL, ASSET_PATH } = base();
	let bgScreenColor = hexToRGBA("#fed874", 0.07);

	let modal;
	function openModal(e) {
		modal.open(e.detail);
	}

	onMount(() => {
		const dataUrl = new URL(`detroit.json`, ASSET_PATH);
		dataUrl.searchParams.set("d", Date.now());

		fetch(dataUrl.toString())
			.then(resp => resp.json())
			.then(data => {
				$names = data;
				$namesToShow = data;
			});
	});
</script>

<style>
	:global(html body) {
		--color-gold: #fed874;
		--color-grey: #aaa;
		--color-accent: var(--theme-color, var(--color-gold, #fed874));
		--color-accent-text: var(--theme-color-text, black);
		--color-name: #555555;

		--fonts: "Georgia", "Times New Roman", serif;
		--fonts-sans-serif: "Unify Sans", "Helvetica", "Arial", sans-serif;
		--nav-height: 50px;
		--border-radius: 5px;
		--input-height: 44px;

		--background-color: #222;
		--text-color: white;

		/* UW */
		--font-color: var(--text-color, white);
		background: var(--background-color, #222);
	}

	:global(html .generic-content-container) {
		/* Another UW fix */
		--color-background: var(--background-color, #222);
	}

	:global(#covid-obituaries-names) {
		width: 100vw;
		margin-left: calc(-1 * var(--article-padding-horiz));
	}

	.obits {
		background: var(--background-color);
		margin: 60px 0;
		box-sizing: border-box;
		padding: 30px;
		text-align: center;
		max-width: 1300px;
		margin: 0 auto;
	}

	.obits :global(p) {
		color: var(--text-color);
	}

	.obits :global(a:not([class])) {
		color: var(--text-color, white);
		text-decoration-color: var(--color-accent, #fed874);
	}


	:global(.max-width) {
		max-width: 750px;
		margin: 0 auto;
	}

	.obits__flourish {
		width: 75px;
		margin: 0 auto 16px auto;
	}

	.obits__flourish :global(svg) {
		fill: var(--color-accent);
	}

	.obits .hede {
		font-family: var(--fonts);
		font-style: italic;
		font-weight: normal;
		font-size: var(--type-2, calc(20px + 8 * (100vw - 320px) / 880));
		color: var(--text-color) !important; /* UW styles */
	}

	.obits :global(p:not([class])) {
		font: 16px/1.2em var(--fonts-sans-serif);
		margin: 1em 0;
		color: var(--text-color);
	}
	.obits :global(.spinner) {
		fill: var(--text-color);
	}
	@media all and (min-width: 1024px) {
		.obits__flourish {
			width: 110px;
		}
	}
</style>

<div class="obits">
	<div class="obits__flourish">
		<Flourish />
	</div>
	<div class="obits__intro max-width">
		<h1 class="hede">{headline}</h1>
		<p>{@html processText(intro)}</p>
		{#if submit_link}
			<Button
				id="submit"
				href={submit_link}
				label={submit_label}
				on:click={() => {
					analytics.fireEvent('storytelling-covid-obits-detroit-submit-name');
				}} />
		{/if}
	</div>
	{#if $names.length > 0}
		<Filters {event} count={$namesToShow.length} {location_filter_label}/>
		<Names {event} {no_names_label} on:modal:open={openModal} />
	{:else}
		<LoadingDashCircle width="50px" />
	{/if}
</div>
<Modal bind:this={modal} {event} />
