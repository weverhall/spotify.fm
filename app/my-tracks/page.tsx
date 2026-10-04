import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import UserTracks from '../components/UserTracks';
import { getCurrentSession } from '../lib/auth/session';
import { getUserTracksByTerm } from '../lib/services/fetchTracks';
import { getUserProfile } from '../lib/services/fetchProfile';
import { getFavoriteTracks } from '../lib/services/favorites';
import styles from '../styles/my-tracks.module.css';

export const metadata: Metadata = {
  title: 'My Spotify Tracks',
};

const MyTracksPage = async () => {
  const session = await getCurrentSession();
  if (!session) redirect('/');

  const [profile, tracksByTerm, favoriteTracks] = await Promise.all([
    getUserProfile(session.access_token).catch((err) => {
      console.error('failed to load spotify profile:', err);
      return null;
    }),
    getUserTracksByTerm(session.access_token),
    getFavoriteTracks(session.userId).catch((err) => {
      console.error('failed to load favorite tracks:', err);
      return [];
    }),
  ]);

  return (
    <main className={styles.main}>
      <UserTracks tracksByTerm={tracksByTerm} profile={profile} initialFavorites={favoriteTracks} />
    </main>
  );
};

export default MyTracksPage;
