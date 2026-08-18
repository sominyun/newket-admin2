import { apiGet, apiPut } from "./client.ts";
import type { GroupTableDto } from "./types.ts";

export function getAllGroups() {
  return apiGet<GroupTableDto[]>(`/group`);
}

export function saveGroups(groups: GroupTableDto[]) {
  return apiPut<void>(`/group`, groups);
}
