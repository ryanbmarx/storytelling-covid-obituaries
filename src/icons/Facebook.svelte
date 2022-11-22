<script>
  /**
This component/svg carries no styles. You will need to style it in the parent component thusly: 

- Put it in a container and size the container.
- In the parent component (or higher up), use a css selector such as `.container :global(svg)` to assign animations, fills and other properties.
- There is an optional title property. It is best to assign one based on the icon's specific usage, for a11y/accesibility reasonss

*/

  export let title = "Facebook";
</script>

<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20">
  {#if title}
    <title>{title}</title>
  {/if}
  <g>
    <path
      d="M7.9,3.9c0,0.5,0,2.7,0,2.7h-2V10h2v10H12V10h2.8c0,0,0.3-1.6,0.4-3.4c-0.4,0-3.1,0-3.1,0s0-2,0-2.3c0-0.3,0.5-0.8,0.9-0.8c0.4,0,1.4,0,2.3,0c0-0.5,0-2,0-3.5c-1.2,0-2.5,0-3.1,0C7.8,0,7.9,3.4,7.9,3.9z" />
  </g>
</svg>
