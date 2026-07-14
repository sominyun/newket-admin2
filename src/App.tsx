import { Spinner } from "flowbite-react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));

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
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
