'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DataScroller } from 'primereact/datascroller';
import { TabView, TabPanel } from 'primereact/tabview';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import type {
  SpotifyTrack,
  SpotifyProfile,
  SpotifyTerm,
  SpotifyAlbumCover,
  SpotifyProfilePicture,
  TracksByTerm,
} from '../lib/types/schemas';
import type { Ranked } from '../lib/utils/rank';
import { useSpotifyEmbed } from '../lib/hooks/useSpotifyEmbed';
import { PlayIcon, PauseIcon, ArrowUturnLeftIcon } from './ui/Icons';
import RotatingWord from './ui/RotatingWord';
import styles from '../styles/my-tracks.module.css';

type UserTracksProps = {
  tracksByTerm: TracksByTerm;
  profile: SpotifyProfile | null;
  initialFavorites: SpotifyTrack[];
};

type TermOption = { label: string; value: SpotifyTerm };

const TERM_OPTIONS: TermOption[] = [
  { label: '4 weeks', value: 'short_term' },
  { label: '6 months', value: 'medium_term' },
  { label: '1 year', value: 'long_term' },
];

const ROTATING_WORDS = ['listening', 'jamming', 'grooving', 'vibing', 'dancing'] as const;

const COVER_SIZE = 80;
const AVATAR_SIZE = 66;
const BADGE_SIZE = 24;

const pickImage = <T extends SpotifyAlbumCover | SpotifyProfilePicture>(
  images: T[],
  minSize: number
): T | undefined => {
  const sorted = [...images].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  return sorted.find((image) => (image.width ?? 0) >= minSize) ?? sorted.at(-1);
};

const termItemTemplate = (option: TermOption) => (
  <span className={styles.termLabel}>{option.label}</span>
);

const greeting = (name?: string | null) => (name ? `Hi, ${name}!` : 'Hi there!');

const Header = ({ profile }: { profile: SpotifyProfile | null }) => {
  const avatar = profile ? pickImage(profile.images, AVATAR_SIZE * 2) : undefined;
  const profileUrl = profile?.external_urls?.spotify;

  return (
    <div className={styles.header}>
      <a
        className={styles.avatarLink}
        href={profileUrl ?? 'https://open.spotify.com'}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={profileUrl ? 'Open your Spotify profile' : 'Open Spotify'}
      >
        {avatar ? (
          <>
            <Image
              className={styles.avatar}
              src={avatar.url}
              alt=""
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              unoptimized
            />
            <Image
              className={styles.avatarBadge}
              src="/Primary_Logo_Black_RGB.svg"
              alt=""
              width={BADGE_SIZE}
              height={BADGE_SIZE}
            />
          </>
        ) : (
          <Image
            src="/Primary_Logo_Black_RGB.svg"
            alt=""
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
          />
        )}
      </a>
      <div className={styles.headerText}>
        <h1 className={styles.heading}>{greeting(profile?.display_name)}</h1>
        <div className={styles.subheading}>
          Here&apos;s what you&apos;ve been <RotatingWord words={ROTATING_WORDS} /> to lately.
        </div>
      </div>
      <Link
        href="/"
        className={styles.homeLink}
        aria-label="Back to trending tracks"
        title="Back to trending tracks"
      >
        <ArrowUturnLeftIcon size={24} />
      </Link>
    </div>
  );
};

const UserTracks = ({ tracksByTerm, profile, initialFavorites }: UserTracksProps) => {
  const [term, setTerm] = useState<SpotifyTerm>('medium_term');
  const [favorites, setFavorites] = useState<SpotifyTrack[]>(initialFavorites);
  const { hostRef, play, isPlaying } = useSpotifyEmbed(tracksByTerm.medium_term[0]?.id ?? null);

  const tracks = tracksByTerm[term];

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const toggleFavorite = (track: SpotifyTrack) =>
    setFavorites((prev) =>
      prev.some((f) => f.id === track.id) ? prev.filter((f) => f.id !== track.id) : [track, ...prev]
    );

  const row = (track: SpotifyTrack, rank?: number) => {
    const { id } = track;
    const playing = id ? isPlaying(id) : false;
    const favorite = id ? isFavorite(id) : false;
    const artists = track.artists.map((a) => a.name).join(', ');
    const cover = pickImage(track.album.images, COVER_SIZE * 2);

    const playClassName = [
      styles.play,
      playing && styles.playing,
      rank === undefined && styles.alwaysVisible,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`${styles.row} ${playing ? styles.current : ''}`}>
        <div className={styles.rankCell}>
          {rank !== undefined && <span className={styles.rank}>{rank}</span>}
          {id && (
            <button
              type="button"
              className={playClassName}
              aria-label={playing ? `Pause ${track.name}` : `Play ${track.name}`}
              onClick={() => play(id)}
            >
              {playing ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
            </button>
          )}
        </div>

        <a
          className={styles.coverLink}
          href={track.album.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${track.album.name} on Spotify`}
        >
          {cover ? (
            <Image
              className={styles.cover}
              src={cover.url}
              alt=""
              width={COVER_SIZE}
              height={COVER_SIZE}
              unoptimized
            />
          ) : (
            <div className={styles.cover} />
          )}
        </a>

        <div className={styles.text}>
          <div className={styles.title} title={track.name}>
            {track.name}
          </div>
          <div className={styles.artists} title={artists}>
            {artists}
          </div>
        </div>

        {id && (
          <Button
            className={`${styles.action} ${favorite ? styles.favorited : ''}`}
            icon={favorite ? 'pi pi-heart-fill' : 'pi pi-heart'}
            rounded
            text
            aria-label={
              favorite ? `Remove ${track.name} from favorites` : `Add ${track.name} to favorites`
            }
            aria-pressed={favorite}
            onClick={() => toggleFavorite(track)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className={styles.view}>
        <Header profile={profile} />
        <TabView>
          <TabPanel header="Top Tracks">
            <div className={styles.toolbar}>
              <SelectButton
                className={styles.termSelect}
                value={term}
                onChange={(e) => e.value && setTerm(e.value)}
                options={TERM_OPTIONS}
                itemTemplate={termItemTemplate}
                allowEmpty={false}
                aria-label="Time period"
              />
            </div>
            {tracks.length === 0 ? (
              <p className={styles.empty}>
                No top tracks for this period yet.
                <br />
                Try a longer time range.
              </p>
            ) : (
              <DataScroller
                value={tracks}
                itemTemplate={(track: Ranked<SpotifyTrack>) => row(track, track.rank)}
                rows={20}
                emptyMessage=" "
              />
            )}
          </TabPanel>
          <TabPanel
            header={
              <>
                Favorites
                {favorites.length > 0 && <span className={styles.count}>{favorites.length}</span>}
              </>
            }
          >
            {favorites.length === 0 ? (
              <p className={styles.empty}>
                No favorites yet.
                <br />
                Tap ♥ on a track to add it.
              </p>
            ) : (
              <DataScroller
                value={favorites}
                itemTemplate={(track: SpotifyTrack) => row(track)}
                rows={20}
                emptyMessage=" "
              />
            )}
          </TabPanel>
        </TabView>
      </div>

      <div ref={hostRef} className={styles.player} />
    </>
  );
};

export default UserTracks;
