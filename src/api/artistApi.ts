import { apiGet, apiPost, apiPut } from "./client.ts";
import type { ArtistCrawlDto, ArtistTableDto } from "./types.ts";

export function getAllArtists() {
  return apiGet<ArtistTableDto[]>(`/artist`);
}

export function saveArtists(artists: ArtistTableDto[]) {
  return apiPut<void>(`/artist`, artists);
}

export function crawlArtist(query: string) {
  return apiPost<ArtistCrawlDto>(
    `/artist/crawl?query=${encodeURIComponent(query)}`,
    {},
  );
}
