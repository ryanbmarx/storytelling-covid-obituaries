<script>
	export let label = "";
	export let id = "";
	export let muted = false;
	export let href;
</script>

<style>
	:global(.theme--light) .btn {
		--muted-color: rgba(0, 0, 0, 0.2);
	}

	.btn {
		--muted-color: rgba(255, 255, 255, 0.75);

		display: flex;
		justify-content: center;
		align-items: center;
		min-height: var(--input-height, 44px);
		min-width: 44px;
		max-width: 150px;
		margin: 0 auto;

		box-sizing: border-box;
		border: 1px solid var(--color-accent);
		padding: 8px 16px;
		border-radius: var(--border-radius, 5px);
		cursor: pointer;
		text-decoration: none;
		font: 14px/1.3em var(--fonts-sans-serif, sans-serif);
		background-color: var(--color-accent);
		color: var(--color-accent-text);
		transition: all 150ms ease;
		font-weight: bold;
	}

	.btn--muted {
		background-color: transparent;
		color: var(--muted-color);
		cursor: default;
		opacity: 0.5;
		border-color: var(--muted-color);
		font-weight: normal;
	}

	.btn:not(.btn--muted),
	.btn:not(.btn--muted):focus {
		opacity: 0.85;
	}
</style>

{#if href}
	<a {href} {id} class="btn" on:click target="_blank" rel="noopener noreferrer">
		{label}
	</a>
{:else}
	<button {id} class="btn" class:btn--muted={muted} on:click>{label}</button>
{/if}
