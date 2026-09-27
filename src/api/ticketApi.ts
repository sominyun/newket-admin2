import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type {
  Artist,
  CreateMusicalRequest,
  CreateTicketRequest,
  Genre,
  PlaceTableDto,
  SaleStatus,
  Ticket,
} from "./types";

export function getTickets(saleStatus: SaleStatus, genre: Genre) {
  return apiGet<Ticket[]>(`/ticket/${saleStatus}/${genre}`);
}

export function getTicket(ticketId: number) {
  return apiGet<CreateTicketRequest>(`/ticket/${ticketId}`);
}

export function getMusicalTicket(ticketId: number) {
  return apiGet<CreateMusicalRequest>(`/ticket/musical/${ticketId}`)
}

export function createTicket(request: CreateTicketRequest) {
  return apiPost<Ticket>("/ticket", request);
}

export function createMusicalTicket(request: CreateMusicalRequest) {
  return apiPost<Ticket>("/ticket/musical", request);
}

export function updateTicket(ticketId: number, request: CreateTicketRequest) {
  return apiPut<Ticket>(`/ticket/${ticketId}`, request);
}

export function updateMusicalTicket(
  ticketId: number,
  request: CreateMusicalRequest,
) {
  return apiPut<Ticket>(`/ticket/musical/${ticketId}`, request);
}

export function deleteTicket(ticketId: number) {
  return apiDelete(`/ticket/${ticketId}`);
}

export function fetchTicketFromUrl(text: string, genre: Genre) {
  if (genre === "MUSICAL") {
    return apiPost<CreateMusicalRequest>("/ticket/musical/fetch", { text });
  }

  return apiPost<CreateTicketRequest>("/ticket/fetch", { text });
}

export function searchPlaces(text: string) {
  return apiPost<PlaceTableDto[]>("/place/search", { text });
}

export function searchArtists(text: string) {
  return apiPost<Artist[]>("/artist/search", { text });
}
