import { connectMongo } from '../utils/mongo';
import { FavoriteModel } from '../models/favorite';
import { SpotifyTrackSchema, type SpotifyTrack } from '../types/schemas';

export const getFavoriteTracks = async (userId: string): Promise<SpotifyTrack[]> => {
  await connectMongo();
  const rawFavorites = await FavoriteModel.find({ userId }).sort({ createdAt: -1 }).lean();
  return rawFavorites.map((favorite) => SpotifyTrackSchema.parse(favorite.track));
};
