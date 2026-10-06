"use client";

import { motion } from "framer-motion";
import { Banknote, CreditCard } from "lucide-react";
import type { Trip } from "../lib/summary";
import type { Dict as T } from "../lib/i18n";
import { Badge } from "./ui/badge";

export default function TripTimeline({ trips, t }: { trips: Trip[]; t: T }) {
  if (trips.length === 0) return <p className="empty">{t.emptyDay}</p>;
  return (
    <ol className="rail">
      {trips.map((trip, i) => {
        const cash = trip.payment === "cash";
        const Icon = cash ? Banknote : CreditCard;
        return (
          <motion.li
            key={trip.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
          >
            <div className="row">
              <span>
                {trip.start} - {trip.end} | {trip.amount}
              </span>
              <Badge variant={cash ? "secondary" : "default"} className="pay">
                <Icon className="mr-1 h-3 w-3" />
                {cash ? t.cash : t.card}
              </Badge>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}