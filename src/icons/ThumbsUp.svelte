<script>
  /**
This component/svg carries no styles. You will need to style it in the parent component thusly: 

- Put it in a container and size the container.
- In the parent component (or higher up), use a css selector such as `.container :global(svg)` to assign animations, fills and other properties.
- There is an optional title property. It is best to assign one based on the icon's specific usage, for a11y/accesibility reasonss

*/

  export let title = "Thumbs up";
</script>

<svg
  role="img"
  class="icon-thumbs-up"
  viewBox="0 0 68 68"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  {#if title}
    <title>{title}</title>
  {/if}
  <g clip-path="url(#clip0)">
    <path
      d="M8.5 25.5H2.83333C2.08189 25.5 1.36122 25.7985 0.829864
      26.3299C0.298511 26.8612 0 27.5819 0 28.3333L0 62.3333C0 63.0848 0.298511
      63.8055 0.829864 64.3368C1.36122 64.8682 2.08189 65.1667 2.83333
      65.1667H11.3333V28.3333C11.3333 27.5819 11.0348 26.8612 10.5035
      26.3299C9.97212 25.7985 9.25145 25.5 8.5 25.5Z" />
    <path
      d="M61.999 23.0435C61.1896 22.7935 60.3472 22.6664 59.5
      22.6666H42.5V14.1666C42.5 3.33198 35.1645 0.164309 31.2857
      -2.40918e-05C30.9043 -0.0134205 30.5241 0.0490583 30.1671 0.183786C29.8101
      0.318514 29.4834 0.522807 29.206 0.784809C28.9297 1.04963 28.71 1.36767
      28.56 1.71974C28.41 2.07181 28.3329 2.45062 28.3333 2.83331V15.9743L17
      29.5743V65.1666H51.6517C53.4725 65.175 55.2473 64.5955 56.7124
      63.5143C58.1775 62.4331 59.2545 60.908 59.7833 59.1656L67.6288
      33.6656C67.9567 32.5985 68.0712 31.4773 67.9657 30.3659C67.8603 29.2545
      67.5369 28.1748 67.0141 27.1884C66.4913 26.2021 65.7794 25.3283 64.9188
      24.6171C64.0583 23.9059 63.0662 23.3712 61.999 23.0435Z" />
  </g>
  <defs>
    <clipPath id="clip0">
      <rect width="68" height="68" />
    </clipPath>
  </defs>
</svg>
