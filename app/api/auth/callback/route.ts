import { NextResponse } from 'next/server';
import { env } from '../../../lib/utils/config';
import { getSpotifyToken } from '../../../lib/auth/token';
import { generateSessionID, storeSession } from '../../../lib/auth/session';
import { consumeOAuthState } from '../../../lib/auth/state';
import { getUserProfile } from '../../../lib/services/fetchProfile';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const failureResponse = NextResponse.redirect(env.BASE_URL);

  if (error || !code || !state) return failureResponse;

  const isValidState = await consumeOAuthState(state);
  if (!isValidState) return failureResponse;

  try {
    const token = await getSpotifyToken(code);

    let profile;
    try {
      profile = await getUserProfile(token.access_token);
    } catch (err) {
      console.error('spotify profile request failed, account probably not invited yet:', err);
      return NextResponse.redirect(`${env.BASE_URL}/?login=not-invited-yet`);
    }

    const sessionID = generateSessionID();
    await storeSession(sessionID, { ...token, userId: profile.id });

    const successResponse = NextResponse.redirect(`${env.BASE_URL}/my-tracks`);
    successResponse.cookies.set('session_id', sessionID, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 3600,
    });

    return successResponse;
  } catch (err) {
    console.error('failed to complete spotify login:', err);
    return failureResponse;
  }
};
