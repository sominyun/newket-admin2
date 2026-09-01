import { Button, ButtonGroup, TextInput } from "flowbite-react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import type { SaleStatus } from "../../src/api/types";
import { SALE_STATUS_LABELS } from "../../src/api/types";

const SALE_STATUSES: SaleStatus[] = ["before-sale", "on-sale", "after-sale"];

interface TicketToolbarProps {
  saleStatus: SaleStatus;
  onSaleStatusChange: (status: SaleStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddTicket: () => void;
}

export function TicketToolbar({
  saleStatus,
  onSaleStatusChange,
  searchQuery,
  onSearchChange,
  onAddTicket,
}: TicketToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonGroup>
        {SALE_STATUSES.map((status) => (
          <Button
            key={status}
            color={saleStatus === status ? "blue" : "alternative"}
            onClick={() => onSaleStatusChange(status)}
          >
            {SALE_STATUS_LABELS[status]}
          </Button>
        ))}
      </ButtonGroup>

      <TextInput
        className="min-w-[200px] flex-1"
        icon={HiOutlineSearch}
        placeholder="공연명을 입력하세요"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Button onClick={onAddTicket} className="shrink-0">
        <HiPlus className="mr-2 h-5 w-5" />
        티켓추가
      </Button>
    </div>
  );
}
