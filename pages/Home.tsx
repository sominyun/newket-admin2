import { Alert, Pagination } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "../components/layout/AdminNavbar";
import { AdminSidebar } from "../components/layout/AdminSidebar";
import { TicketTable } from "../components/ticket/TicketTable";
import { TicketToolbar } from "../components/ticket/TicketToolbar";
import { deleteTicket, getTickets } from "../src/api/ticketApi";
import type { Genre, SaleStatus, Ticket } from "../src/api/types";

const PAGE_SIZE = 10;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [genre, setGenre] = useState<Genre>("CONCERT");
  const [saleStatus, setSaleStatus] = useState<SaleStatus>("before-sale");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const requestIdRef = useRef(0);

  const loadTickets = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setTickets([]);

    try {
      const response = await getTickets(
        saleStatus,
        genre,
        currentPage - 1,
        PAGE_SIZE,
        appliedSearch || undefined,
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      setTickets(response.content);
      setTotalPages(Math.max(response.totalPages, 1));
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setTickets([]);
      setTotalPages(1);
      setError(
        err instanceof Error
          ? err.message
          : "티켓 목록을 불러오는데 실패했습니다.",
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [saleStatus, genre, currentPage, appliedSearch]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleGenreChange = (newGenre: Genre) => {
    setTickets([]);
    setGenre(newGenre);
    setCurrentPage(1);
  };

  const handleSaleStatusChange = (status: SaleStatus) => {
    setTickets([]);
    setSaleStatus(status);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setTickets([]);
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleDelete = async (ticketId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    setDeletingId(ticketId);
    try {
      await deleteTicket(ticketId);
      await loadTickets();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "티켓 삭제에 실패했습니다.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <div className="flex">
        <AdminSidebar selectedGenre={genre} onGenreChange={handleGenreChange} />

        <main className="flex-1 p-8">
          <div className="space-y-6">
            <TicketToolbar
              saleStatus={saleStatus}
              searchQuery={searchQuery}
              onSaleStatusChange={handleSaleStatusChange}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              onAddTicket={() => navigate(`/ticket/new?genre=${genre}`)}
            />

            {error && (
              <Alert color="failure" onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TicketTable
              key={`${saleStatus}-${genre}-${currentPage}-${appliedSearch}`}
              tickets={tickets}
              loading={loading}
              onDelete={handleDelete}
              deletingId={deletingId}
            />

            <div className="flex overflow-x-auto sm:justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showIcons
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
