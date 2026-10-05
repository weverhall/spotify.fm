'use server';

import { getCurrentSession } from '../auth/session';
import { isRateLimited } from '../utils/rateLimit';
import { addFavoriteTrack, removeFavoriteTrack, countFavoriteTracks } from '../services/favorites';
import { SpotifyTrackSchema, SpotifyIdSchema } from '../types/schemas';

type ActionResult = { ok: true } | { ok: false; error: string };

export const addFavoriteAction = async (input: unknown): Promise<ActionResult> => {
  const session = await getCurrentSession();
  if (!session) return { ok: false, error: 'unauthorized' };

  if (await isRateLimited(`favorites:${session.userId}`, 40, 60)) {
    return { ok: false, error: 'rate limited' };
  }

  const parsed = SpotifyTrackSchema.safeParse(input);
  const track = parsed.success ? parsed.data : null;
  if (!track?.id) return { ok: false, error: 'invalid track' };

  try {
    if ((await countFavoriteTracks(session.userId)) >= 300) {
      return { ok: false, error: 'favorites limit reached' };
    }

    await addFavoriteTrack({ userId: session.userId, trackId: track.id, track });
    return { ok: true };
  } catch (err) {
    console.error('failed to add favorite track:', err);
    return { ok: false, error: 'failed to add favorite' };
  }
};

export const removeFavoriteAction = async (input: unknown): Promise<ActionResult> => {
  const session = await getCurrentSession();
  if (!session) return { ok: false, error: 'unauthorized' };

  if (await isRateLimited(`favorites:${session.userId}`, 40, 60)) {
    return { ok: false, error: 'rate limited' };
  }

  const parsed = SpotifyIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid track id' };

  try {
    await removeFavoriteTrack(session.userId, parsed.data);
    return { ok: true };
  } catch (err) {
    console.error('failed to remove favorite track:', err);
    return { ok: false, error: 'failed to remove favorite' };
  }
};
