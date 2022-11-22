<script>
	import { fade, fly } from "svelte/transition";
	import { processText } from "../utils/process-text";
	import { namesToShow } from "../stores";
	import { fireEvent } from "../utils/analytics";
	import X from "../icons/X.svelte";
	import Chevron from "../icons/Chevron.svelte";
	import LinkNewWindow from "../icons/LinkNewWindow.svelte";
	import { obit_label, profile_label, other_label } from "../content/data.json";

	export let event;

	$: data = {};
	$: pronoun =
		data.pronoun !== "" && data.pronoun !== "unknown" ? data.pronoun : "their";
	let visible = false;

	const ESCAPE = 27;
	const ARROWLEFT = 37;
	const ARROWRIGHT = 39;

	let prevPerson = null;
	let nextPerson = null;

	export const open = function(name) {
		visible = true;
		lockBody();
		data = name;

		updateModalState(name);
		window.addEventListener("keyup", onKeyup);
	};

	function updateModalState(person) {
		let idx = $namesToShow.indexOf(person);
		if (idx == 0) {
			prevPerson = null;
			nextPerson = $namesToShow[1];
		} else if (idx == $namesToShow.length - 1) {
			prevPerson = $namesToShow[idx - 1];
			nextPerson = null;
		} else {
			prevPerson = $namesToShow[idx - 1];
			nextPerson = $namesToShow[idx + 1];
		}
	}

	function onKeyup(evt) {
		if (evt.keyCode == ARROWLEFT) {
			loadPreviousPerson();
		} else if (evt.keyCode == ARROWRIGHT) {
			loadNextPerson();
		} else if (evt.keyCode == ESCAPE) {
			close();
		}
	}

	function close() {
		fireEvent(`${event}-modal-closed`);

		visible = false;
		unlockBody();
		window.removeEventListener("keyup", onKeyup);
	}

	function loadPreviousPerson() {
		open(prevPerson);
		fireEvent(`${event}-nav-previous`);
	}

	function loadNextPerson() {
		open(nextPerson);
		fireEvent(`${event}-nav-next`);
	}

	function lockBody() {
		document.querySelector("body").classList.add("locked");
	}

	function unlockBody() {
		document.querySelector("body").classList.remove("locked");
	}

	function obitLinkClick(e) {
		fireEvent(`${event}-link-click-${this.parentNode.id}`);
	}
</script>

<style>
	:global(body.locked) {
		overflow: hidden;
	}

	.modal {
		--color-screen: rgba(0%, 0%, 0%, 0.9);
		--color-modal-bg: #222;

		background-color: var(--color-screen);
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		overflow-y: auto;
		position: fixed;
		z-index: 1000;
	}

	.modal__inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		min-height: 100%;
		padding-top: var(--nav-height, 50px);
		width: 100%;
	}

	.modal__content {
		align-items: center;
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		width: 90vw;
		max-width: 600px;
		min-width: 325px;
		position: relative;
		background: var(--color-modal-bg);
		border: 2px solid var(--color-accent);
		box-sizing: border-box;
		padding: 30px;
		text-align: center;
	}

	.headline,
	.modal__content :global(p) {
		color: var(--text-color) !important; /* UW */
	}

	.modal__blurb{
		font-style: italic;
	}
	
	.modal__link {
		font: bold 1em/1.3em var(--fonts-sans-serif);
		text-decoration: none;
		color: var(--text-color);
		cursor: pointer;
	}

	.modal__link-icon {
		display: inline-block;
		width: 0.7em;
		height: 0.7em;
		margin: 0 0 0 0.25em;
		/* background: var(--color-accent); */
	}

	.modal__link-icon :global(svg) {
		width: 100%;
		fill: var(--text-color);
	}

	.modal__img{
		max-height: 150px;
		max-width: 250px;
		border-radius: 50%;
		object-fit: cover;
		object-position: center;
	}

	.icon {
		display: block;
		height: var(--input-height);
		width: var(--input-height);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		fill: var(--text-color);
		stroke: white;
	}

	.icon--hidden {
		visibility: hidden;
	}

	.icon--previous {
		transform: rotate(180deg);
	}

	.icon--close {
		position: absolute;
		top: 0;
		right: 0;
	}

	.icon--close :global(svg) {
		width: 10px;
		stroke-width: 40;
	}

	.modal__content > :global(*) {
		margin: 0 0 8px 0;
	}

	.headline {
		font-family: var(--fonts);
		font-style: italic;
		font-weight: normal;
	}
</style>

{#if visible}
	<aside class="modal" transition:fade={{ duration: 200 }} on:click={close}>
		<div class="modal__inner" transition:fly={{ y: -200, duration: 400 }}>
			<button
				class:icon--hidden={prevPerson == null}
				class="icon icon--previous"
				on:click|stopPropagation={loadPreviousPerson}
				aria-label="See the previous person">
				<Chevron title="Read the next person" />
			</button>
			<div class="modal__content">
				<button class="icon icon--close" aria-label="Click to close" on:click={close}>
					<X title="Click to close" />
				</button>
			
				{#if data.photo_optional}
					<img class="modal__img" src="{data.photo_optional}?width=250" alt="Photo of {data.name_display}" />
				{/if}
				<h1 class="headline">{data.name_display}</h1>
				{#if data.blurb_optional}
					<p class="modal__blurb">{data.blurb_optional}</p>
				{/if}
				{#if data.age}
					<p>Age: {data.age}</p>
				{/if}
				{#if data.place}
					<p>From {data.place}</p>
				{/if}
				{#if data.profile_link}
					<a
						class="modal__link"
						href={data.profile_link}
						target="_blank"
						on:click|stopPropagation={obitLinkClick}
						rel="noopener noreferrer">
						{profile_label}
						<span class="modal__link-icon">
							<LinkNewWindow />
						</span>
					</a>
				{/if}
				{#if data.obit_link}
					<a
						class="modal__link"
						href={data.obit_link}
						target="_blank"
						on:click|stopPropagation={obitLinkClick}
						rel="noopener noreferrer">
						{obit_label}
						<span class="modal__link-icon">
							<LinkNewWindow />
						</span>
					</a>
				{/if}
				{#if data.other_link}
					<a
						class="modal__link"
						href={data.other_link}
						target="_blank"
						on:click|stopPropagation={obitLinkClick}
						rel="noopener noreferrer">
						{other_label}
						<span class="modal__link-icon">
							<LinkNewWindow />
						</span>
					</a>
				{/if}
			</div>
			<button
				class:icon--hidden={nextPerson == null}
				class="icon icon--next"
				on:click|stopPropagation={loadNextPerson}
				aria-label="See the next person">
				<Chevron title="Read the next person" />
			</button>
		</div>
	</aside>
{/if}
