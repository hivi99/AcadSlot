
export default function FacultySession() {
  const sessions = [
    { student: "Amit Verma", subject: "Java", time: "2:00 PM" },
    { student: "Neha Shah", subject: "DBMS", time: "3:00 PM" },
  ];

  return (
    <section className="dashboard-panel">
      <h1>My Sessions</h1>

      {sessions.map((session) => (
        <div className="schedule-item" key={session.student}>
          <strong>{session.time}</strong>
          <div>
            <p>{session.subject}</p>
            <small>Student: {session.student}</small>
          </div>
        </div>
      ))}
    </section>
  );
}
