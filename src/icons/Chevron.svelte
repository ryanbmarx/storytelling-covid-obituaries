<script>
  /**
This component/svg carries no styles. You will need to style it in the parent component thusly: 

- Put it in a container and size the container.
- In the parent component (or higher up), use a css selector such as `.container :global(svg)` to assign animations, fills and other properties.
- There is an optional title property. It is best to assign one based on the icon's specific usage, for a11y/accesibility reasonss

*/

  export let title = "Chevron";
</script>

<svg role="img" class="icon-chevron" viewBox="0 0 24 24">
  {#if title}
    <title>{title}</title>
  {/if}
  <g>
    <polygon
      id="path-1"
      points="9.23177872 17.3598156 10.7682213 18.6401844 16.3017083 12
      10.7682213 5.3598156 9.23177872 6.6401844 13.6982917 12" />
  </g>
</svg>
