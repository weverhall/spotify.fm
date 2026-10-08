import type { Metadata } from 'next';
import UserTracks from '../../components/UserTracks';
import { demoTracksByTerm, demoProfile, demoFavorites } from './demoData';
import styles from '../../styles/my-tracks.module.css';

export const metadata: Metadata = {
  title: 'My Spotify Tracks - Demo',
};

const DemoPage = () => (
  <main className={styles.main}>
    <UserTracks
      tracksByTerm={demoTracksByTerm}
      profile={demoProfile}
      initialFavorites={demoFavorites}
      demo
    />
  </main>
);

export default DemoPage;
