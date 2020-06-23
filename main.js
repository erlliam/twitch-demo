(() => {
  const clientID = 'u837pub66ryla2sfkh19iqp6rudq44';
  const twitchChannelName = 'xqcow';

  const searchChannelURL = `search/channels?query=${twitchChannelName}&first=1`
  const getUsersURL = 'users';

  const getHelixURL = (path) => {
    return `https://api.twitch.tv/helix/${path}`;
  }

  const checkSubscriptionURL = (userID, channelID) => {
    return `https://api.twitch.tv/kraken/users/${userID}/subscriptions/${channelID}`;
  };

  const rawHash = decodeURIComponent(document.location.hash);

  if (!(rawHash === '')) {
    let hash = parseHash(rawHash);

    if (hash.hasOwnProperty('access_token')) {
      (async () => {
        let accessToken = hash.access_token;

        let channelID = await getChannelID(accessToken);
        if (channelID === -1) {
          console.log('Unauthorized');
          return;
        } else if (channelID === -2) {
          console.log('Channel not found');
          return;
        } else if (channelID === -3) {
          console.log('Twitch might be down');
          return;
        }

        let userID = await getUserID(accessToken);
        if (userID === -1) {
          console.log('Authentication failed.');
          return;
        }
        
        if (await isSubscribed(accessToken, userID, channelID)) {
          console.log(`User is subscribed to ${twitchChannelName}.`);
        } else {
          console.log(`User is not subscribed ${twitchChannelName}.`);
        }

      })();
    }
  }

  function parseHash(rawHash) {
    rawHash = rawHash.substring(1);
    return Object.fromEntries(
      rawHash.split('&').map(v => v.split('='))
    );
  }

  function helixFetch(path, accessToken) {
    return fetch(getHelixURL(path), {
      headers: {
        'client-id': clientID,
        'authorization': `Bearer ${accessToken}`
      }
    });
  }

  async function getChannelID(accessToken) {
    let response = await helixFetch(searchChannelURL, accessToken);

    if (response.status === 200) {
      let rawJson = await response.json();
      if (rawJson.hasOwnProperty('data')) {
        let json = rawJson.data[0];
        if (json == undefined) {
          return -2;
        } else {
          return json.id;
        }
      }
    } else if (response.status === 401) {
      return -1;
    }

    return -3;
  }

  async function getUserID(accessToken) {
    let response = await helixFetch(getUsersURL, accessToken);

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
})();
