<script>
	import { names, namesToShow } from "../stores";
	import { fireEvent } from "../utils/analytics";

	import Button from "./Button.svelte";
	import Name from "./Name.svelte";

	export let event;
	export let no_names_label;

	let open = true;
</script>

<style>
	.names {
		list-style: none;
		padding: 0;
		margin: 30px 0 15px 0;
		text-align: center;
	}
</style>

{#if $namesToShow.length > 0}
	<div class="names__wrapper">
		<ul class="names" class:names--open={open}>
			{#each $namesToShow as name, idx (name.id)}
				<Name {name} {event} on:modal:open />
			{/each}
		</ul>
	</div>
{:else}
	<p>{no_names_label}</p>
{/if}
