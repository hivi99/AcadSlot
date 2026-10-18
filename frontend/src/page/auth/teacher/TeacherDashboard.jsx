import { Link } from "react-router-dom";
import {
  MessageCircle,
  CalendarClock,
  CalendarCheck,
  ClipboardList,
  Bell,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

import sampleRequests from "../../../data/sampleRequests";
import sampleSessions from "../../../data/sampleSessions";
import NotificationBell from "../../../components/NotificationBell";

export default function TeacherDashboard() {
  const pendingDoubts = sampleRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const upcomingSessions = sampleSessions.length;

  const quickActions = [
    {
      title: "Doubt Requests",
      description: "Review and respond to student doubts.",
      icon: MessageCircle,
      color: "blue",
      path: "/teacher/doubt-requests",
    },
    {
      title: "Manage Availability",
      description: "Set your available days and time slots.",
      icon: CalendarClock,
      color: "green",
      path: "/teacher/availability",
    },
    {
      title: "My Sessions",
      description: "View your scheduled sessions.",
      icon: CalendarCheck,
      color: "orange",
      path: "/teacher/sessions",
    },
    {
      title: "Service Requests",
      description: "Review student service requests.",
      icon: ClipboardList,
      color: "purple",
      path: "/teacher/service-requests",
    },
  ];

  return (
    <div className="teacher-dashboard">
      <header className="teacher-dashboard-header">
        <div>
          <h1>Welcome Back, Teacher!</h1>
          <p>Here's an overview of your teaching activities.</p>
        </div>

        <div className="teacher-dashboard-notification">
          <NotificationBell requests={sampleRequests} />
        </div>
      </header>

      <section className="teacher-dashboard-stats">
        <div className="teacher-stat-card">
          <div className="teacher-stat-icon blue-icon">
            <MessageCircle size={26} />
          </div>
          <div>
            <p>Pending Doubts</p>
            <h2>{pendingDoubts}</h2>
            <span>Requests awaiting review</span>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="teacher-stat-icon green-icon">
            <CalendarCheck size={26} />
          </div>
          <div>
            <p>Upcoming Sessions</p>
            <h2>{upcomingSessions}</h2>
            <span>Sessions in your schedule</span>
          </div>
        </div>
      </section>

      <section className="teacher-dashboard-actions">
        <div className="teacher-section-heading">
          <h2>Quick Actions</h2>
          <p>Choose a section to manage your teaching activities.</p>
        </div>

        <div className="teacher-action-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                to={action.path}
                className="teacher-action-card"
                key={action.title}
              >
                <div className={`teacher-action-icon ${action.color}-icon`}>
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <div className="teacher-action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>

                <ArrowRight
                  size={19}
                  className="teacher-action-arrow"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="teacher-dashboard-tip">
        <div className="teacher-tip-icon">
          <Lightbulb size={25} />
        </div>
        <div>
          <h3>Stay Organized</h3>
          <p>
            Keep your availability updated and review student requests
            regularly to manage your sessions smoothly.
          </p>
        </div>
      </section>
    </div>
  );
}
