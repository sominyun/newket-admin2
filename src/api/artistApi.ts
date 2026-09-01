import { apiGet, apiPut } from "./client.ts";
import type { ArtistTableDto } from "./types.ts";

export function getAllArtists() {
  return apiGet<ArtistTableDto[]>(`/artist`);
}

export function saveArtists(artists: ArtistTableDto[]) {
  return apiPut<void>(`/artist`, artists);
}
