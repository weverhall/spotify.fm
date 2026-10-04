import type {
  SpotifyTrack,
  SpotifyUserTracks,
  LastfmTrack,
  LastfmArtist,
} from '../../app/lib/types/schemas';

export const createSpotifyAlbumMock = (
  overrides: Partial<SpotifyTrack['album']> = {}
): SpotifyTrack['album'] => ({
  name: 'Album 1',
  images: [{ url: 'https://i.scdn.co/image/album-300', width: 300, height: 300 }],
  external_urls: { spotify: 'https://open.spotify.com/album/1' },
  ...overrides,
});

export const createSpotifyTrackMock = (overrides: Partial<SpotifyTrack> = {}): SpotifyTrack => ({
  id: 'Qd6lWsQYtNgDtXIsM2c59t',
  name: 'Track 1',
  artists: [{ id: '1', name: 'Artist' }],
  album: createSpotifyAlbumMock(),
  ...overrides,
});

export const createSpotifyUserTracksMock = (
  overrides: Partial<SpotifyUserTracks> = {}
): SpotifyUserTracks => ({
  items: [createSpotifyTrackMock()],
  limit: 20,
  offset: 0,
  total: 1,
  next: null,
  previous: null,
  ...overrides,
});

export const createLastfmArtistMock = (overrides: Partial<LastfmArtist> = {}): LastfmArtist => ({
  name: 'Artist',
  url: 'https://www.last.fm/music/Artist',
  ...overrides,
});

export const createLastfmTrackMock = (overrides: Partial<LastfmTrack> = {}): LastfmTrack => ({
  name: 'Track 1',
  playcount: '100',
  url: 'https://www.last.fm/music/Artist/_/Track+1',
  artist: createLastfmArtistMock(),
  listeners: '10',
  ...overrides,
});
