import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addFavoriteAction, removeFavoriteAction } from '../../app/lib/actions/favorites';
import { getCurrentSession } from '../../app/lib/auth/session';
import { isRateLimited } from '../../app/lib/utils/rateLimit';
import {
  addFavoriteTrack,
  removeFavoriteTrack,
  countFavoriteTracks,
} from '../../app/lib/services/favorites';
import { createSessionMock } from '../factories/session';
import { createSpotifyTrackMock } from '../factories/tracks';

vi.mock('../../app/lib/auth/session', () => ({ getCurrentSession: vi.fn() }));
vi.mock('../../app/lib/utils/rateLimit', () => ({ isRateLimited: vi.fn() }));
vi.mock('../../app/lib/services/favorites', () => ({
  addFavoriteTrack: vi.fn(),
  removeFavoriteTrack: vi.fn(),
  countFavoriteTracks: vi.fn(),
}));

const session = createSessionMock();

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getCurrentSession).mockResolvedValue(session);
  vi.mocked(isRateLimited).mockResolvedValue(false);
  vi.mocked(countFavoriteTracks).mockResolvedValue(0);
});

describe('addFavoriteAction', () => {
  it('stores a valid track', async () => {
    const track = createSpotifyTrackMock();

    const result = await addFavoriteAction(track);

    expect(result.ok).toBe(true);
    expect(addFavoriteTrack).toHaveBeenCalledWith({
      userId: session.userId,
      trackId: track.id,
      track: expect.objectContaining({ id: track.id, name: track.name }),
    });
  });

  it('returns an error without session', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null);

    const result = await addFavoriteAction(createSpotifyTrackMock());

    expect(result.ok).toBe(false);
    expect(addFavoriteTrack).not.toHaveBeenCalled();
  });

  it('returns an error with invalid data', async () => {
    const result = await addFavoriteAction({ id: 1, name: null });

    expect(result.ok).toBe(false);
    expect(addFavoriteTrack).not.toHaveBeenCalled();
  });

  it('returns an error at favorites limit', async () => {
    vi.mocked(countFavoriteTracks).mockResolvedValue(300);

    const result = await addFavoriteAction(createSpotifyTrackMock());

    expect(result).toEqual({ ok: false, error: 'favorites limit reached' });
    expect(addFavoriteTrack).not.toHaveBeenCalled();
  });

  it('returns an error when rate limited', async () => {
    vi.mocked(isRateLimited).mockResolvedValue(true);

    const result = await addFavoriteAction(createSpotifyTrackMock());

    expect(result.ok).toBe(false);
    expect(addFavoriteTrack).not.toHaveBeenCalled();
  });
});

describe('removeFavoriteAction', () => {
  it('removes a favorite', async () => {
    const trackId = createSpotifyTrackMock().id;

    const result = await removeFavoriteAction(trackId);

    expect(result.ok).toBe(true);
    expect(removeFavoriteTrack).toHaveBeenCalledWith(session.userId, trackId);
  });

  it('returns an error for invalid id', async () => {
    const result = await removeFavoriteAction('invalid');

    expect(result.ok).toBe(false);
    expect(removeFavoriteTrack).not.toHaveBeenCalled();
  });
});
