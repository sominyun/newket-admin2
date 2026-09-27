export type Genre = "CONCERT" | "FESTIVAL" | "MUSICAL";
export type TicketProvider = "INTERPARK" | "YES24" | "MELON" | "TICKETLINK";
export type SaleStatus = "before-sale" | "on-sale" | "after-sale";

export interface Artist {
  artistId: number;
  name: string;
  role?: string;
}

export interface TicketEventSchedule {
  day: string;
  time: string;
}

export interface TicketSaleSchedule {
  day: string;
  time: string;
  type: string;
}

export interface TicketSaleUrl {
  ticketProvider: string;
  url: string;
  isDirectUrl: boolean;
  ticketSaleSchedules: TicketSaleSchedule[];
}

export interface Price {
  type: string;
  price: string;
}

export interface TicketSaleScheduleDto {
  type: string;
  date: string;
  ticketProviders: string[];
}

export interface Ticket {
  ticketId: number;
  title: string;
  place: string;
  dateList: string[];
  ticketSaleSchedules: TicketSaleScheduleDto[];
  prices: Price[];
  artists: string[];
}

export interface CreateTicketRequest {
  genre: Genre;
  artists: Artist[];
  place: string | null;
  title: string;
  imageUrl: string;
  ticketEventSchedule: TicketEventSchedule[];
  ticketSaleUrls: TicketSaleUrl[];
  lineupImage: string | null;
  price: Price[];
}

export interface MusicalArtist {
  artistId: number;
  name: string;
  role: string;
}

export interface CreateMusicalRequest {
  genre: Genre;
  artists: MusicalArtist[];
  place: string | null;
  title: string;
  imageUrl: string;
  ticketEventSchedule: TicketEventSchedule[];
  ticketSaleUrls: TicketSaleUrl[];
  lineupImage: string | null;
  price: Price[];
}

export interface PlaceTableDto {
  id: number;
  placeName: string;
  url: string;
}

export interface GroupTableDto {
  id: number;
  groupId: number;
  memberId: number;
}

export interface ArtistTableDto {
  artistId: number;
  name: string;
  subName: string | null;
  nickname: string | null;
  imageUrl: string | null;
}

export interface ArtistCrawlDto {
  name: string;
  subName: string;
  imageUrl: string;
}

export type EditableArtistRow = Omit<ArtistTableDto, "artistId"> & {
  artistId: number | null;
};

export type EditableGroupRow = Omit<
  GroupTableDto,
  "id" | "groupId" | "memberId"
> & {
  id: number | null;
  groupId: number | null;
  memberId: number | null;
};

export type EditablePlaceRow = Omit<PlaceTableDto, "id"> & {
  id: number | null;
};

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const GENRE_LABELS: Record<Genre, string> = {
  CONCERT: "콘서트/팬미팅",
  FESTIVAL: "페스티벌",
  MUSICAL: "뮤지컬",
};

export const PROVIDER_LABELS: Record<TicketProvider, string> = {
  INTERPARK: "NOL티켓",
  YES24: "yes24티켓",
  MELON: "멜론티켓",
  TICKETLINK: "티켓링크",
};

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  "before-sale": "오픈 예정 티켓",
  "on-sale": "예매 중인 티켓",
  "after-sale": "예매 완료 티켓",
};
