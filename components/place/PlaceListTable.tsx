import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";

import {
  createPlaceholderRenderer,
  EditableGridTable,
} from "../common/EditableGridTable.tsx";
import { getAllPlaces, savePlaces } from "../../src/api/placeApi.ts";
import type { EditablePlaceRow, PlaceTableDto } from "../../src/api/types.ts";

function toPlaceTableDto(row: EditablePlaceRow): PlaceTableDto {
  return {
    id: row.id ?? 0,
    placeName: row.placeName,
    url: row.url,
  };
}

function toEditablePlaceRow(row: PlaceTableDto): EditablePlaceRow {
  return {
    id: row.id,
    placeName: row.placeName,
    url: row.url,
  };
}

export function PlaceListTable() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<EditablePlaceRow[]>([]);

  const columns = useMemo<ColDef<EditablePlaceRow>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 100,
        flex: 0,
        cellRenderer: createPlaceholderRenderer("id"),
      },
      {
        field: "placeName",
        headerName: "장소명",
        cellRenderer: createPlaceholderRenderer("장소명"),
      },
      {
        field: "url",
        headerName: "URL",
        cellRenderer: createPlaceholderRenderer("URL"),
      },
    ],
    [],
  );

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllPlaces();
      setPlaces(response.map(toEditablePlaceRow));
    } catch (error) {
      setError(error instanceof Error ? error.message : "장소 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const handleSave = async (rows: EditablePlaceRow[]) => {
    setSaving(true);
    setError(null);

    try {
      await savePlaces(rows.map(toPlaceTableDto));
      await loadPlaces();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "장소 저장에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditableGridTable
      addButtonLabel="+ 장소 추가"
      rowData={places}
      onRowDataChange={setPlaces}
      columns={columns}
      createEmptyRow={() => ({
        id: null,
        placeName: "",
        url: "",
      })}
      onSave={handleSave}
      loading={loading}
      saving={saving}
      error={error}
      onDismissError={() => setError(null)}
    />
  );
}
