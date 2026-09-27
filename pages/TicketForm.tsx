import {
  Alert,
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AdminNavbar } from "../components/layout/AdminNavbar";
import {
  createMusicalTicket,
  createTicket,
  fetchTicketFromUrl, getMusicalTicket,
  getTicket,
  searchArtists,
  searchPlaces,
  updateMusicalTicket,
  updateTicket,
} from "../src/api/ticketApi";
import {
  Artist,
  CreateMusicalRequest,
  CreateTicketRequest,
  Genre,
  GENRE_LABELS,
  PlaceTableDto,
  Price,
  PROVIDER_LABELS,
  TicketEventSchedule,
  TicketProvider,
  TicketSaleSchedule,
  TicketSaleUrl,
} from "../src/api/types";

const emptyArtist = (isMusical: boolean): Artist =>
  isMusical ? { artistId: 0, name: "", role: "" } : { artistId: 0, name: "" };

const emptyEventSchedule = (): TicketEventSchedule => ({
  day: "",
  time: "",
});

const emptySaleSchedule = (): TicketSaleSchedule => ({
  day: "",
  time: "",
  type: "",
});

const emptySaleUrl = (): TicketSaleUrl => ({
  ticketProvider: "",
  url: "",
  isDirectUrl: false,
  ticketSaleSchedules: [emptySaleSchedule()],
});

const emptyPrice = (): Price => ({
  type: "",
  price: "",
});

const emptyForm = (genre: Genre, forCreate = false): CreateTicketRequest => ({
  genre,
  artists: forCreate ? [] : [emptyArtist(genre === "MUSICAL")],
  place: "",
  title: "",
  imageUrl: "",
  ticketEventSchedule: [emptyEventSchedule()],
  ticketSaleUrls: [emptySaleUrl()],
  lineupImage: "",
  price: [emptyPrice()],
});

function normalizeTime(time: string): string {
  if (!time) return "";
  return time.length >= 5 ? time.slice(0, 5) : time;
}

function mapFetchedTicket(
  data: CreateTicketRequest | CreateMusicalRequest,
  genre: Genre,
  isMusical: boolean,
): CreateTicketRequest {
  return {
    ...data,
    genre: data.genre ?? genre,
    place: data.place ?? null,
    lineupImage: data.lineupImage ?? "",
    artists: data.artists.map((artist) =>
      isMusical
        ? {
            artistId: artist.artistId,
            name: artist.name,
            role: artist.role ?? "",
          }
        : {
            artistId: artist.artistId,
            name: artist.name,
          },
    ),
    ticketEventSchedule: data.ticketEventSchedule.map((schedule) => ({
      day: schedule.day,
      time: normalizeTime(schedule.time),
    })),
    ticketSaleUrls: data.ticketSaleUrls.map((saleUrl) => ({
      ...saleUrl,
      ticketSaleSchedules: saleUrl.ticketSaleSchedules.map((schedule) => ({
        ...schedule,
        day: schedule.day,
        time: normalizeTime(schedule.time),
      })),
    })),
  };
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function stripMarkdownBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}

function buildSubmitPayload(form: CreateTicketRequest): CreateTicketRequest {
  return {
    ...form,
    place: form.place || null,
    lineupImage: form.lineupImage || null,
    artists: form.artists.map((artist) => ({
      ...artist,
      name: stripMarkdownBold(artist.name),
    })),
  };
}

function buildMusicalSubmitPayload(
  form: CreateTicketRequest,
): CreateMusicalRequest {
  const payload = buildSubmitPayload(form);

  return {
    ...payload,
    artists: payload.artists.map((artist) => ({
      artistId: artist.artistId,
      name: artist.name,
      role: artist.role ?? "",
    })),
  };
}

function RemoveRowButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" size="xs" color="failure" onClick={onClick}>
      <HiMinus className="h-4 w-4" />
    </Button>
  );
}

function ArrayFieldHeader({
  label,
  onAdd,
}: {
  label: string;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      <Button size="xs" color="light" onClick={onAdd}>
        <HiPlus className="mr-1 h-4 w-4" />
        추가
      </Button>
    </div>
  );
}

function PlaceSearchField({
  value,
  suggestedQuery,
  onSelect,
}: {
  value: string | null;
  suggestedQuery?: string;
  onSelect: (placeName: string) => void;
}) {
  const [query, setQuery] = useState(value ?? "");
  const [results, setResults] = useState<PlaceTableDto[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  const runSearch = useCallback(async (searchText: string) => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }

    setSearchError(null);

    try {
      const places = await searchPlaces(searchText.trim());
      setResults(places);
      setShowResults(true);
    } catch (err) {
      setResults([]);
      setSearchError(
        err instanceof Error ? err.message : "장소 검색에 실패했습니다.",
      );
    }
  }, []);

  useEffect(() => {
    if (suggestedQuery) {
      setQuery(suggestedQuery);
    }
  }, [suggestedQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    void runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative space-y-1">
      <Label htmlFor="place-search">공연 장소</Label>
      <TextInput
        id="place-search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => {
          if (results.length > 0) {
            setShowResults(true);
          }
        }}
        placeholder="장소명을 입력하세요"
        autoComplete="off"
      />

      {searchError && <p className="text-sm text-red-600">{searchError}</p>}

      {showResults && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border border-gray-200 bg-white shadow">
          {results.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  setQuery(place.placeName);
                  onSelect(place.placeName);
                  setResults([]);
                  setShowResults(false);
                }}
              >
                {place.placeName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ArtistSearchField({
  artists,
  isMusical,
  onAdd,
  onUpdate,
  onRemove,
}: {
  artists: Artist[];
  isMusical: boolean;
  onAdd: (artist: Artist) => void;
  onUpdate: (artist: Artist) => void;
  onRemove: (artistId: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artist[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setSearchError(null);

      try {
        const foundArtists = await searchArtists(debouncedQuery.trim());
        setResults(foundArtists);
        setShowResults(true);
      } catch (err) {
        setResults([]);
        setSearchError(
          err instanceof Error ? err.message : "아티스트 검색에 실패했습니다.",
        );
      }
    };

    void search();
  }, [debouncedQuery]);

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="relative">
        <TextInput
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder="아티스트명을 입력하세요"
          autoComplete="off"
        />

        {searchError && (
          <p className="mt-1 text-sm text-red-600">{searchError}</p>
        )}

        {showResults && results.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border border-gray-200 bg-white shadow">
            {results.map((artist) => {
              const alreadyAdded = artists.some(
                (item) => item.artistId === artist.artistId,
              );

              return (
                <li key={artist.artistId}>
                  <button
                    type="button"
                    disabled={alreadyAdded}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                    onClick={() => {
                      onAdd(
                        isMusical
                          ? {
                              artistId: artist.artistId,
                              name: artist.name,
                              role: "",
                            }
                          : {
                              artistId: artist.artistId,
                              name: artist.name,
                            },
                      );
                      setResults([]);
                      setQuery("");
                      setShowResults(false);
                    }}
                  >
                    {renderBoldText(artist.name)}
                    {alreadyAdded ? " (추가됨)" : ""}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {artists.length > 0 ? (
        <div className="space-y-1">
          <div
            className={`grid gap-2 text-xs text-gray-500 ${
              isMusical
                ? "grid-cols-[minmax(80px,1fr)_minmax(120px,2fr)_minmax(100px,1.5fr)_32px]"
                : "grid-cols-[minmax(80px,1fr)_minmax(120px,2fr)_32px]"
            }`}
          >
            <span>Artist ID</span>
            <span>이름</span>
            {isMusical && <span>역할</span>}
            <span />
          </div>

          {artists.map((artist) => (
            <div
              key={artist.artistId}
              className={`grid items-center gap-2 ${
                isMusical
                  ? "grid-cols-[minmax(80px,1fr)_minmax(120px,2fr)_minmax(100px,1.5fr)_32px]"
                  : "grid-cols-[minmax(80px,1fr)_minmax(120px,2fr)_32px]"
              }`}
            >
              <TextInput value={artist.artistId} readOnly disabled />
              <div className="flex min-h-[42px] items-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                {renderBoldText(artist.name)}
              </div>
              {isMusical && (
                <TextInput
                  value={artist.role ?? ""}
                  onChange={(e) =>
                    onUpdate({ ...artist, role: e.target.value })
                  }
                  required
                />
              )}
              <RemoveRowButton onClick={() => onRemove(artist.artistId)} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          검색을 통해 아티스트를 추가해주세요.
        </p>
      )}
    </div>
  );
}

const TicketForm: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId: string }>();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(ticketId);
  const genreParam = (searchParams.get("genre") as Genre) || "CONCERT";

  const [form, setForm] = useState<CreateTicketRequest>(
    emptyForm(genreParam, true),
  );
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [crawlUrl, setCrawlUrl] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [suggestedPlaceQuery, setSuggestedPlaceQuery] = useState<string>();

  const isMusical = form.genre === "MUSICAL";

  const loadTicket = useCallback(async () => {
    if (!ticketId) return;

    setLoading(true);
    setError(null);

    try {
      let ticket = await getTicket(Number(ticketId));

      if (ticket.genre === "MUSICAL") {
        ticket = await getMusicalTicket(Number(ticketId));
      }

      setForm({
        genre: ticket.genre,
        artists: ticket.artists.map((artist) =>
            ticket.genre === "MUSICAL"
                ? {
                  artistId: artist.artistId,
                  name: artist.name,
                  role: artist.role ?? "",
                }
                : {
                  artistId: artist.artistId,
                  name: artist.name,
                },
        ),
        place: ticket.place ?? "",
        title: ticket.title,
        imageUrl: ticket.imageUrl,
        ticketEventSchedule: ticket.ticketEventSchedule,
        ticketSaleUrls: ticket.ticketSaleUrls,
        lineupImage: ticket.lineupImage ?? "",
        price: ticket.price,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "티켓 정보를 불러오는데 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (isEdit) {
      loadTicket();
    }
  }, [isEdit, loadTicket]);

  const addArtistFromSearch = (artist: Artist) => {
    setForm((prev) => {
      const exists = prev.artists.some(
        (item) => item.artistId === artist.artistId,
      );

      if (exists) {
        return {
          ...prev,
          artists: prev.artists.map((item) =>
            item.artistId === artist.artistId ? artist : item,
          ),
        };
      }

      return {
        ...prev,
        artists: [...prev.artists, artist],
      };
    });
  };

  const updateArtistFromSearch = (artist: Artist) => {
    setForm((prev) => ({
      ...prev,
      artists: prev.artists.map((item) =>
        item.artistId === artist.artistId ? artist : item,
      ),
    }));
  };

  const removeArtist = (artistId: number) => {
    setForm((prev) => ({
      ...prev,
      artists: prev.artists.filter((artist) => artist.artistId !== artistId),
    }));
  };

  const handleCrawl = async () => {
    if (!crawlUrl.trim()) {
      return;
    }

    setCrawling(true);
    setError(null);

    try {
      const fetched = await fetchTicketFromUrl(crawlUrl.trim(), form.genre);
      const mapped = mapFetchedTicket(fetched, form.genre, isMusical);
      setForm((prev) => ({
        ...mapped,
        genre: prev.genre,
      }));

      if (fetched.place) {
        setSuggestedPlaceQuery(fetched.place);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "예매처 정보를 불러오는데 실패했습니다.",
      );
    } finally {
      setCrawling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.place) {
      setError("공연 장소를 검색하여 선택해주세요.");
      return;
    }

    if (form.artists.length === 0) {
      setError("아티스트를 검색하여 추가해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (isEdit && ticketId) {
        if (isMusical) {
          await updateMusicalTicket(
            Number(ticketId),
            buildMusicalSubmitPayload(form),
          );
        } else {
          await updateTicket(Number(ticketId), buildSubmitPayload(form));
        }
        setSuccessMessage("티켓이 수정되었습니다.");
      } else {
        if (isMusical) {
          await createMusicalTicket(buildMusicalSubmitPayload(form));
        } else {
          await createTicket(buildSubmitPayload(form));
        }
        setSuccessMessage("티켓이 생성되었습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "티켓 저장에 실패했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateEventSchedule = (
    index: number,
    field: keyof TicketEventSchedule,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      ticketEventSchedule: prev.ticketEventSchedule.map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule,
      ),
    }));
  };

  const updateSaleUrl = (
    urlIndex: number,
    field: keyof Omit<TicketSaleUrl, "ticketSaleSchedules">,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      ticketSaleUrls: prev.ticketSaleUrls.map((url, i) =>
        i === urlIndex ? { ...url, [field]: value } : url,
      ),
    }));
  };

  const updateSaleSchedule = (
    urlIndex: number,
    scheduleIndex: number,
    field: keyof TicketSaleSchedule,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      ticketSaleUrls: prev.ticketSaleUrls.map((url, i) =>
        i === urlIndex
          ? {
              ...url,
              ticketSaleSchedules: url.ticketSaleSchedules.map((schedule, j) =>
                j === scheduleIndex
                  ? { ...schedule, [field]: value }
                  : schedule,
              ),
            }
          : url,
      ),
    }));
  };

  const updatePrice = (index: number, field: keyof Price, value: string) => {
    setForm((prev) => ({
      ...prev,
      price: prev.price.map((p, i) =>
        i === index ? { ...p, [field]: value } : p,
      ),
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner color="info" size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="mx-auto max-w-6xl p-8">
        {error && (
          <Alert
            color="failure"
            className="mb-4"
            onDismiss={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEdit && (
            <section className="space-y-4 rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold">예매처 크롤링</h2>
              <div className="flex flex-wrap gap-3">
                <TextInput
                  className="flex-1"
                  id="crawlUrl"
                  value={crawlUrl}
                  onChange={(e) => setCrawlUrl(e.target.value)}
                  placeholder="티켓 예매처 붙여넣기"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  color="blue"
                  onClick={handleCrawl}
                  disabled={crawling || !crawlUrl.trim()}
                >
                  {crawling ? "크롤링 중..." : "예매처 크롤링하기"}
                </Button>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <section className="space-y-4 rounded-lg bg-white p-6 shadow">
                <h2 className="text-lg font-semibold">기본 정보</h2>
                <div>
                  <Label htmlFor="genre">장르</Label>
                  <Select
                    id="genre"
                    value={form.genre}
                    disabled={isEdit}
                    onChange={(e) => {
                      const newGenre = e.target.value as Genre;
                      setForm({
                        ...emptyForm(newGenre, !isEdit),
                        genre: newGenre,
                      });
                    }}
                  >
                    {Object.entries(GENRE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">공연명</Label>
                  <TextInput
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">티켓 이미지 URL</Label>
                  <TextInput
                    id="imageUrl"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                    }
                    required
                  />
                </div>

                <PlaceSearchField
                  value={form.place}
                  suggestedQuery={suggestedPlaceQuery}
                  onSelect={(placeName) =>
                    setForm((prev) => ({
                      ...prev,
                      place: placeName || null,
                    }))
                  }
                />
              </section>

              <section className="rounded-lg bg-white p-6 shadow">
                <ArrayFieldHeader
                  label="예매 정보"
                  onAdd={() =>
                    setForm((prev) => ({
                      ...prev,
                      ticketSaleUrls: [...prev.ticketSaleUrls, emptySaleUrl()],
                    }))
                  }
                />

                {form.ticketSaleUrls.map((saleUrl, urlIndex) => (
                  <div key={urlIndex} className="space-y-3 rounded p-4">
                    <div className="flex flex-wrap gap-3">
                      <div className="min-w-[140px] flex-1">
                        <Label>예매처</Label>
                        <Select
                          id="ticketProvider"
                          value={saleUrl.ticketProvider}
                          onChange={(e) => {
                            const newProvider = e.target
                              .value as TicketProvider;
                            setForm((prev) => ({
                              ...prev,
                              ticketSaleUrls: prev.ticketSaleUrls.map(
                                (url, i) =>
                                  i === urlIndex
                                    ? {
                                        ...url,
                                        ticketProvider: newProvider,
                                      }
                                    : url,
                              ),
                            }));
                          }}
                        >
                          {Object.entries(PROVIDER_LABELS).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ),
                          )}
                        </Select>
                      </div>
                      <div className="min-w-[200px] flex-[2]">
                        <Label>URL</Label>
                        <TextInput
                          value={saleUrl.url}
                          onChange={(e) =>
                            updateSaleUrl(urlIndex, "url", e.target.value)
                          }
                          required
                        />
                      </div>
                      {form.ticketSaleUrls.length > 1 && (
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              ticketSaleUrls: prev.ticketSaleUrls.filter(
                                (_, i) => i !== urlIndex,
                              ),
                            }))
                          }
                        >
                          <HiMinus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1 pl-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          판매 일정
                        </span>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              ticketSaleUrls: prev.ticketSaleUrls.map(
                                (url, i) =>
                                  i === urlIndex
                                    ? {
                                        ...url,
                                        ticketSaleSchedules: [
                                          ...url.ticketSaleSchedules,
                                          emptySaleSchedule(),
                                        ],
                                      }
                                    : url,
                              ),
                            }))
                          }
                        >
                          <HiPlus className="mr-1 h-3 w-3" />
                          일정 추가
                        </Button>
                      </div>

                      <div className="grid grid-cols-[minmax(100px,1fr)_minmax(140px,1fr)_minmax(100px,1fr)_32px] gap-2 text-xs text-gray-500">
                        <span>유형</span>
                        <span>날짜</span>
                        <span>시간</span>
                        <span />
                      </div>

                      {saleUrl.ticketSaleSchedules.map(
                        (schedule, scheduleIndex) => (
                          <div
                            key={scheduleIndex}
                            className="grid grid-cols-[minmax(100px,1fr)_minmax(140px,1fr)_minmax(100px,1fr)_32px] items-center gap-2"
                          >
                            <TextInput
                              value={schedule.type}
                              onChange={(e) =>
                                updateSaleSchedule(
                                  urlIndex,
                                  scheduleIndex,
                                  "type",
                                  e.target.value,
                                )
                              }
                              placeholder="선예매, 일반예매"
                              required
                            />
                            <TextInput
                              type="date"
                              value={schedule.day}
                              onChange={(e) =>
                                updateSaleSchedule(
                                  urlIndex,
                                  scheduleIndex,
                                  "day",
                                  e.target.value,
                                )
                              }
                              required
                            />
                            <TextInput
                              type="time"
                              value={schedule.time}
                              onChange={(e) =>
                                updateSaleSchedule(
                                  urlIndex,
                                  scheduleIndex,
                                  "time",
                                  e.target.value,
                                )
                              }
                              required
                            />
                            {saleUrl.ticketSaleSchedules.length > 1 ? (
                              <RemoveRowButton
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    ticketSaleUrls: prev.ticketSaleUrls.map(
                                      (url, i) =>
                                        i === urlIndex
                                          ? {
                                              ...url,
                                              ticketSaleSchedules:
                                                url.ticketSaleSchedules.filter(
                                                  (_, j) => j !== scheduleIndex,
                                                ),
                                            }
                                          : url,
                                    ),
                                  }))
                                }
                              />
                            ) : (
                              <span />
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </section>
            </div>
            <div className="space-y-6">
              <section className="space-y-4 rounded-lg bg-white p-6 shadow">
                <ArrayFieldHeader
                  label="공연 일시"
                  onAdd={() =>
                    setForm((prev) => ({
                      ...prev,
                      ticketEventSchedule: [
                        ...prev.ticketEventSchedule,
                        emptyEventSchedule(),
                      ],
                    }))
                  }
                />

                <div className="space-y-1">
                  <div className="grid grid-cols-[minmax(160px,1fr)_minmax(120px,1fr)_32px] gap-3 text-gray-500">
                    <Label>날짜</Label>
                    <Label>시간</Label>
                  </div>

                  {form.ticketEventSchedule.map((schedule, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[minmax(160px,1fr)_minmax(120px,1fr)_32px] items-center gap-2"
                    >
                      <TextInput
                        type="date"
                        value={schedule.day}
                        onChange={(e) =>
                          updateEventSchedule(index, "day", e.target.value)
                        }
                        required
                      />
                      <TextInput
                        type="time"
                        value={schedule.time}
                        onChange={(e) =>
                          updateEventSchedule(index, "time", e.target.value)
                        }
                        required
                      />
                      {form.ticketEventSchedule.length > 1 ? (
                        <RemoveRowButton
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              ticketEventSchedule:
                                prev.ticketEventSchedule.filter(
                                  (_, i) => i !== index,
                                ),
                            }))
                          }
                        />
                      ) : (
                        <span />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 rounded-lg bg-white p-6 shadow">
                <ArrayFieldHeader
                  label="티켓 가격"
                  onAdd={() =>
                    setForm((prev) => ({
                      ...prev,
                      price: [...prev.price, emptyPrice()],
                    }))
                  }
                />

                <div className="space-y-1">
                  <div className="grid grid-cols-[minmax(140px,1fr)_minmax(140px,1fr)_32px] gap-2 text-xs text-gray-500">
                    <Label>좌석 유형</Label>
                    <Label>가격</Label>
                  </div>

                  {form.price.map((priceItem, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[minmax(140px,1fr)_minmax(140px,1fr)_32px] items-center gap-2"
                    >
                      <TextInput
                        value={priceItem.type}
                        onChange={(e) =>
                          updatePrice(index, "type", e.target.value)
                        }
                        placeholder="전석, VIP"
                        required
                      />
                      <TextInput
                        value={priceItem.price}
                        onChange={(e) =>
                          updatePrice(index, "price", e.target.value)
                        }
                        placeholder="154,000원"
                        required
                      />
                      {form.price.length > 1 ? (
                        <RemoveRowButton
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              price: prev.price.filter((_, i) => i !== index),
                            }))
                          }
                        />
                      ) : (
                        <span />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900">
                  아티스트
                </h3>

                <ArtistSearchField
                  artists={form.artists}
                  isMusical={isMusical}
                  onAdd={addArtistFromSearch}
                  onUpdate={updateArtistFromSearch}
                  onRemove={removeArtist}
                />
              </section>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "저장 중..." : isEdit ? "수정" : "생성"}
                </Button>
                <Button
                  type="button"
                  color="light"
                  onClick={() => navigate("/")}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Modal
        show={Boolean(successMessage)}
        size="md"
        onClose={() => {
          setSuccessMessage(null);
          navigate("/");
        }}
      >
        <ModalHeader>{successMessage}</ModalHeader>
        <ModalBody>
          <p className="text-gray-700">
            {isEdit
              ? "티켓 정보가 성공적으로 수정되었습니다."
              : "티켓이 성공적으로 생성되었습니다."}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              setSuccessMessage(null);
              navigate("/");
            }}
          >
            확인
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TicketForm;
