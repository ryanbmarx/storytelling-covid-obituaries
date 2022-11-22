<script>
	import MagnifyingGlass from "../icons/MagnifyingGlass.svelte";
	import Clear from "../icons/Clear.svelte";

	export let id;
	export let label;

	// This will hold the value
	export let value;
	export let buttonClearFunction = () => {};
	export let buttonClearTitle = "Clear";
</script>

<style>
	label {
		margin: 0 0 8px 0;
		display: block;
	}
	.search {
		display: flex;
		background: white;
		border-radius: var(--border-radius, 5px);
		box-sizing: border-box;
		font-size: 1em;
		height: var(--input-height, 44px);

		position: relative;
	}

	.search__icon {
		width: 18px;
		padding: 8px 0 8px 8px;

		display: flex;
	}

	.search__icon :global(svg) {
		width: 100%;
		margin: auto;
	}

	.search__input {
		flex: 1 1;
		font-size: 1em;
		padding: 8px;
		border: none;
		margin: 0;
	}

	.search__clear {
		padding: 8px 8px 8px 0;
		cursor: pointer;
		height: 100%;
		width: 44px;

		border: none;
		background-color: transparent;
		display: flex;
	}
	.search__clear :global(svg) {
		fill: #757575;
		margin: auto;
		opacity: 0;
		transition: opacity 150ms ease, fill 150ms ease;
	}

	.search__clear:hover :global(svg),
	.search__clear:focus :global(svg) {
		fill: #000;
	}

	.search__clear.visible :global(svg) {
		opacity: 1;
	}
</style>

<label for={id}>{label}</label>
<div class="search">
	<div class="search__icon">
		<MagnifyingGlass title="Search by name" />
	</div>
	<input
		{id}
		type="text"
		class="search__input"
		placeholder="Start typing to search"
		bind:value
		on:input />
	<button
		class="search__clear"
		class:visible={value.length > 0}
		on:click={buttonClearFunction}>
		<Clear title={buttonClearTitle} />
	</button>
</div>
