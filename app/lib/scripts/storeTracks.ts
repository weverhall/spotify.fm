import { getTrendingTracks } from '../services/fetchTracks';
import { getLatestSnapshot, saveSnapshot, isSameChart } from '../services/snapshots';
import { getTodayDate } from '../utils/datetime';
import { disconnectMongo } from '../utils/mongo';

const storeTracks = async () => {
  try {
    const latest = await getLatestSnapshot();

    if (latest?.date !== getTodayDate()) {
      const tracks = await getTrendingTracks();
      if (!latest || !isSameChart(latest.tracks, tracks)) await saveSnapshot(tracks);
    }
  } catch (err) {
    console.error('failed to fetch or store tracks:', err);
    process.exit(1);
  } finally {
    await disconnectMongo();
    process.exit(0);
  }
};

storeTracks();
