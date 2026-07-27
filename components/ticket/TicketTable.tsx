import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import type { Ticket } from "../../src/api/types";
import { KbdList } from "../common/KbdGroup";
import {
  formatPrices,
  formatSaleSchedules,
} from "../../src/utils/ticketFormatters";

interface TicketTableProps {
  tickets: Ticket[];
  loading: boolean;
  onDelete: (ticketId: number) => void;
  deletingId: number | null;
}

export function TicketTable({
  tickets,
  loading,
  onDelete,
  deletingId,
}: TicketTableProps) {
  const navigate = useNavigate();

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
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>id</TableHeadCell>
            <TableHeadCell>공연명</TableHeadCell>
            <TableHeadCell>오픈일시</TableHeadCell>
            <TableHeadCell>아티스트</TableHeadCell>
            <TableHeadCell>공연 일시</TableHeadCell>
            <TableHeadCell>공연 장소</TableHeadCell>
            <TableHeadCell>티켓 가격</TableHeadCell>
            <TableHeadCell>삭제</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.ticketId}
              className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800"
              onClick={() => navigate(`/ticket/${ticket.ticketId}/edit`)}
            >
              <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                {ticket.ticketId}
              </TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <KbdList
                  items={formatSaleSchedules(ticket.ticketSaleSchedules)}
                />
              </TableCell>
              <TableCell>
                <KbdList items={ticket.artists} />
              </TableCell>
              <TableCell>
                <KbdList items={ticket.dateList} />
              </TableCell>
              <TableCell>{ticket.place ?? "-"}</TableCell>
              <TableCell>
                <KbdList items={formatPrices(ticket.prices)} />
              </TableCell>
              <TableCell>
                <Button
                  size="xs"
                  color="failure"
                  disabled={deletingId === ticket.ticketId}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(ticket.ticketId);
                  }}
                >
                  {deletingId === ticket.ticketId ? "삭제 중..." : "삭제"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
