import { connectMongo } from '../utils/mongo';
import { SnapshotModel } from '../models/snapshot';
import { getTodayDate } from '../utils/datetime';
import {
  SnapshotSchema,
  type LastfmTracks,
  type LastfmTrack,
  type LastfmChartMovement,
  type Snapshot,
} from '../types/schemas';

const trackKey = (track: LastfmTrack): string =>
  `${track.artist.name} - ${track.name}`.toLowerCase();

export const saveSnapshot = async (
  tracks: LastfmTracks,
  date = getTodayDate()
): Promise<boolean> => {
  await connectMongo();
  const result = await SnapshotModel.updateOne(
    { date },
    { $setOnInsert: { tracks } },
    { upsert: true }
  );
  return result.upsertedCount > 0;
};

export const getRecentSnapshots = async (limit: number): Promise<Snapshot[]> => {
  await connectMongo();
  const rawSnapshots = await SnapshotModel.find().sort({ date: -1 }).limit(limit).lean();
  return rawSnapshots.map((raw) => SnapshotSchema.parse(raw));
};

export const getLatestSnapshot = async (): Promise<Snapshot | null> =>
  (await getRecentSnapshots(1))[0] ?? null;

export const isSameChart = (a: LastfmTracks, b: LastfmTracks): boolean =>
  a.length === b.length && a.every((track, i) => trackKey(track) === trackKey(b[i]));

export const calculateChartMovement = (
  today: LastfmTracks,
  previous: LastfmTracks
): LastfmChartMovement[] => {
  const previousRanks = new Map(previous.map((track, i) => [trackKey(track), i + 1]));

  return today.map((track, i) => {
    const previousRank = previousRanks.get(trackKey(track));
    return previousRank ? previousRank - (i + 1) : 'new';
  });
};
