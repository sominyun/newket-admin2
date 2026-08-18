import { AdminNavbar } from "../components/layout/AdminNavbar.tsx";
import React from "react";
import { PlaceListTable } from "../components/place/PlaceListTable.tsx";

const Place: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="flex-1 p-8">
        <PlaceListTable />
      </main>
    </div>
  );
};

export default Place;
