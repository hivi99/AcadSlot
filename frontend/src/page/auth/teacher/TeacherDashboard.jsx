
import StatCard from "../../../components/StatCard";
import StatusBadge from "../../../components/StatusBadge";

export default function TeacherDashboard() {
  const requests = [
    {
      id: 1,
      student: "Rahul Sharma",
      subject: "DBMS",
      doubt: "Normalization and 3NF",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      student: "Priya Patel",
      subject: "Data Structures",
      doubt: "AVL Tree rotations",
      time: "11:30 AM",
      status: "Pending",
    },
    {
      id: 3,
      student: "Amit Verma",
      subject: "Java",
      doubt: "Inheritance",
      time: "2:00 PM",
      status: "Accepted",
    },
  ];

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p>Welcome back! Manage your student doubt sessions.</p>
        </div>
        <span className="online-label">● Available</span>
      </header>

      <section className="stats-grid">
        <StatCard title="Total Requests" value={requests.length} color="#ffffff" />
        <StatCard
          title="Pending Requests"
          value={requests.filter((r) => r.status === "Pending").length}
          color="#fff8e7"
        />
        <StatCard
          title="Accepted Requests"
          value={requests.filter((r) => r.status === "Accepted").length}
          color="#edfff3"
        />
      </section>

      <section className="dashboard-panel">
        <h2>Recent Doubt Requests</h2>

        <div className="table-scroll">
          <table className="teacher-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Doubt</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.student}</td>
                  <td>{request.subject}</td>
                  <td>{request.doubt}</td>
                  <td>{request.time}</td>
                  <td><StatusBadge status={request.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-panel">
        <h2>Today's Schedule</h2>
        <div className="schedule-item">
          <strong>10:00 AM</strong>
          <div>
            <p>DBMS Doubt Session</p>
            <small>Normalization and 3NF</small>
          </div>
        </div>
        <div className="schedule-item">
          <strong>2:00 PM</strong>
          <div>
            <p>Java Doubt Session</p>
            <small>Inheritance and polymorphism</small>
          </div>
        </div>
      </section>
    </div>
  );
}
