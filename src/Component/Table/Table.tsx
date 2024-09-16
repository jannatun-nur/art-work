import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Table.css';
import { DataTableStateEvent } from 'primereact/datatable';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState<number>(1);
  const [rowsToSelect, setRowsToSelect] = useState<number>(0);
  const [showInput, setShowInput] = useState<boolean>(false);

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  const fetchArtworks = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=12`);
      const data = await response.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
    setLoading(false);
  };

  const onPageChange = (event: DataTableStateEvent) => {
    setPage((event.page ?? 1) + 1);
  };

  const onRowSelectChange = (e: { value: Artwork[] }) => {
    setSelectedArtworks(e.value);
  };

  const handleSelectRows = () => {
    if (rowsToSelect > 0 && rowsToSelect <= artworks.length) {
      const newSelectedArtworks = artworks.slice(0, rowsToSelect);
      setSelectedArtworks(newSelectedArtworks);
    }
    setShowInput(false);
    setRowsToSelect(0);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
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
        selectionMode="multiple"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>

        <Column
          field="title"
          header={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Title</span>
              <i
                className="pi pi-chevron-down"
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={toggleInput}
              ></i>
              {showInput && (
                <div
                  style={{
                    marginLeft: '10px',
                    position: 'absolute',
                    zIndex: 10,
                    background: '#fff',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '200px'
                  }}
                >
                  <input
                    type="number"
                    value={rowsToSelect || ''}
                    onChange={(e) => setRowsToSelect(Number(e.target.value))}
                    placeholder="Select rows..."
                    style={{ width: '80px' }}
                  />
                  <Button
                    label="Submit"
                    onClick={handleSelectRows}
                    style={{ marginTop: '10px', width: '100%' }}
                  />
                </div>
              )}
            </div>
          }
        ></Column>

        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>
    </div>
  );
};

export default Table;
