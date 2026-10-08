import type { SpotifySession } from '../../app/lib/types/schemas';

export const createSessionMock = (overrides: Partial<SpotifySession> = {}): SpotifySession => ({
  access_token: 'token',
  token_type: 'Bearer',
  expires_in: 3600,
  scope: 'user-top-read',
  userId: 'user1',
  ...overrides,
});
