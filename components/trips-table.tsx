"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Banknote, CreditCard } from "lucide-react";
import type { Dict as T } from "../lib/i18n";
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

export default function TripsTable({ trips, t }: { trips: Trip[]; t: T }) {
  const columns: ColumnDef<Trip>[] = [
    {
      accessorKey: "start",
      header: ({ column }) => <TableColumnHeader column={column} title={t.time} />,
      cell: ({ row }) => (
        <span>
          {row.original.start} - {row.original.end}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <TableColumnHeader column={column} title={t.amount} />,
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
      header: ({ column }) => <TableColumnHeader column={column} title={t.commission} />,
    },
  ];
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