(() => {
  const clientID = 'u837pub66ryla2sfkh19iqp6rudq44';
  const twitchChannelName = 'nealguides';

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
        checkHelixResult(channelID);
        if (channelID < 0) {
          return;
        }

        let userID = await getUserID(accessToken);
        checkHelixResult(userID);
        if (userID < 0) {
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

  function checkHelixResult(result) {
    if (result === -1) {
      console.log('Unauthorized');
    } else if (result === -2) {
      console.log('Channel not found');
    } else if (result === -3) {
      console.log('Twitch might be down');
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

  async function getIDFromHelixList(response) {
    if (response.status === 200) {
      let rawJson = await response.json();
      if (rawJson.hasOwnProperty('data')) {
        let json = rawJson.data[0];
        if (json === undefined) {
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

  async function getChannelID(accessToken) {
    let response = await helixFetch(searchChannelURL, accessToken);

    let result = getIDFromHelixList(response);

    return result;
  }

  async function getUserID(accessToken) {
    let response = await helixFetch(getUsersURL, accessToken);

    let result = getIDFromHelixList(response);
    return result;
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
