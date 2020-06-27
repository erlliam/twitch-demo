Step 1:

The first thing you have to do is register an application.
Head over to: https://dev.twitch.tv/dashboard/apps/create

Here you will have to name your application and choose
a redirect URL. This URL is where Twitch will send the user
after authenticating/failing.

Step 2:

The way to use Twitch's API is to send the user over to
this link using a GET request. You can accomplish this
using JavaScript or creating a link in the HTML:

https://id.twitch.tv/oauth2/authorize
?client_id=<your client ID>
&redirect_uri=<your registered redirect URI>
&response_type=token
&scope=user_subscriptions

The client ID comes from that application in step 1.
The same applies for the redirect URL.

For my code to work, you will have to put that client ID
in the variable at the top called clientID.

Step 3:

At this point, the user has been sent over to the Twitch
authentication site. If the user accepts and logs in, they
are now sent to that redirect URL. The OAuth token will be
inside of the URL. It should look like:

<your registered redirect URL>#access_token=<an access token>

Ex:

https://nealguides.com/twitch-authentication#access_token=<TOKEN>

If you were to use https://nealguides.com/twitch-authentication
as your redirect URL.

Step 4:

You will have to access this token and use it to make the
requests to Twitch. My code does all of this. My JavaScript
code will find the access token. Using the token it will:

  Find the channel ID of a specified channel.
  Find the user ID of the user who has been authenticated.
  Finally it will check if the user is subscribed to the
  channel.

Step 5:

This is where you now know if the user is subscribed to
your channel or not.

