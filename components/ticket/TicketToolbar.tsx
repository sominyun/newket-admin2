import { Button, ButtonGroup, TextInput } from "flowbite-react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import type { SaleStatus } from "../../src/api/types";
import { SALE_STATUS_LABELS } from "../../src/api/types";

const SALE_STATUSES: SaleStatus[] = ["before-sale", "on-sale", "after-sale"];

interface TicketToolbarProps {
  saleStatus: SaleStatus;
  searchQuery: string;
  onSaleStatusChange: (status: SaleStatus) => void;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onAddTicket: () => void;
}

export function TicketToolbar({
  saleStatus,
  searchQuery,
  onSaleStatusChange,
  onSearchChange,
  onSearch,
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />

      <Button onClick={onAddTicket} className="shrink-0">
        <HiPlus className="mr-2 h-5 w-5" />
        티켓추가
      </Button>
    </div>
  );
}
