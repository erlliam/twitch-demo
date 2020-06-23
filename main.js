const clientID = 'u837pub66ryla2sfkh19iqp6rudq44';
const getUsersURL = 'https://api.twitch.tv/helix/users';

function parseHash(rawHash) {
  rawHash = rawHash.substring(1);
  return Object.fromEntries(rawHash.split('&').map(v => v.split('=')));
}

let rawHash = decodeURIComponent(document.location.hash);

if (!(rawHash === '')) {
  let hash = parseHash(rawHash);

  if (hash.hasOwnProperty('access_token')) {
    (async () => {
      let accessToken = hash.access_token;

      let userID = await getUserID(accessToken);
      if (userID === -1) {
        console.log('Errors have happeneed');
        return;
      }
      
      if (isSubscribed(userID)) {
        console.log('PogChamp');
      }

    })();
  }
}

async function getUserID(accessToken) {
  let response = await fetch(getUsersURL, {
    headers: {
      'Client-ID': clientID,
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (response.status == 200) {
    let rawJson = await response.json();
    let json = rawJson.data[0];
    return json.id;
  }

  return -1;
}

function isSubscribed(userID) {
  // TODO
  return true;
}

