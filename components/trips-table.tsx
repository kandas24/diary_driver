"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Banknote, CreditCard } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru, kk } from "date-fns/locale";
import type { Locale } from "date-fns";
import type { Dict as T, Lang } from "../lib/i18n";
import type { Trip } from "../lib/summary";
import { Badge } from "./ui/badge";
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from "./ui/data-table";

function rangeText(trip: Trip, locale?: Locale): string {
  const start = parseISO(trip.start);
  const end = parseISO(trip.end);
  const opts = { locale };
  const sameDay =
    format(start, "yyyy-MM-dd", opts) === format(end, "yyyy-MM-dd", opts);
  if (sameDay) {
    return `${format(start, "HH:mm", opts)} - ${format(end, "HH:mm", opts)}`;
  }
  return `${format(start, "HH:mm, d MMM", opts)} - ${format(end, "HH:mm, d MMM", opts)}`;
}

export default function TripsTable({
  trips,
  t,
  lang,
}: {
  trips: Trip[];
  t: T;
  lang: Lang;
}) {
  const locale = lang === "kk" ? kk : lang === "ru" ? ru : undefined;

  const columns = useMemo<ColumnDef<Trip>[]>(
    () => [
      {
        accessorKey: "start",
        header: ({ column }) => (
          <TableColumnHeader
            column={column}
            title={t.time}
            sortAsc={t.sortAsc}
            sortDesc={t.sortDesc}
          />
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap tabular-nums">
            {rangeText(row.original, locale)}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <TableColumnHeader
            column={column}
            title={t.amount}
            sortAsc={t.sortAsc}
            sortDesc={t.sortDesc}
          />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.amount}</span>
        ),
      },
      {
        accessorKey: "payment",
        header: t.payment,
        cell: ({ row }) => {
          const cash = row.original.payment === "cash";
          const Icon = cash ? Banknote : CreditCard;
          return (
            <Badge variant={cash ? "secondary" : "default"}>
              <Icon className="mr-1 h-3 w-3" />
              {cash ? t.cash : t.card}
            </Badge>
          );
        },
      },
      {
        accessorKey: "commission",
        header: ({ column }) => (
          <TableColumnHeader
            column={column}
            title={t.commission}
            sortAsc={t.sortAsc}
            sortDesc={t.sortDesc}
          />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.commission}</span>
        ),
      },
    ],
    [t, locale]
  );

  return (
    <TableProvider columns={columns} data={trips}>
      <table className="ledger">
        <TableHeader>
          {({ headerGroup }) => (
            <TableHeaderGroup headerGroup={headerGroup}>
              {({ header }) => <TableHead header={header} />}
            </TableHeaderGroup>
          )}
        </TableHeader>
        <TableBody>
          {({ row }) => (
            <TableRow row={row}>{({ cell }) => <TableCell cell={cell} />}</TableRow>
          )}
        </TableBody>
      </table>
    </TableProvider>
  );
}