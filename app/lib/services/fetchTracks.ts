import {
  SpotifyUserTracksSchema,
  SpotifyTermSchema,
  LastfmChartSchema,
  type SpotifyUserTracks,
  type SpotifyTerm,
  type LastfmTracks,
  type LastfmChartMovement,
  type TracksByTerm,
} from '../types/schemas';
import { withRank } from '../utils/rank';
import { env } from '../utils/config';
import { getRecentSnapshots, calculateChartMovement } from './snapshots';

export type TrendingChart = {
  tracks: LastfmTracks;
  movement?: LastfmChartMovement[];
};

export const getUserTracks = async (
  accessToken: string,
  term: SpotifyTerm
): Promise<SpotifyUserTracks> => {
  const spotifyParams = new URLSearchParams({
    limit: '20',
    offset: '0',
    time_range: term,
  });

  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?${spotifyParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch user tracks (${term}): ${res.status} ${text}`);
  }

  return SpotifyUserTracksSchema.parse(await res.json());
};

export const getUserTracksByTerm = async (accessToken: string): Promise<TracksByTerm> => {
  const entries = await Promise.all(
    SpotifyTermSchema.options.map(
      async (term) => [term, withRank((await getUserTracks(accessToken, term)).items)] as const
    )
  );
  return Object.fromEntries(entries) as TracksByTerm;
};

export const getTrendingTracks = async (): Promise<LastfmTracks> => {
  const lastfmParams = new URLSearchParams({
    method: 'chart.gettoptracks',
    api_key: env.LASTFM_API_KEY,
    format: 'json',
    limit: '50',
  });

  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${lastfmParams.toString()}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch trending tracks: ${res.status} ${text}`);
  }

  return LastfmChartSchema.parse(await res.json()).tracks.track;
};

export const getTrendingChart = async (): Promise<TrendingChart> => {
  try {
    const [latest, previous] = await getRecentSnapshots(2);
    if (latest) {
      return {
        tracks: latest.tracks,
        movement: previous ? calculateChartMovement(latest.tracks, previous.tracks) : undefined,
      };
    }
  } catch (err) {
    console.error('failed to read snapshots, fetching live instead:', err);
  }

  return { tracks: await getTrendingTracks() };
};
