import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { getUserTracksByTerm, getTrendingTracks } from '../../app/lib/services/fetchTracks';
import { server } from './mocks/server';
import { createSpotifyUserTracksMock } from '../factories/tracks';
import lastfmTopTracks from '../fixtures/trendingTracks.json';

describe('getUserTracksByTerm (integration/msw)', () => {
  it('returns ranked tracks for every time range', async () => {
    const requestedTerms: string[] = [];

    server.use(
      http.get('https://api.spotify.com/v1/me/top/tracks', ({ request }) => {
        requestedTerms.push(new URL(request.url).searchParams.get('time_range') ?? '');
        return HttpResponse.json(createSpotifyUserTracksMock());
      })
    );

    const data = await getUserTracksByTerm('testToken');
    expect(requestedTerms.sort()).toEqual(['long_term', 'medium_term', 'short_term']);
    expect(Object.keys(data).sort()).toEqual(['long_term', 'medium_term', 'short_term']);
    expect(data.medium_term).toHaveLength(1);
    expect(data.medium_term[0]).toMatchObject({ rank: 1, artists: [{ name: 'Artist' }] });
  });
});

describe('getTrendingTracks (integration/msw)', () => {
  it('returns used fields only and keeps track order', async () => {
    const raw = lastfmTopTracks.tracks.track;
    const data = await getTrendingTracks();

    expect(data).toEqual(
      raw.map((track) => ({
        name: track.name,
        playcount: track.playcount,
        listeners: track.listeners,
        url: track.url,
        mbid: track.mbid,
        artist: {
          name: track.artist.name,
          mbid: track.artist.mbid,
          url: track.artist.url,
        },
      }))
    );
  });
});
