import { z } from 'zod';
import type { Ranked } from '../utils/rank';

const LastfmArtistSchema = z.object({
  name: z.string(),
  mbid: z.string().optional(),
  url: z.url().optional(),
});

const LastfmTrackSchema = z.object({
  name: z.string(),
  playcount: z.string(),
  url: z.url(),
  artist: LastfmArtistSchema,
  listeners: z.string().optional(),
  mbid: z.string().optional(),
});

export const LastfmTracksSchema = z.array(LastfmTrackSchema);

export const LastfmChartSchema = z.object({
  tracks: z.object({ track: LastfmTracksSchema }),
});

export const LastfmChartMovementSchema = z.union([z.number(), z.literal('new')]);

export const SpotifyIdSchema = z.string().length(22);

const SpotifyArtistSchema = z.object({
  id: SpotifyIdSchema.nullable(),
  name: z.string().max(400),
  href: z.url().max(200).nullish(),
});

const SpotifyImageSchema = z.object({
  url: z.url().max(1000),
  width: z.number().nullable(),
  height: z.number().nullable(),
});

const SpotifyAlbumSchema = z.object({
  name: z.string().max(1000),
  images: z.array(SpotifyImageSchema).max(20),
  external_urls: z.object({ spotify: z.url().max(200) }),
});

export const SpotifyTrackSchema = z.object({
  id: SpotifyIdSchema.nullable(),
  name: z.string().max(1000),
  artists: z.array(SpotifyArtistSchema).max(40),
  album: SpotifyAlbumSchema,
  href: z.url().max(200).nullish(),
});

export const SpotifyUserTracksSchema = z.object({
  items: z.array(SpotifyTrackSchema),
  limit: z.number(),
  offset: z.number(),
  total: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
});

export const SpotifyFavoriteSchema = z.object({
  userId: z.string(),
  trackId: SpotifyIdSchema,
  track: SpotifyTrackSchema,
});

export const SpotifyTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string(),
});

export const SpotifySessionSchema = SpotifyTokenSchema.extend({
  userId: z.string(),
});

export const SpotifyProfileSchema = z.object({
  id: z.string(),
  display_name: z.string().nullish(),
  email: z.string().optional(),
  images: z.array(SpotifyImageSchema).default([]),
  external_urls: z.object({ spotify: z.url() }).optional(),
});

export const SpotifyTermSchema = z.enum(['short_term', 'medium_term', 'long_term']);

export const CookieSchema = z.object({
  session_id: z.string().length(64),
});

export const SnapshotSchema = z.object({
  date: z.iso.date(),
  tracks: LastfmTracksSchema,
});

export const EnvironmentSchema = z.object({
  BASE_URL: z.url(),
  REDIRECT_URI: z.url(),
  REDIS_URL: z.url(),
  MONGODB_URI: z.url(),
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  LASTFM_API_KEY: z.string(),
  REVALIDATION_SECRET: z.string(),
});

export type LastfmArtist = z.infer<typeof LastfmArtistSchema>;
export type LastfmTrack = z.infer<typeof LastfmTrackSchema>;
export type LastfmTracks = z.infer<typeof LastfmTracksSchema>;
export type LastfmChart = z.infer<typeof LastfmChartSchema>;
export type LastfmChartMovement = z.infer<typeof LastfmChartMovementSchema>;
export type SpotifyId = z.infer<typeof SpotifyIdSchema>;
export type SpotifyTrack = z.infer<typeof SpotifyTrackSchema>;
export type SpotifyAlbumCover = z.infer<typeof SpotifyImageSchema>;
export type SpotifyProfilePicture = z.infer<typeof SpotifyImageSchema>;
export type SpotifyUserTracks = z.infer<typeof SpotifyUserTracksSchema>;
export type SpotifyFavorite = z.infer<typeof SpotifyFavoriteSchema>;
export type SpotifyToken = z.infer<typeof SpotifyTokenSchema>;
export type SpotifySession = z.infer<typeof SpotifySessionSchema>;
export type SpotifyProfile = z.infer<typeof SpotifyProfileSchema>;
export type SpotifyTerm = z.infer<typeof SpotifyTermSchema>;
export type Cookie = z.infer<typeof CookieSchema>;
export type Snapshot = z.infer<typeof SnapshotSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type TracksByTerm = Record<SpotifyTerm, Ranked<SpotifyTrack>[]>;
