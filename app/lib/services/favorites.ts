import { connectMongo } from '../utils/mongo';
import { FavoriteModel } from '../models/favorite';
import { SpotifyFavoriteSchema, type SpotifyFavorite, type SpotifyTrack } from '../types/schemas';

export const getFavoriteTracks = async (userId: string): Promise<SpotifyTrack[]> => {
  await connectMongo();
  const rawFavorites = await FavoriteModel.find({ userId }).sort({ createdAt: -1 }).lean();
  return rawFavorites.map((raw) => SpotifyFavoriteSchema.parse(raw).track);
};

export const addFavoriteTrack = async ({
  userId,
  trackId,
  track,
}: SpotifyFavorite): Promise<void> => {
  await connectMongo();
  await FavoriteModel.updateOne({ userId, trackId }, { $setOnInsert: { track } }, { upsert: true });
};

export const removeFavoriteTrack = async (userId: string, trackId: string): Promise<void> => {
  await connectMongo();
  await FavoriteModel.deleteOne({ userId, trackId });
};

export const countFavoriteTracks = async (userId: string): Promise<number> => {
  await connectMongo();
  return FavoriteModel.countDocuments({ userId });
};
