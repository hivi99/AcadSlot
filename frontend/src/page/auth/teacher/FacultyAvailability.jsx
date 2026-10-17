
import { useState } from "react";

export default function FacultyAvailability() {
  const [available, setAvailable] = useState(true);
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("16:00");

  return (
    <section className="dashboard-panel">
      <h1>Faculty Availability</h1>

      <label className="availability-toggle">
        <input
          type="checkbox"
          checked={available}
          onChange={(event) => setAvailable(event.target.checked)}
        />
        Accept student requests
      </label>

      <p>{available ? "Currently available" : "Currently unavailable"}</p>

      <label>
        Start time
        <input
          type="time"
          value={start}
          onChange={(event) => setStart(event.target.value)}
        />
      </label>

      <label>
        End time
        <input
          type="time"
          value={end}
          onChange={(event) => setEnd(event.target.value)}
        />
      </label>

      <p>Selected hours: {start} – {end}</p>
      <small>These settings currently remain in browser memory only.</small>
    </section>
  );
}
