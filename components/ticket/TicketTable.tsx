import { Spinner } from "flowbite-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";

import type { Ticket } from "../../src/api/types";
import {
  formatPrices,
  formatSaleSchedules,
} from "../../src/utils/ticketFormatters";
import { KbdList } from "../common/KbdGroup";
import { ReadOnlyGridTable } from "../common/ReadOnlyGridTable";

interface TicketTableProps {
  tickets: Ticket[];
  loading: boolean;
  searchQuery: string;
  onDelete: (ticketId: number) => void;
  deletingId: number | null;
}

export function TicketTable({
  tickets,
  loading,
  searchQuery,
  onDelete,
  deletingId,
}: TicketTableProps) {
  const navigate = useNavigate();

  const columns = useMemo<ColDef<Ticket>[]>(
    () => [
      {
        field: "ticketId",
        headerName: "ID",
        maxWidth: 80,
      },
      {
        field: "title",
        headerName: "공연명",
        minWidth: 180,
      },
      {
        headerName: "오픈일시",
        minWidth: 300,
        autoHeight: true,
        wrapText: true,
        cellRenderer: (params: { data?: Ticket }) =>
          params.data ? (
            <KbdList
              items={formatSaleSchedules(params.data.ticketSaleSchedules)}
            />
          ) : null,
      },
      {
        headerName: "아티스트",
        minWidth: 100,
        autoHeight: true,
        wrapText: true,
        cellRenderer: (params: { data?: Ticket }) =>
          params.data ? <KbdList items={params.data.artists} /> : null,
      },
      {
        headerName: "공연 일시",
        minWidth: 180,
        autoHeight: true,
        wrapText: true,
        cellRenderer: (params: { data?: Ticket }) =>
          params.data ? <KbdList items={params.data.dateList} /> : null,
      },
      {
        field: "place",
        headerName: "공연 장소",
        valueFormatter: (params) => params.value ?? "-",
      },
      {
        headerName: "티켓 가격",
        minWidth: 180,
        autoHeight: true,
        wrapText: true,
        cellRenderer: (params: { data?: Ticket }) =>
          params.data ? (
            <KbdList items={formatPrices(params.data.prices)} />
          ) : null,
      },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner color="info" size="xl" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        조회된 티켓이 없습니다.
      </div>
    );
  }

  return (
    <ReadOnlyGridTable<Ticket>
      rowData={tickets}
      columns={columns}
      searchText={searchQuery}
      getRowId={(ticket) => ticket.ticketId}
      deletingId={deletingId}
      onRowClick={(ticket) => {
        navigate(`/ticket/${ticket.ticketId}/edit`);
      }}
      onDelete={(ticket) => {
        onDelete(ticket.ticketId);
      }}
    />
  );
}
