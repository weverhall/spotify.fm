import { NextResponse } from 'next/server';
import { env } from '../../../lib/utils/config';
import { storeOAuthState } from '../../../lib/auth/state';
import crypto from 'crypto';

export const GET = async () => {
  const state = crypto.randomUUID();
  await storeOAuthState(state);

  const authURL = new URL('https://accounts.spotify.com/authorize');
  authURL.searchParams.set('response_type', 'code');
  authURL.searchParams.set('client_id', env.SPOTIFY_CLIENT_ID);
  authURL.searchParams.set('scope', 'user-top-read');
  authURL.searchParams.set('redirect_uri', env.REDIRECT_URI);
  authURL.searchParams.set('state', state);

  return NextResponse.redirect(authURL.toString());
};
