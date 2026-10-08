import demoTracks from './demoTracks.json';
import {
  SpotifyUserTracksSchema,
  type SpotifyProfile,
  type TracksByTerm,
} from '../../lib/types/schemas';
import { withRank } from '../../lib/utils/rank';

const parseTracks = (tracks: unknown) =>
  withRank(SpotifyUserTracksSchema.shape.items.parse(tracks));

export const demoTracksByTerm: TracksByTerm = {
  short_term: parseTracks(demoTracks.short_term),
  medium_term: parseTracks(demoTracks.medium_term),
  long_term: parseTracks(demoTracks.long_term),
};

export const demoProfile: SpotifyProfile = {
  id: 'demo',
  display_name: 'Demo User',
  images: [{ url: '/demo-avatar.jpg', width: 225, height: 225 }],
};

export const demoFavorites = [];
