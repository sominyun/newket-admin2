import type { Price, TicketSaleScheduleDto } from "../api/types";

export function formatSaleSchedules(
  schedules: TicketSaleScheduleDto[],
): string[] {
  return schedules.map(
    (schedule) =>
      `${schedule.type}: ${schedule.date} (${schedule.ticketProviders})`,
  );
}

export function formatPrices(prices: Price[]): string[] {
  return prices.map((p) => `${p.type}:${p.price}`);
}