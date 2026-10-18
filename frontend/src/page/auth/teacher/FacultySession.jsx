
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  BookOpen,
  UserRound,
  CalendarCheck,
} from "lucide-react";

const initialSessions = [
  {
    id: 1,
    time: "2:00 PM",
    subject: "Java",
    student: "Amit Verma",
    date: "2026-10-19",
    status: "Upcoming",
  },
  {
    id: 2,
    time: "3:00 PM",
    subject: "DBMS",
    student: "Neha Shah",
    date: "2026-10-19",
    status: "Upcoming",
  },
  {
    id: 3,
    time: "11:00 AM",
    subject: "Data Structures",
    student: "Riya Patil",
    date: "2026-10-20",
    status: "Upcoming",
  },
];

export default function FacultySession() {
  const [sessions, setSessions] = useState(initialSessions);
  const [filter, setFilter] = useState("All");

  const visibleSessions = sessions.filter((session) => {
    return filter === "All" || session.status === filter;
  });

  const upcomingCount = sessions.filter(
    (session) => session.status === "Upcoming"
  ).length;

  const completedCount = sessions.filter(
    (session) => session.status === "Completed"
  ).length;

  const cancelSession = (id) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? { ...session, status: "Cancelled" }
          : session
      )
    );
  };

  const completeSession = (id) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? { ...session, status: "Completed" }
          : session
      )
    );
  };

  return (
    <div className="teacher-sessions-page">
      <div className="teacher-sessions-header">
        <div>
          <h1>My Sessions</h1>
          <p>View and manage your scheduled student sessions.</p>
        </div>

        <CalendarDays
          size={30}
          className="teacher-sessions-heading-icon"
        />
      </div>

      <div className="teacher-sessions-summary">
        <div className="teacher-session-summary-card">
          <CalendarCheck size={22} />
          <div>
            <span>Upcoming Sessions</span>
            <strong>{upcomingCount}</strong>
          </div>
        </div>

        <div className="teacher-session-summary-card">
          <BookOpen size={22} />
          <div>
            <span>Completed Sessions</span>
            <strong>{completedCount}</strong>
          </div>
        </div>
      </div>

      <div className="teacher-sessions-toolbar">
        <h2>Scheduled Sessions</h2>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter sessions"
        >
          <option value="All">All Sessions</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="teacher-sessions-list">
        {visibleSessions.length === 0 ? (
          <div className="teacher-sessions-empty">
            <CalendarDays size={32} />
            <h3>No sessions found</h3>
            <p>Sessions matching this filter will appear here.</p>
          </div>
        ) : (
          visibleSessions.map((session) => (
            <article className="teacher-session-card" key={session.id}>
              <div className="teacher-session-card-top">
                <div className="teacher-session-time">
                  <Clock size={19} />
                  <strong>{session.time}</strong>
                </div>

                <span
                  className={`teacher-session-status ${session.status.toLowerCase()}`}
                >
                  {session.status}
                </span>
              </div>

              <h3>{session.subject}</h3>

              <div className="teacher-session-student">
                <UserRound size={17} />
                <span>Student: {session.student}</span>
              </div>

              <div className="teacher-session-date">
                <CalendarDays size={17} />
                <span>
                  {new Date(
                    `${session.date}T12:00:00`
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {session.status === "Upcoming" && (
                <div className="teacher-session-actions">
                  <button
                    type="button"
                    className="teacher-session-button complete"
                    onClick={() => completeSession(session.id)}
                  >
                    Mark Completed
                  </button>

                  <button
                    type="button"
                    className="teacher-session-button cancel"
                    onClick={() => cancelSession(session.id)}
                  >
                    Cancel Session
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
