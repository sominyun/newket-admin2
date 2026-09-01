import { Alert } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "../components/layout/AdminNavbar";
import { AdminSidebar } from "../components/layout/AdminSidebar";
import { TicketTable } from "../components/ticket/TicketTable";
import { TicketToolbar } from "../components/ticket/TicketToolbar";
import { deleteTicket, getTickets } from "../src/api/ticketApi";
import type { Genre, SaleStatus, Ticket } from "../src/api/types";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [genre, setGenre] = useState<Genre>("CONCERT");
  const [saleStatus, setSaleStatus] = useState<SaleStatus>("before-sale");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      const response = await getTickets(saleStatus, genre);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setTickets(response);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setTickets([]);
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
  }, [saleStatus, genre]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleGenreChange = (newGenre: Genre) => {
    setTickets([]);
    setGenre(newGenre);
  };

  const handleSaleStatusChange = (status: SaleStatus) => {
    setTickets([]);
    setSaleStatus(status);
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
              onSaleStatusChange={handleSaleStatusChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddTicket={() => navigate(`/ticket/new?genre=${genre}`)}
            />

            {error && (
              <Alert color="failure" onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TicketTable
              key={`${saleStatus}-${genre}`}
              tickets={tickets}
              loading={loading}
              searchQuery={searchQuery}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
