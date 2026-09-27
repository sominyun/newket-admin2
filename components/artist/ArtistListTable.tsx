import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { Button, TextInput } from "flowbite-react";
import { HiOutlineGlobeAlt } from "react-icons/hi";

import {
  createPlaceholderRenderer,
  EditableGridTable,
} from "../common/EditableGridTable.tsx";
import {
  crawlArtist,
  getAllArtists,
  saveArtists,
} from "../../src/api/artistApi.ts";
import type { ArtistTableDto, EditableArtistRow } from "../../src/api/types.ts";

function toArtistTableDto(row: EditableArtistRow): ArtistTableDto {
  return {
    artistId: row.artistId ?? 0,
    name: row.name,
    subName: row.subName || null,
    nickname: row.nickname || null,
    imageUrl: row.imageUrl || null,
  };
}

function toEditableArtistRow(row: ArtistTableDto): EditableArtistRow {
  return {
    artistId: row.artistId,
    name: row.name,
    subName: row.subName ?? "",
    nickname: row.nickname ?? "",
    imageUrl: row.imageUrl ?? "",
  };
}

export function ArtistListTable() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [crawlQuery, setCrawlQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<EditableArtistRow[]>([]);

  const columns = useMemo<ColDef<EditableArtistRow>[]>(
    () => [
      {
        field: "artistId",
        headerName: "ID",
        width: 100,
        flex: 0,
        cellRenderer: createPlaceholderRenderer("id"),
      },
      {
        field: "name",
        headerName: "아티스트명",
        cellRenderer: createPlaceholderRenderer("아티스트명"),
      },
      {
        field: "subName",
        headerName: "서브네임",
        cellRenderer: createPlaceholderRenderer("서브네임"),
      },
      {
        field: "nickname",
        headerName: "닉네임",
        cellRenderer: createPlaceholderRenderer("닉네임"),
      },
      {
        field: "imageUrl",
        headerName: "이미지 URL",
        minWidth: 520,
        flex: 0,
        cellRenderer: createPlaceholderRenderer("이미지 URL"),
      },
    ],
    [],
  );

  const loadArtists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllArtists();
      setArtists(response.map(toEditableArtistRow));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "아티스트 목록 조회 실패",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  const handleCrawl = async () => {
    const query = crawlQuery.trim();

    if (!query) {
      setError("크롤링할 아티스트명을 입력하세요.");
      return;
    }

    setCrawling(true);
    setError(null);

    try {
      const crawled = await crawlArtist(query);
      const name = crawled.name?.trim() ?? "";
      const subName = crawled.subName?.trim() ?? "";
      const imageUrl = crawled.imageUrl?.trim() ?? "";

      if (!name && !subName && !imageUrl) {
        setError(`"${query}" 로 검색된 아티스트가 없습니다.`);
        return;
      }

      setArtists((prev) => [
        {
          artistId: null,
          name,
          subName,
          nickname: "",
          imageUrl,
        },
        ...prev,
      ]);
      setCrawlQuery("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "아티스트 크롤링에 실패했습니다.",
      );
    } finally {
      setCrawling(false);
    }
  };

  const handleSave = async (rows: EditableArtistRow[]) => {
    setSaving(true);
    setError(null);

    try {
      await saveArtists(rows.map(toArtistTableDto));
      await loadArtists();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "아티스트 저장에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditableGridTable
      addButtonLabel="+ 아티스트 추가"
      rowData={artists}
      onRowDataChange={setArtists}
      columns={columns}
      createEmptyRow={() => ({
        artistId: null,
        name: "",
        subName: "",
        nickname: "",
        imageUrl: "",
      })}
      onSave={handleSave}
      loading={loading}
      saving={saving}
      error={error}
      onDismissError={() => setError(null)}
      toolbarExtra={
        <form
          className="flex items-center gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void handleCrawl();
          }}
        >
          <TextInput
            className="flex-1"
            icon={HiOutlineGlobeAlt}
            placeholder="추가할 아티스트명을 입력하세요."
            value={crawlQuery}
            onChange={(e) => setCrawlQuery(e.currentTarget.value)}
            disabled={crawling}
          />
          <Button type="submit" color="alternative" disabled={crawling}>
            {crawling ? "크롤링 중..." : "크롤링으로 가져오기"}
          </Button>
        </form>
      }
    />
  );
}
