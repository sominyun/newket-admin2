import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import type { Genre } from "../../src/api/types";
import { GENRE_LABELS } from "../../src/api/types";

const GENRES: Genre[] = ["CONCERT", "FESTIVAL", "MUSICAL"];

interface AdminSidebarProps {
  selectedGenre: Genre;
  onGenreChange: (genre: Genre) => void;
}

export function AdminSidebar({
  selectedGenre,
  onGenreChange,
}: AdminSidebarProps) {
  return (
    <Sidebar className="h-[calc(100vh-65px)]">
      <SidebarItems>
        <SidebarItemGroup>
          {GENRES.map((genre) => (
            <SidebarItem
              key={genre}
              href="#"
              active={selectedGenre === genre}
              onClick={(e) => {
                e.preventDefault();
                onGenreChange(genre);
              }}
            >
              {GENRE_LABELS[genre]}
            </SidebarItem>
          ))}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
