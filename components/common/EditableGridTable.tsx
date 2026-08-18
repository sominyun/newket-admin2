import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";

import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ICellRendererParams,
  themeAlpine,
} from "ag-grid-community";
import { HiOutlineSearch } from "react-icons/hi";

export function createPlaceholderRenderer(placeholder: string) {
  return (params: ICellRendererParams) => {
    if (params.value) return params.value;

    return <span className="text-gray-400">{placeholder}</span>;
  };
}

type EditableGridTableProps<T> = {
  addButtonLabel: string;
  rowData: T[];
  onRowDataChange: Dispatch<SetStateAction<T[]>>;
  columns: ColDef<T>[];
  createEmptyRow: () => T;
  onSave: (rows: T[]) => void | Promise<void>;
  loading?: boolean;
  saving?: boolean;
  error?: string | null;
  onDismissError?: () => void;
};

export function EditableGridTable<T>({
  addButtonLabel,
  rowData,
  onRowDataChange,
  columns,
  createEmptyRow,
  onSave,
  loading = false,
  saving = false,
  error = null,
  onDismissError,
}: EditableGridTableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const gridRef = useRef<AgGridReact<T>>(null);

  const columnDefs = useMemo<ColDef<T>[]>(
    () => [
      ...columns,
      {
        colId: "delete",
        headerName: "삭제",
        editable: false,
        width: 80,
        flex: 0,
        headerClass: "ag-header-cell-center",
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        cellRenderer: (params: ICellRendererParams<T>) => (
          <div className="flex h-full w-full items-center justify-center">
            <Button
              size="xs"
              onClick={() => {
                if (params.data) {
                  gridRef.current?.api.stopEditing();
                  onRowDataChange((prev) =>
                    prev.filter((row) => row !== params.data),
                  );
                }
              }}
            >
              삭제
            </Button>
          </div>
        ),
      },
    ],
    [columns, onRowDataChange],
  );

  const addRow = () => {
    onRowDataChange((prev) => [createEmptyRow(), ...prev]);

    setTimeout(() => {
      gridRef.current?.api.ensureIndexVisible(0, "top");
    }, 100);
  };

  const saveRows = async () => {
    gridRef.current?.api.stopEditing();

    const rows: T[] = [];
    gridRef.current?.api.forEachNode((node) => {
      if (node.data) rows.push(node.data);
    });

    await onSave(rows);
  };

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

      <div className="flex gap-3">
        <TextInput
          className="min-w-[200px] flex-1"
          icon={HiOutlineSearch}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
        />
        <Button color="light" onClick={addRow}>
          {addButtonLabel}
        </Button>
        <Button color="blue" onClick={saveRows} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>

      <div
        className="overflow-hidden rounded-xl bg-white shadow"
        style={{
          height: "calc(100vh - 280px)",
          width: "100%",
        }}
      >
        <AgGridReact
          ref={gridRef}
          modules={[AllCommunityModule]}
          theme={themeAlpine}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            editable: true,
            sortable: false,
            resizable: true,
            flex: 1,
            minWidth: 100,
            suppressKeyboardEvent: (params) => {
              const event = params.event as KeyboardEvent;

              return event.isComposing || event.keyCode === 229;
            },
          }}
          singleClickEdit={true}
          enterNavigatesVertically={true}
          enterNavigatesVerticallyAfterEdit={true}
          stopEditingWhenCellsLoseFocus={false}
          rowHeight={45}
          quickFilterText={searchText}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>
    </div>
  );
}
