## Instructions for Hosted

### Home (Last.fm Chart)

1. [Open the homepage](https://spotify-fm-next.onrender.com) to see Last.fm's global top 50 tracks for today
2. Check the Trend column to see how much each track has moved since yesterday (or if it's new on the chart)
3. Search for track or artist or use the filter to only see the artists you want
4. Click a column header to sort
5. Click an artist or track name to open it on Last.fm in a new tab

### My Tracks (Personal Spotify Tracks)

1. Log in with Spotify (note that Spotify only lets invited accounts log in to apps in development mode, so please send me your Spotify account email at weverhall@gmail.com to get access!)
2. Pick a time period to see your top tracks from the last 4 weeks, 6 months or 1 year
3. Press play on a track to listen to it in the player at the bottom of the page
4. Click the heart icon to save a track to your favorites and tap it again to remove it
5. Click an album cover to open the album on Spotify
6. Click your profile avatar to open your profile page on Spotify
7. Return back to homepage by clicking the arrow icon at the top-right of the page

### Demo (Mock Spotify Tracks)

1. Click "Try the demo" on the homepage to try My Tracks with sample data, no login needed
2. Same instructions as for the real My Tracks page

## Instructions for Local/Tunneling

### Home (Last.fm Chart)

1. Clone the repo and run npm install at the root
2. Rename !.env.example to .env.local and fill in your Last.fm API key
3. Start the app with npm run docker:up
4. Open http://localhost:3000
5. Stop and remove containers with npm run docker:down

### My Tracks (Personal Spotify Tracks)

To make a real Spotify login possible, use command npm run tunnel to get a public address for the app. Then use the address you received for BASE_URL and REDIRECT_URI in .env.local and in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard). You will also need to fill in your Spotify API keys in .env.local.
