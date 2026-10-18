import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, CalendarClock, CalendarCheck, Bell } from 'lucide-react';

export default function Sidebar() {
  return <aside className="sidebar">
    <div className="sidebar-logo"><img src="/logo.png" alt="AcadSlot Logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} /><h2>AcadSlot</h2></div>
    <div className="sidebar-heading">TEACHER PORTAL</div>
    <nav className="sidebar-nav">
      <NavLink to="/teacher" end><LayoutDashboard size={17}/> Dashboard</NavLink>
      <NavLink to="/teacher/requests"><MessageCircle size={17}/> Doubt Requests</NavLink>
      <NavLink to="/teacher/availability"><CalendarClock size={17}/> Availability</NavLink>
      <NavLink to="/teacher/sessions"><CalendarCheck size={17}/> My Sessions</NavLink>
      <NavLink to="/teacher/notifications"><Bell size={17}/> Notifications</NavLink>
    </nav>
    <div className="sidebar-profile"><p>Teacher Account</p><small>Teacher Portal</small></div>
  </aside>;
}
