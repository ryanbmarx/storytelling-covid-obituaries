<script>
	import { createEventDispatcher } from "svelte";
	import { fireEvent } from "../utils/analytics";
	export let name;
	export let event;
	let showAge = false;
	let nameInner =
		name.age && showAge
			? `${name.name_display}, <span class="name__age">${name.age}</span>`
			: `${name.name_display}`;

	const dispatch = createEventDispatcher();
</script>

<style>
	.name {
		display: inline-block;
		margin: 0;
		/* Important here b/c of aggressive indepth and UW styles */
		font: 16px / 1.9em var(--fonts);
		color: var(--text-color);
	}

	.name::after {
		content: "•";
		display: inline-block;
		width: 20px;
		text-align: center;
	}

	.name:last-child::after {
		content: none;
	}
	.name__wrapper {
		/* Important to override very specific UL styles in indepth */
		color: var(--text-color) !important;
		text-decoration: none;
	}

	.name :global(.name__age) {
		color: red;
	}

	@media all and (min-width: 1024px) {
		.name {
			font-size: 18px;
		}
	}
</style>

<li id={name.id} class="name">

	<a
		class="name__wrapper"
		href={name.link || 'javascript:void()'}
		on:click|preventDefault={() => {
			fireEvent(`${event}-modal-open-${name.id}`);
			dispatch('modal:open', name);
		}}>
		{@html nameInner}
	</a>

</li>
