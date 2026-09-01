import { Alert, Button, Spinner } from "flowbite-react";
import { useMemo } from "react";

import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  type ColDef,
  type ICellRendererParams,
  themeAlpine,
} from "ag-grid-community";

type RowId = string | number;

type ReadOnlyGridTableProps<T extends object> = {
  rowData: T[];
  columns: ColDef<T>[];
  searchText: string;

  getRowId: (row: T) => RowId;
  onRowClick?: (row: T) => void;
  onDelete?: (row: T) => Promise<void> | void;
  deletingId?: RowId | null;

  loading?: boolean;
  error?: string | null;
  onDismissError?: () => void;
};

export function ReadOnlyGridTable<T extends object>({
  rowData,
  columns,
  searchText,
  getRowId,
  onRowClick,
  onDelete,
  deletingId = null,
  loading = false,
  error = null,
  onDismissError,
}: ReadOnlyGridTableProps<T>) {
  const columnDefs = useMemo<ColDef<T>[]>(() => {
    const deleteColumn: ColDef<T>[] = onDelete
      ? [
          {
            colId: "delete",
            headerName: "삭제",
            editable: false,
            sortable: false,
            resizable: false,
            width: 100,
            flex: 0,
            headerClass: "ag-header-cell-center",
            cellStyle: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            cellRenderer: (params: ICellRendererParams<T>) => {
              if (!params.data) return null;

              const rowId = getRowId(params.data);
              const isDeleting = deletingId === rowId;

              return (
                <Button
                  size="xs"
                  color="red"
                  disabled={isDeleting}
                  onClick={(event) => {
                    // 삭제 버튼 클릭 시 수정 페이지로 이동하지 않게 함
                    event.stopPropagation();
                    void onDelete(params.data!);
                  }}
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </Button>
              );
            },
          },
        ]
      : [];

    return [...columns, ...deleteColumn];
  }, [columns, onDelete, getRowId, deletingId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <Alert color="failure" onDismiss={onDismissError}>
          {error}
        </Alert>
      )}

      <div
        className="overflow-hidden rounded-xl bg-white shadow"
        style={{ height: "calc(100vh - 300px)", width: "100%" }}
      >
        <AgGridReact<T>
          modules={[AllCommunityModule]}
          theme={themeAlpine}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            editable: false,
            sortable: true,
            resizable: true,
            flex: 1,
            minWidth: 100,
            cellStyle: {
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
            },
          }}
          rowHeight={45}
          quickFilterText={searchText}
          getRowId={(params) => String(getRowId(params.data))}
          onCellClicked={(event) => {
            // 삭제 컬럼은 수정 화면 이동 대상에서 제외
            if (event.column.getColId() === "delete") return;

            if (event.data) {
              onRowClick?.(event.data);
            }
          }}
        />
      </div>
    </div>
  );
}
