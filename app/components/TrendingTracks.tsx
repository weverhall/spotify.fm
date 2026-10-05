'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, type ColumnSortEvent } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import Image from 'next/image';
import type { LastfmTrack, LastfmTracks, LastfmChartMovement } from '../lib/types/schemas';
import { withRank, type Ranked } from '../lib/utils/rank';
import styles from '../styles/home.module.css';

type RankedTrack = Ranked<LastfmTrack>;

type TrendingTracksProps = {
  tracks: LastfmTracks;
  movement?: LastfmChartMovement[];
};

const getArtistLink = (track: RankedTrack): string =>
  track.artist.url ?? `https://www.last.fm/music/${encodeURIComponent(track.artist.name)}`;

const formatPlaycount = (playcount: string): number => {
  const count = parseInt(playcount, 10) || 0;
  return Math.round(count / 1000);
};

const formatChartMovement = (movement: LastfmChartMovement) => {
  if (movement === 'new') return <span style={{ color: 'purple' }}>New!</span>;
  if (movement > 0)
    return (
      <span style={{ color: 'green' }}>
        <i className="pi pi-arrow-up" style={{ fontSize: '0.85rem' }} /> {movement}
      </span>
    );
  if (movement < 0)
    return (
      <span style={{ color: 'var(--red-600)' }}>
        <i className="pi pi-arrow-down" style={{ fontSize: '0.85rem' }} /> {-movement}
      </span>
    );
  return '–';
};

const sortByNumber = (e: ColumnSortEvent, getValue: (track: RankedTrack) => number) => {
  const order = e.order === -1 ? -1 : 1;
  return [...(e.data as RankedTrack[])].sort((a, b) => (getValue(a) - getValue(b)) * order);
};

const TrendingTracks = ({ tracks, movement }: TrendingTracksProps) => {
  const [filter, setFilter] = useState<string>('');
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const getMovementSortValue = (rank: number): number => {
    if (!movement) return 0;
    const value = movement[rank - 1];
    return typeof value === 'number' ? value : Number.MAX_SAFE_INTEGER;
  };

  const rankedTracks = withRank(tracks);

  const artistNames = [...new Set(tracks.map((track) => track.artist.name))];
  const countTracks = (name: string) => tracks.filter((track) => track.artist.name === name).length;

  const artistOptions = artistNames
    .map((name) => ({ name, count: countTracks(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .map(({ name, count }) => ({ label: `${name} (${count})`, value: name }));

  const visibleTracks =
    selectedArtists.length === 0
      ? rankedTracks
      : rankedTracks.filter((track) => selectedArtists.includes(track.artist.name));

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(1rem - 1px)' }}>
        <Image src="/last-fm-round-color-icon.svg" alt="" width={44} height={44} />
        <div>
          <h1 style={{ margin: '0 0 0.1rem 0', fontSize: '1.7rem' }}>Global Trending Tracks</h1>
          <div style={{ fontWeight: 'lighter', fontSize: '1.05rem', marginLeft: '2px' }}>
            Daily rank determined by Last.fm&apos;s trend algorithm.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MultiSelect
          id="artist-filter"
          inputId="artist-filter-input"
          value={selectedArtists}
          onChange={(e) => setSelectedArtists(e.value as string[])}
          options={artistOptions}
          placeholder="All artists"
          filter
          showSelectAll={false}
          maxSelectedLabels={1}
          selectedItemsLabel="{0} artists"
          style={{ width: '220px' }}
          panelClassName={styles.artistPanel}
        />

        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" style={{ fontSize: '1.1rem' }} />
          <InputText
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
            style={{ width: '280px' }}
          />
        </IconField>
      </div>
    </div>
  );

  return (
    <DataTable
      header={header}
      globalFilter={filter}
      globalFilterFields={['artist.name', 'name']}
      value={visibleTracks}
      dataKey="rank"
      size="small"
      showGridlines
      removableSort
    >
      <Column field="rank" header="#" sortable />

      <Column
        header="Trend"
        sortable
        sortField="trend"
        sortFunction={(e) => sortByNumber(e, (track) => getMovementSortValue(track.rank))}
        style={{ width: '8%' }}
        body={(track: RankedTrack) =>
          movement ? formatChartMovement(movement[track.rank - 1]) : null
        }
      />

      <Column
        field="artist.name"
        header="Artist"
        sortable
        style={{ width: '22%' }}
        body={(track: RankedTrack) => (
          <a href={getArtistLink(track)} target="_blank" rel="noopener noreferrer">
            {track.artist.name}
          </a>
        )}
      />

      <Column
        field="name"
        header="Track"
        sortable
        style={{ width: '33%' }}
        body={(track: RankedTrack) => (
          <a href={track.url} target="_blank" rel="noopener noreferrer">
            {track.name}
          </a>
        )}
      />

      <Column
        field="playcount"
        header="All-time playcount (in thousands)"
        sortable
        sortFunction={(e) => sortByNumber(e, (track) => Number(track.playcount))}
        body={(track: RankedTrack) => formatPlaycount(track.playcount)}
      />
    </DataTable>
  );
};

export default TrendingTracks;
