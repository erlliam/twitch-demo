const clientID = 'u837pub66ryla2sfkh19iqp6rudq44';
const twitchChannelName = 'strager';

const getChannelIDURL = `https://api.twitch.tv/helix/search/channels?query=${twitchChannelName}&first=1`
const getUsersURL = 'https://api.twitch.tv/helix/users';

const checkSubscriptionURL = (userID, channelID) => {
  return `https://api.twitch.tv/kraken/users/${userID}/subscriptions/${channelID}`;
};

function parseHash(rawHash) {
  rawHash = rawHash.substring(1);
  return Object.fromEntries(
    rawHash.split('&').map(v => v.split('='))
  );
}

let rawHash = decodeURIComponent(document.location.hash);

if (!(rawHash === '')) {
  let hash = parseHash(rawHash);

  if (hash.hasOwnProperty('access_token')) {
    (async () => {
      let accessToken = hash.access_token;

      let channelID = await getChannelID(accessToken);
      if (channelID === -1) {
        alert('Channel does not exist.');
        return;
      }

      let userID = await getUserID(accessToken);
      if (userID === -1) {
        alert('Authentication failed.');
        return;
      }
      
      if (await isSubscribed(accessToken, userID, channelID)) {
        alert(`User is subscribed to ${twitchChannelName}.`);
      } else {
        alert(`User is not subscribed ${twitchChannelName}.`);
      }
    })();
  }
}

async function getChannelID(accessToken) {
  let response = await fetch(getChannelIDURL, {
    headers: {
      'client-id': clientID,
      'authorization': `Bearer ${accessToken}`
    }
  });

  if (response.status === 200) {
    let rawJson = await response.json();
    if (rawJson.hasOwnProperty('data')) {
      let json = rawJson.data[0];
      if (json !== undefined) {
        return json.id;
      }
    }
  }

  return -1;
}

async function getUserID(accessToken) {
  let response = await fetch(getUsersURL, {
    headers: {
      'client-id': clientID,
      'authorization': `Bearer ${accessToken}`
    }
  });

  if (response.status === 200) {
    let rawJson = await response.json();
    let json = rawJson.data[0];
    if (rawJson.hasOwnProperty('data')) {
      let json = rawJson.data[0];
      if (json !== undefined) {
        return json.id;
      }
    }
  }

  return -1;
}

async function isSubscribed(accessToken, userID, channelID) {
  let response = await fetch(checkSubscriptionURL(userID, channelID), {
    headers: {
      'client-id': clientID,
      'authorization': `OAuth ${accessToken}`,
      'accept': 'application/vnd.twitchtv.v5+json'
    }
  });

  if (response.status === 200) {
    return true;
  } else if (response.status === 404) {
    return false;
  }

  return false;
}
