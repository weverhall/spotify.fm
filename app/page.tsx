export const revalidate = 86400;

import Image from 'next/image';
import Link from 'next/link';
import TrendingTracks from './components/TrendingTracks';
import { getTrendingChart } from './lib/services/fetchTracks';
import styles from './styles/home.module.css';

const HomePage = async () => {
  const { tracks, movement } = await getTrendingChart();

  return (
    <main className={styles.main}>
      <div className={styles.spotifyCard}>
        <a href="/api/auth/login" className={styles.loginLink}>
          <Image src="/Primary_Logo_Green_RGB.svg" alt="" width={42} height={42} />
          <span className={styles.spotifyText}>
            <strong>Log in with Spotify</strong>
            <span className={styles.loginSubtitle}>See your own top tracks.</span>
          </span>
        </a>

        <Link href="/my-tracks/demo" className={styles.demoLink}>
          <Image src="/Primary_Logo_White_RGB.svg" alt="" width={42} height={42} />
          <span className={styles.spotifyText}>
            <strong>Try the demo</strong>
            <span className={styles.demoSubtitle}>No account needed.</span>
          </span>
        </Link>

        <h1 className={styles.cardTitle}>
          <a href="/" className={styles.homeLink}>
            Spotify.fm
          </a>
        </h1>
      </div>

      <TrendingTracks tracks={tracks} movement={movement} />
    </main>
  );
};

export default HomePage;
