import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSelectionChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Table.css';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const Table: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1);
  const [rowsToSelect, setRowsToSelect] = useState<number>(0);

  const rowsOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1} rows`,
    value: i + 1,
  }));

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  const fetchArtworks = async (pageNumber: number) => {
    setLoading(true);
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`);
    const data = await response.json();
    setArtworks(data.data);
    setTotalRecords(data.pagination.total);
    setLoading(false);
  };

  const onPageChange = (event: any) => {
    setPage(event.page + 1);
  };

  const onRowSelectChange = (e: DataTableSelectionChangeEvent) => {
    setSelectedArtworks(e.value as Artwork[]);
  };

  const handleSelectRows = () => {
    const newSelectedArtworks = artworks.slice(0, rowsToSelect);
    setSelectedArtworks(newSelectedArtworks);
  };

  return (
    <div className="datatable-container">
      <h1>Artworks Table</h1>

      <DataTable
        value={artworks}
        paginator
        rows={12}
        totalRecords={totalRecords}
        lazy
        onPage={onPageChange}
        loading={loading}
        selection={selectedArtworks}
        onSelectionChange={onRowSelectChange}
        dataKey="id"
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>

        {/* Dropdown beside Title Header */}
        <Column
          field="title"
          header={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Title</span>
              <Dropdown
                options={rowsOptions}
                value={rowsToSelect}
                onChange={(e) => setRowsToSelect(e.value)}
                placeholder="Select rows"
                style={{ marginLeft: '10px' }}
              />
              <Button label="Submit" icon="pi pi-check" onClick={handleSelectRows} className="p-button-text" />
            </div>
          }
        ></Column>

        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>

      <div className="selected-panel">
        <h3>Selected Artworks</h3>
        {selectedArtworks.map((artwork) => (
          <div key={artwork.id}>
            {artwork.title} - {artwork.artist_display}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
