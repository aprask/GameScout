import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

interface Game {
  created_at: Date;
  game_art: string;
  game_id: string;
  game_name: string;
  cover_id: string;
  is_supported: boolean;
  release_date: Date;
  summary: string;
  updated_at: Date;
}

interface PaginatedGameResponse {
  current_page: number;
  limit: number;
  items: number;
  pages: number;
  data: Game[];
}

const GameList: React.FC = () => {
  const [rows, setRows] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [rowCount, setRowCount] = useState<number>(0);
  const [sortModel, setSortModel] = useState<any[]>([]);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const sortType = sortModel.length
        ? sortModel[0].field === "id" && sortModel[0].sort === "asc"
          ? "old"
          : "new"
        : "new";
      const response = await axios.get<{ games: PaginatedGameResponse }>(
        "http://localhost:3000/api/v1/game/list",
        {
          params: {
            lim: pageSize,
            page: page + 1, // backend pages are 1-indexed
            sort: sortType,
          },

          headers: {
            "Content-Type": "application/json",
            Authorization: `${import.meta.env.VITE_API_MANAGEMENT_KEY}`,
          },
        }
      );

      const paginated = response.data.games;
      console.log(paginated);
      setRows(paginated.data);
      setRowCount(paginated.items);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortModel]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        getRowId={(row) => row.game_id} // Use game_id as the unique identifier
        columns={[
          { field: "game_id", headerName: "ID", width: 90 },
          { field: "game_name", headerName: "Title", flex: 1 },
          {
            field: "release_date",
            headerName: "Release Date",
            width: 150,
          },

          { field: "summary", headerName: "Summary", flex: 2 },
        ]}
        pagination
        paginationMode="server"
        sortingMode="server"
        rowCount={rowCount}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        loading={loading}
      />
    </div>
  );
};

export default GameList;
