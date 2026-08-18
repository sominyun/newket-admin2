import { AdminNavbar } from "../components/layout/AdminNavbar.tsx";
import React, { useState } from "react";
import { Button, ButtonGroup } from "flowbite-react";
import { ArtistListTable } from "../components/artist/ArtistListTable.tsx";
import { ArtistGroupTable } from "../components/artist/ArtistGroupTable.tsx";

const Artist: React.FC = () => {
  const [selected, setSelected] = useState<"list" | "group">("list");

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AdminNavbar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          <ButtonGroup>
            <Button
              color={selected === "list" ? "blue" : "light"}
              onClick={() => setSelected("list")}
            >
              아티스트 목록
            </Button>
            <Button
              color={selected === "group" ? "blue" : "light"}
              onClick={() => setSelected("group")}
            >
              그룹-멤버 그룹화
            </Button>
          </ButtonGroup>

          {selected === "list" && <ArtistListTable></ArtistListTable>}

          {selected === "group" && <ArtistGroupTable></ArtistGroupTable>}
        </div>
      </main>
    </div>
  );
};

export default Artist;
