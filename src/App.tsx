import { Spinner } from "flowbite-react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Artist from "../pages/Artist.tsx";
import Place from "../pages/Place.tsx";

const Home = lazy(() => import("../pages/Home"));
const TicketForm = lazy(() => import("../pages/TicketForm"));

function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60">
      <Spinner color="info" size="xl" />
      <div className="mt-4 text-lg font-medium">로딩 중입니다...</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/ticket/new"
          element={
            <Suspense fallback={<Loading />}>
              <TicketForm />
            </Suspense>
          }
        />
        <Route
          path="/ticket/:ticketId/edit"
          element={
            <Suspense fallback={<Loading />}>
              <TicketForm />
            </Suspense>
          }
        />
        <Route
          path="/artist"
          element={
            <Suspense fallback={<Loading />}>
              <Artist />
            </Suspense>
          }
        />
        <Route
          path="/place"
          element={
            <Suspense fallback={<Loading />}>
              <Place />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
