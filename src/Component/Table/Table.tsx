import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  date_start: number;
  date_end: number;
}

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsToSelect, setRowsToSelect] = useState<number>(0);
  const [showInput, setShowInput] = useState<boolean>(false);

  useEffect(() => {
    fetchArtworks(page + 1);
  }, [page]);

  const fetchArtworks = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=12`
      );
      const data = await response.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
    setLoading(false);
  };

  const handlePageChange = (event: { first: number; rows: number; page: number }) => {
    setPage(event.page);
  };

  const handleSelectRows = async () => {
    if (rowsToSelect <= 0 || rowsToSelect > totalRecords) {
      alert("Invalid number of rows to select");
      return;
    }

    setLoading(true);
    let selectedRows: Artwork[] = [];
    let currentPage = 1;

    while (selectedRows.length < rowsToSelect && currentPage <= Math.ceil(totalRecords / 12)) {
      try {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=12`
        );
        const data = await response.json();
        selectedRows = [...selectedRows, ...data.data];
      } catch (error) {
        console.error("Error fetching rows:", error);
        break;
      }
      currentPage++;
    }

    setSelectedArtworks(selectedRows.slice(0, rowsToSelect));
    setLoading(false);
  };

  const toggleInput = () => {
    setShowInput((prev) => !prev);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Artwork Table</h2>

      <DataTable
        value={artworks}
        paginator
        rows={12}
        totalRecords={totalRecords}
        lazy
        loading={loading}
        dataKey="id"
        selection={selectedArtworks}
        onSelectionChange={(e) => setSelectedArtworks(e.value)}
        onPage={handlePageChange}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
        ></Column>
        <Column
          field="title"
          header={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Title</span>
              <i
                className="pi pi-chevron-down"
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={toggleInput}
              ></i>
              {showInput && (
                <div
                  style={{
                    marginLeft: "10px",
                    position: "absolute",
                    zIndex: 10,
                    background: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "200px",
                  }}
                >
                  <input
                    type="number"
                    value={rowsToSelect || ""}
                    onChange={(e) => setRowsToSelect(Number(e.target.value))}
                    placeholder="Select rows..."
                    style={{ width: "80px" }}
                  />
                  <Button
                    label="Submit"
                    onClick={handleSelectRows}
                    style={{ marginTop: "10px", width: "100%" }}
                  />
                </div>
              )}
            </div>
          }
        ></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>
    </div>
  );
};

export default ArtworkTable;
