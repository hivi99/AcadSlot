
import { useState } from "react";
import sampleRequests from "../../../data/sampleRequests";

export default function DoubtRequest() {
  const [requests, setRequests] = useState(sampleRequests);
  const [search, setSearch] = useState("");

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const filteredRequests = requests.filter((request) => {
    const searchText = search.toLowerCase();

    return [
      request.studentName,
      request.student,
      request.subject,
      request.doubt,
      request.description,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(searchText)
      );
  });

  function changeStatus(id, newStatus) {
    setRequests((previousRequests) =>
      previousRequests.map((request) =>
        request.id === id
          ? { ...request, status: newStatus }
          : request
      )
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Doubt Requests</h1>
          <p>
            Review student questions and manage their requests.
          </p>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="todo-heading">
          <div>
            <h2>My To-Do List</h2>
            <p>Complete each request by accepting or rejecting it.</p>
          </div>

          <span className="todo-count">
            {pendingCount} pending
          </span>
        </div>

        <div className="todo-search">
          <input
            type="search"
            placeholder="Search by student, subject, or doubt..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {filteredRequests.length > 0 ? (
          <div className="request-grid">
            {filteredRequests.map((request) => {
              const status = request.status || "Pending";

              return (
                <article
                  className="request-block"
                  key={request.id}
                >
                  <div className="request-block-header">
                    <div className="student-avatar">
                      {(request.studentName ||
                        request.student ||
                        "S")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="request-student-info">
                      <h3>
                        {request.studentName ||
                          request.student ||
                          "Student"}
                      </h3>
                      <span>Doubt-solving request</span>
                    </div>

                    <span
                      className={`status-badge status-${status.toLowerCase()}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="request-block-details">
                    <div className="request-detail">
                      <span className="detail-label">
                        Subject
                      </span>
                      <p>
                        {request.subject || "Not specified"}
                      </p>
                    </div>

                    <div className="request-detail">
                      <span className="detail-label">
                        Doubt Description
                      </span>
                      <p>
                        {request.doubt ||
                          request.description ||
                          "No description provided"}
                      </p>
                    </div>

                    <div className="request-time">
                      <span aria-hidden="true">◷</span>
                      <span>
                        {request.time || "Time not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="request-block-footer">
                    {status === "Pending" ? (
                      <>
                        <button
                          className="btn-primary request-action"
                          type="button"
                          onClick={() =>
                            changeStatus(request.id, "Accepted")
                          }
                        >
                          Accept Request
                        </button>

                        <button
                          className="btn-danger request-action"
                          type="button"
                          onClick={() =>
                            changeStatus(request.id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className="request-status-message">
                        Request {status.toLowerCase()}.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            {search
              ? "No matching requests found."
              : "No doubt requests available."}
          </div>
        )}
      </section>
    </div>
  );
}
