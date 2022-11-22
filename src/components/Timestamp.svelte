<script>
  /**
   *
   * A simple timestamp component for our svelte apps. It requires a human-readable formatted date string
   * for the page load, then updates it with a local time format. The component offers the formatted string
   * from the source data as an accurate, if not 100% locally relevant, reflection of the last update. It
   * then replaces that formatted string with a new string, formatted into the local time zone.
   *
   * @param lastUpdate {string} REQUIRED: A nicely machine-readable time string
   * @param lastUpdateFormatted {string} REQUIRED: A formatted-for-humans date supplied in the source data
   * @param formatString {string} A string suitable for `format()` from [date-fns](https://github.com/date-fns/date-fns).
   * It defaults to a nice, AP-style friendly time-date format
   *
   * */

  import { onMount } from "svelte";
  import { formatAPStyle } from "../utils/format-date-ap-style.js";

  import { parseJSON } from "date-fns";
  import { format } from "date-fns-tz";

  export let lastUpdate;
  export let lastUpdateFormatted;
  export let formatString = "h:m bbbb zzz, MMMM d, yyyy";
  let timestamp, formattedTime;

  onMount(() => {
    let formattedDate = format(parseJSON(lastUpdate), formatString);
    formattedDate = formatAPStyle(formattedDate);
    formattedTime.innerHTML = formattedDate;
    timestamp.classList.remove("timestamp--hidden");
  });
</script>

<style>
  .timestamp {
    font: 14px/1em var(--fonts-sans-serif, sans-serif);
    font-style: italic;
  }
</style>

{#if lastUpdate && lastUpdateFormatted}
  <p class="timestamp" bind:this={timestamp}>
    Last updated:
    <time bind:this={formattedTime} datetime={lastUpdate}>
      {lastUpdateFormatted}
    </time>
  </p>
{/if}
