
import { useState } from "react";

export default function FacultyAvailability() {
  const [acceptRequests, setAcceptRequests] = useState(true);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("16:00");
  const [saved, setSaved] = useState(false);

  const validTimes = startTime < endTime;

  function saveAvailability() {
    if (!validTimes) {
      alert("Please select an end time later than the start time.");
      return;
    }

    const settings = {
      acceptRequests,
      startTime,
      endTime,
    };

    localStorage.setItem(
      "teacherAvailability",
      JSON.stringify(settings)
    );

    setSaved(true);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Faculty Availability</h1>
          <p>
            Organize your availability and manage when students can
            request doubt-solving sessions.
          </p>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="todo-heading">
          <div>
            <h2>My Availability To-Do List</h2>
            <p>Review your settings and save your working hours.</p>
          </div>
        </div>

        <div className="availability-grid">
          <article className="availability-block">
            <div className="availability-block-heading">
              <span className="availability-icon">✓</span>
              <div>
                <h3>Request Preferences</h3>
                <p>Control whether students can send requests.</p>
              </div>
            </div>

            <label className="availability-toggle">
              <input
                type="checkbox"
                checked={acceptRequests}
                onChange={(event) => {
                  setAcceptRequests(event.target.checked);
                  setSaved(false);
                }}
              />
              <span>Accept student requests</span>
            </label>

            <span
              className={`availability-status ${
                acceptRequests ? "available" : "unavailable"
              }`}
            >
              {acceptRequests
                ? "Currently accepting requests"
                : "Currently not accepting requests"}
            </span>
          </article>

          <article className="availability-block">
            <div className="availability-block-heading">
              <span className="availability-icon">◷</span>
              <div>
                <h3>Working Hours</h3>
                <p>Set the hours when you are available.</p>
              </div>
            </div>

            <div className="availability-time-fields">
              <label>
                Start time
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => {
                    setStartTime(event.target.value);
                    setSaved(false);
                  }}
                />
              </label>

              <label>
                End time
                <input
                  type="time"
                  value={endTime}
                  onChange={(event) => {
                    setEndTime(event.target.value);
                    setSaved(false);
                  }}
                />
              </label>
            </div>

            {!validTimes && (
              <p className="availability-error">
                End time must be later than start time.
              </p>
            )}

            <div className="selected-hours">
              <span>Selected hours</span>
              <strong>
                {startTime || "--:--"} – {endTime || "--:--"}
              </strong>
            </div>
          </article>

          <article className="availability-block availability-summary">
            <div className="availability-block-heading">
              <span className="availability-icon">▣</span>
              <div>
                <h3>Availability Summary</h3>
                <p>Check your current settings before saving.</p>
              </div>
            </div>

            <div className="availability-summary-row">
              <span>Request status</span>
              <strong>
                {acceptRequests ? "Enabled" : "Disabled"}
              </strong>
            </div>

            <div className="availability-summary-row">
              <span>Start time</span>
              <strong>{startTime || "--:--"}</strong>
            </div>

            <div className="availability-summary-row">
              <span>End time</span>
              <strong>{endTime || "--:--"}</strong>
            </div>

            <button
              className="btn-primary availability-save-button"
              type="button"
              onClick={saveAvailability}
              disabled={!validTimes || !startTime || !endTime}
            >
              Save Availability
            </button>

            {saved && (
              <p className="availability-saved">
                ✓ Availability saved successfully!
              </p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}





