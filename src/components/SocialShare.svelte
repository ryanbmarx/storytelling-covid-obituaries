<script>
  /**
   * This component adds share buttons to your app, ideally in a drag-and-drop way. If the browser
   * supports native WebSharing, then a webshare button will be displayed. If not, it will be replaced
   * with an email share button using a mailto link. [Current compatibility data](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
   * says this will work in all Safari browsers, Chrome for Android and NOT in any Firefox.
   *
   * If the current site's twitter handle is available in the ga_data, then it will be appended to the tweet.
   *
   * The buttons are muted in style, and pick up --theme-color when hovered/focused.
   *
   * @prop alignment {string}: "left" (default), "center" or "right" will determine which way the buttons align
   * @prop twitter {bool}: default true — false will disable the twitter button.
   * @prop facebook {bool}: default true — false will disable the FB button
   * @prop shareHeadline {string}: required — the headline text for these buttons to serve up. The component will not display without it.
   * @prop shareUrl {string}: defaults to current url — the specific url to be shared. It's best that you set this manually, probably.
   * @prop shareEvent {string}: defaults to 'share-button-click' - the prefix of the event, so you can customize the event per project.
   * @prop shareID {string}: defaults to '' - a unique ID for the share buttons. This is how you can differentiate between button sets on the same page.
   * @prop useBrandColors {boolean} defaults to false. When set to true, icons will use the official brand colors, instead of the gray background
   *
   */

  import { onMount } from "svelte";
  import Link from "../icons/Link.svelte";
  import Twitter from "../icons/Twitter.svelte";

  import TikTok from "../icons/TikTok.svelte";
  import Facebook from "../icons/Facebook.svelte";
  import Email from "../icons/Email.svelte";
  import Share from "../icons/Share.svelte";
  import { fireEvent } from "../utils/analytics";
  import get from "lodash/get";

  export let alignment = "left";
  export let twitter = true;
  export let facebook = true;
  export let tiktok = false;
  export let shareHeadline;
  export let shareUrl =
    typeof window !== "undefined" ? window.location.href : null;
  export let shareEvent = "share-button-click";
  export let shareID = "";
  export let copiedLabelText = "Copied link";
  export let useBrandColors = false;

  let webShareButton;
  let copyButton;
  let hiddenInput;
  let webShare = testForWebShare();
  let facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  let twitterShareUrl = getTwitterShareUrl();
  export let tiktokShareUrl = "https://tiktok.com";
  let emailShareUrl = `mailto:?subject=${encodeURIComponent(
    shareHeadline
  )}&body=${encodeURIComponent(shareHeadline + ": " + shareUrl)}`;

  onMount(() => {
    // Attach a hidden input, for url copying
    hiddenInput = copyButton.querySelector("input.hidden-input");
    if (hiddenInput === null) {
      // Make a hidden input
      hiddenInput = document.createElement("textarea");
      hiddenInput.classList.add("hidden-input");
      hiddenInput.setAttribute("type", "hidden");
      copyButton.appendChild(hiddenInput);
    }
  });

  function handleCopyClick(e) {
    hiddenInput.setAttribute("value", shareUrl);
    hiddenInput.innerHTML = shareUrl;

    // Do the copying
    hiddenInput.focus();
    hiddenInput.select();
    hiddenInput.setSelectionRange(0, hiddenInput.value.length);
    document.execCommand("copy");

    // Make the label appear

    const copiedLabel = document.createElement("span");
    copiedLabel.classList.add("share__copied-label");
    copiedLabel.innerText = copiedLabelText;
    copyButton.appendChild(copiedLabel);

    fireEvent(`${shareEvent}-url-copied-${shareID}`);
    // Remove the label after ~1s
    setTimeout(() => {
      copyButton.removeChild(copiedLabel);
    }, 1100);
  }

  function getTwitterShareUrl() {
    /**
     * getTwitterShareUrl generates the sharing url for twitter. It adds the via @TwitterHandle
     * for the current property, if that info is present in ga_data.
     */

    let via = "";
    if (typeof window !== "undefined") {
      via = get(window, "ga_data.site.twitter.primary_account", "");
    }
    let url = new URL("https://twitter.com/intent/tweet");

    url.searchParams.set("url", shareUrl);
    url.searchParams.set("text", shareHeadline);
    if (via) url.searchParams.set("via", via);

    return url.toString();
  }

  function handleWebShare(e) {
    /**
     * handleWebShare will, if supported, trigger a device's native share functions
     */
    if (webShare) {
      navigator
        .share({
          text: shareHeadline,
          url: shareUrl
        })
        .catch(err => {
          console.error(`Couldn't share because of`, err);
        });
      fireEvent(`${shareEvent}-web-${shareID}`);
    }
  }

  function testForWebShare() {
    /**
     * testForWebShare returns true/false based on whether webshare is supported.
     * You quickly can check this in Safari desktop, which supports WebShare
     */
    if (typeof window !== "undefined") {
      return window.navigator && window.navigator.share;
    }
    return false;
  }

  function twitterShare(e) {
    fireEvent(`${shareEvent}-twitter-${shareID}`);
  }
  function tiktokShare(e) {
    fireEvent(`${shareEvent}-tiktok-${shareID}`);
  }
  function facebookShare(e) {
    fireEvent(`${shareEvent}-facebook-${shareID}`);
  }
  function emailShare(e) {
    fireEvent(`${shareEvent}-email-${shareID}`);
  }
</script>

<style>
  .share.share--brand-colors {
    --color-email: #626262;
    --color-copy-url: #303030;
    --color-tiktok: black;
    --color-twitter: #1da1f2;
    --color-facebook: #3b5998;
  }
  .share {
    --color-email: #aaa;
    --color-copy-url: #aaa;
    --color-tiktok: #aaa;
    --color-twitter: #aaa;
    --color-facebook: #aaa;

    --button-dimension: 44px;
    list-style: none;
    display: flex;
    justify-content: flex-start;

    margin: 1em -14px 1em 0;
    padding: 0;
  }

  .share--center {
    justify-content: center;
  }

  .share--right {
    justify-content: flex-end;
  }

  .share-btn {
    width: 44px;
    height: 44px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    padding: 0;
    position: relative;
    cursor: pointer;

    background: transparent;
  }

  .share-btn__inner {
    width: 30px;
    height: 30px;
    background: #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 150ms ease, opacity 150ms ease;
  }

  .share-btn--tiktok .share-btn__inner {
    background: var(--color-tiktok);
  }

  .share-btn--twitter .share-btn__inner {
    background: var(--color-twitter);
  }

  .share-btn--facebook .share-btn__inner {
    background: var(--color-facebook);
  }

  .share-btn--copy .share-btn__inner {
    background: var(--color-copy-url);
  }

  .share-btn--email .share-btn__inner {
    background: var(--color-email);
  }

  .share:not(.share--brand-colors) .share-btn:hover .share-btn__inner,
  .share:not(.share--brand-colors) .share-btn:focus .share-btn__inner {
    background: var(--theme-color, #009bff);
  }

  .share.share--brand-colors .share-btn:hover .share-btn__inner,
  .share.share--brand-colors .share-btn:focus .share-btn__inner {
    opacity: 0.85;
  }

  .share-btn :global(svg) {
    fill: white;
    width: 60%;
    height: 60%;
    transition: fill 150ms ease;
  }

  .share-btn:hover :global(svg),
  .share-btn:focus :global(svg) {
    fill: var(--theme-color-text, white);
    transition: fill 150ms ease;
  }

  .share :global(.hidden-input) {
    position: fixed;
    top: 100vh;
    left: 100vw;
    height: 0;
    width: 0;
    border: none;
    padding: 0;
    margin: 0;
  }

  @keyframes copiedLabel {
    0% {
      opacity: 0;
      transform: translate(0, 50%);
    }
    70% {
      opacity: 1;
      transform: translate(0, -50%);
    }
    100% {
      opacity: 1;
      transform: translate(0, -50%);
    }
  }

  .share :global(.share__copied-label) {
    font: bold 13px/1em var(--fonts-sans-serif);
    position: absolute;
    top: 50%;
    right: 100%;
    white-space: nowrap;
    margin: 0 5px 0 0;
    padding: 5px;
    background: var(--theme-color, #009bff);
    color: var(--theme-color-text, white);
    animation-name: copiedLabel;
    animation-duration: 500ms;
    animation-iteration-count: 2;
    animation-direction: alternate;
    animation-fill-mode: both;
  }

  .share :global(.share__copied-label::after) {
    content: "";
    background: var(--theme-color, #009bff);
    display: block;
    height: 15px;
    width: 10px;

    position: absolute;
    left: 100%;
    top: 50%;
    transform: translate(0, -50%) rotate(180deg);

    -webkit-clip-path: polygon(0 50%, 100% 0, 100% 100%, 0 50%);
    clip-path: polygon(0 50%, 100% 0, 100% 100%, 0 50%);
  }
</style>

{#if shareHeadline}
  <ul
    class="share"
    class:share--brand-colors={useBrandColors}
    class:share--center={alignment.toLowerCase() === 'center'}
    class:share--right={alignment.toLowerCase() === 'right'}>
    {#if tiktok}
      <li>
        <a
          on:click={tiktokShare}
          target="_blank"
          rel="noreferrer noopener"
          class="share-btn share-btn--tiktok"
          aria-label="Visit TikTok"
          href={tiktokShareUrl}>
          <span class="share-btn__inner">
            <TikTok title="Visit TikTok" />
          </span>
        </a>
      </li>
    {/if}
    {#if twitter}
      <li>
        <a
          on:click={twitterShare}
          target="_blank"
          rel="noreferrer noopener"
          class="share-btn share-btn--twitter"
          aria-label="Share this on Twitter"
          href={twitterShareUrl}>
          <span class="share-btn__inner">
            <Twitter />
          </span>
        </a>
      </li>
    {/if}
    {#if facebook}
      <li>
        <a
          on:click={facebookShare}
          target="_blank"
          rel="noreferrer noopener"
          class="share-btn share-btn--facebook"
          aria-label="Share this on Facebook"
          href={facebookShareUrl}>
          <span class="share-btn__inner">
            <Facebook />
          </span>
        </a>
      </li>
    {/if}
    {#if webShare}
      <li>
        <button
          class="share-btn share-btn--web"
          aria-label="Share this"
          on:click|preventDefault={handleWebShare}>
          <span class="share-btn__inner">
            <Share />
          </span>
        </button>
      </li>
    {:else}
      <li>
        <a
          on:click={emailShare}
          target="_blank"
          rel="noreferrer noopener"
          class="share-btn share-btn--email"
          aria-label="Share this by email"
          href={emailShareUrl}>
          <span class="share-btn__inner">
            <Email />
          </span>
        </a>
      </li>
    {/if}
    <li>
      <button
        class="share-btn share-btn--copy "
        bind:this={copyButton}
        on:click={handleCopyClick}
        aria-label="Copy this url to your clipboard">
        <span class="share-btn__inner">
          <Link title="Copy this url to your clipboard" />
        </span>
        <!-- <span class="share__copied-label">Copied link</span> -->
      </button>
    </li>
  </ul>
{/if}
