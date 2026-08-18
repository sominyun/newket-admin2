import { apiGet, apiPut } from "./client.ts";
import type { PlaceTableDto } from "./types.ts";

export function getAllPlaces() {
  return apiGet<PlaceTableDto[]>(`/place`);
}

export function savePlaces(places: PlaceTableDto[]) {
  return apiPut<void>(`/place`, places);
}
