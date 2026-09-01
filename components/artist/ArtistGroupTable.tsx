import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";

import {
  createPlaceholderRenderer,
  EditableGridTable,
} from "../common/EditableGridTable.tsx";
import { getAllGroups, saveGroups } from "../../src/api/groupApi.ts";
import type { EditableGroupRow, GroupTableDto } from "../../src/api/types.ts";

function toGroupTableDto(row: EditableGroupRow): GroupTableDto {
  return {
    id: row.id ?? 0,
    groupId: row.groupId ?? 0,
    memberId: row.memberId ?? 0,
  };
}

function toEditableGroupRow(row: GroupTableDto): EditableGroupRow {
  return {
    id: row.id,
    groupId: row.groupId,
    memberId: row.memberId,
  };
}

export function ArtistGroupTable() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<EditableGroupRow[]>([]);

  const columns = useMemo<ColDef<EditableGroupRow>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 100,
        flex: 0,
        cellRenderer: createPlaceholderRenderer("id"),
      },
      {
        field: "groupId",
        headerName: "그룹 ID",
        cellRenderer: createPlaceholderRenderer("그룹 ID"),
      },
      {
        field: "memberId",
        headerName: "멤버 ID",
        cellRenderer: createPlaceholderRenderer("멤버 ID"),
      },
    ],
    [],
  );

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllGroups();
      setGroups(response.map(toEditableGroupRow));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "그룹-멤버 목록 조회 실패",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleSave = async (rows: EditableGroupRow[]) => {
    setSaving(true);
    setError(null);

    try {
      await saveGroups(rows.map(toGroupTableDto));
      await loadGroups();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "그룹-멤버 저장에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditableGridTable
      addButtonLabel="+ 관계 추가"
      rowData={groups}
      onRowDataChange={setGroups}
      columns={columns}
      createEmptyRow={() => ({
        id: null,
        groupId: null,
        memberId: null,
      })}
      onSave={handleSave}
      loading={loading}
      saving={saving}
      error={error}
      onDismissError={() => setError(null)}
    />
  );
}
