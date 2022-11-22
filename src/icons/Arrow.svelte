<script>
  /**
This component/svg carries no styles. You will need to style it in the parent component thusly: 

- Put it in a container and size the container.
- In the parent component (or higher up), use a css selector such as `.container :global(svg)` to assign animations, fills and other properties.
- There is an optional title property. It is best to assign one based on the icon's specific usage, for a11y/accesibility reasonss

*/

  export let title = "Arrow";
</script>

<svg
  class="icon-arrow"
  viewBox="0 0 24 24"
  fill="none"
  role="img"
  xmlns="http://www.w3.org/2000/svg">
  {#if title}
    <title>{title}</title>
  {/if}
  <path
    d="M17.0858 13H3V11H17.0858L13.7929 7.70712L15.2071 6.29291L20.9142
    12L15.2071 17.7071L13.7929 16.2929L17.0858 13Z" />
  <mask
    id="mask0"
    mask-type="alpha"
    maskUnits="userSpaceOnUse"
    x="3"
    y="6"
    width="18"
    height="12">
    <path
      d="M17.0858 13H3V11H17.0858L13.7929 7.70712L15.2071 6.29291L20.9142
      12L15.2071 17.7071L13.7929 16.2929L17.0858 13Z" />
  </mask>
  <g mask="url(#mask0)">
    <rect
      width="22"
      height="22"
      transform="matrix(-1 0 0 1 23 1)"
      fill-opacity="0.87" />
  </g>
</svg>
