let rawHash = decodeURIComponent(document.location.hash);
rawHash = rawHash.substring(1);

let hash = Object.fromEntries(rawHash.split('&').map(v => v.split('=')));

// GET https://api.twitch.tv/helix/users
// The response has a JSON payload with a data field
// containing an array of user-information elements.

(async () => {
  let response = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${hash.access_token}`
    }
  });
  console.log(response)

})();
