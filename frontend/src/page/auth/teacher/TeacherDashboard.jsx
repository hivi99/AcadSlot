import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, CalendarClock, CalendarCheck, Bell, ArrowRight, RefreshCw } from 'lucide-react';
import { teacherApi } from '../../../services/api';

const getId = (item) => item?.id ?? item?.requestId;
const getStatus = (item) => String(item?.status || '').toUpperCase();

export default function TeacherDashboard() {
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setLoading(true); setError('');
    try {
      const results = await Promise.allSettled([teacherApi.requests(), teacherApi.appointments(), teacherApi.notifications()]);
      if (results[0].status === 'fulfilled') setRequests(Array.isArray(results[0].value) ? results[0].value : []);
      else throw results[0].reason;
      if (results[1].status === 'fulfilled') setSessions(Array.isArray(results[1].value) ? results[1].value : []);
      if (results[2].status === 'fulfilled') setNotifications(Array.isArray(results[2].value) ? results[2].value : []);
    } catch (e) { setError(e.message || 'Could not load dashboard data.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadDashboard(); }, []);

  const pending = requests.filter((r) => getStatus(r) === 'PENDING').length;
  const upcoming = sessions.filter((s) => getStatus(s) === 'UPCOMING').length;
  const completed = sessions.filter((s) => getStatus(s) === 'COMPLETED').length;
  const unread = notifications.filter((n) => !(n.read ?? n.isRead)).length;

  const cards = [
    { label: 'Pending Doubts', value: pending, detail: 'Requests waiting for review', icon: MessageCircle, className: 'blue' },
    { label: 'Upcoming Sessions', value: upcoming, detail: 'Confirmed sessions', icon: CalendarClock, className: 'green' },
    { label: 'Completed Sessions', value: completed, detail: 'Sessions completed', icon: CalendarCheck, className: 'gold' },
    { label: 'Unread Notifications', value: unread, detail: 'Updates to review', icon: Bell, className: 'purple' },
  ];

  return <div className="teacher-page">
    <header className="teacher-page-header"><div><p className="eyebrow">TEACHER PORTAL</p><h1>Dashboard</h1><p>Here is an overview of your teaching activities.</p></div><button className="teacher-btn teacher-btn-light" onClick={loadDashboard}><RefreshCw size={16}/> Refresh</button></header>
    {error && <div className="teacher-alert error">{error} Check that the backend is running and you are logged in with a valid JWT.</div>}
    {loading ? <div className="teacher-empty">Loading your dashboard…</div> : <>
      <section className="teacher-stat-grid">{cards.map(({ label, value, detail, icon: Icon, className }) => <article className="teacher-stat" key={label}><div className={`teacher-stat-symbol ${className}`}><Icon size={22}/></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>)}</section>
      <section className="teacher-panel"><div className="teacher-panel-heading"><div><h2>Quick actions</h2><p>Manage your teaching activity.</p></div></div><div className="teacher-quick-grid">
        <Link to="/teacher/requests" className="teacher-quick-card"><MessageCircle/><div><strong>Doubt Requests</strong><span>Review and respond to student requests</span></div><ArrowRight/></Link>
        <Link to="/teacher/availability" className="teacher-quick-card"><CalendarClock/><div><strong>Publish Availability</strong><span>Add a date and time when students can meet you</span></div><ArrowRight/></Link>
        <Link to="/teacher/sessions" className="teacher-quick-card"><CalendarCheck/><div><strong>My Sessions</strong><span>View confirmed appointments</span></div><ArrowRight/></Link>
        <Link to="/teacher/notifications" className="teacher-quick-card"><Bell/><div><strong>Notifications</strong><span>{unread} unread notification{unread === 1 ? '' : 's'}</span></div><ArrowRight/></Link>
      </div></section>
      <section className="teacher-panel"><div className="teacher-panel-heading"><div><h2>Recent doubt requests</h2><p>Latest requests returned by your backend.</p></div><Link to="/teacher/requests" className="teacher-text-link">View all <ArrowRight size={15}/></Link></div>
        {requests.length === 0 ? <div className="teacher-empty compact">No requests yet.</div> : <div className="teacher-table-wrap"><table className="teacher-table"><thead><tr><th>Student</th><th>Reason</th><th>Requested time</th><th>Duration</th><th>Status</th></tr></thead><tbody>{requests.slice(0,5).map((r) => <tr key={getId(r)}><td>{r.student?.name || r.student?.fullName || 'Student'}</td><td>{r.reason || '—'}</td><td>{r.requestedStartTime || '—'}</td><td>{r.requestedDuration ? `${r.requestedDuration} min` : '—'}</td><td><span className={`teacher-status ${getStatus(r).toLowerCase()}`}>{getStatus(r) || 'UNKNOWN'}</span></td></tr>)}</tbody></table></div>}
      </section>
    </>}
  </div>;
}
