'use server';

import { getCurrentSession } from '../auth/session';
import { addFavoriteTrack, removeFavoriteTrack } from '../services/favorites';
import { SpotifyTrackSchema, SpotifyTrackIdSchema } from '../types/schemas';

type ActionResult = { ok: true } | { ok: false; error: string };

export const addFavoriteAction = async (input: unknown): Promise<ActionResult> => {
  const session = await getCurrentSession();
  if (!session) return { ok: false, error: 'Unauthorized' };

  const parsed = SpotifyTrackSchema.safeParse(input);
  const track = parsed.success ? parsed.data : null;
  if (!track?.id) return { ok: false, error: 'invalid track' };

  try {
    await addFavoriteTrack({ userId: session.userId, trackId: track.id, track });
    return { ok: true };
  } catch (err) {
    console.error('failed to add favorite track:', err);
    return { ok: false, error: 'failed to add favorite' };
  }
};

export const removeFavoriteAction = async (input: unknown): Promise<ActionResult> => {
  const session = await getCurrentSession();
  if (!session) return { ok: false, error: 'Unauthorized' };

  const parsed = SpotifyTrackIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid track id' };

  try {
    await removeFavoriteTrack(session.userId, parsed.data);
    return { ok: true };
  } catch (err) {
    console.error('failed to remove favorite track:', err);
    return { ok: false, error: 'failed to remove favorite' };
  }
};
