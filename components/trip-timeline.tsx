import type { Trip } from "../lib/summary";
import type { Dict as T } from "../lib/i18n";

export default function TripTimeline({ trips, t }: { trips: Trip[]; t: T }) {
  if (trips.length === 0) return <p className="empty">{t.emptyDay}</p>;
  return (
    <ol className="rail">
      {trips.map((trip) => (
        <li key={trip.id}>
          <div className="row">
            <span>
              {trip.start} - {trip.end} | {trip.amount}
            </span>
            <span className="pay">{trip.payment}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}