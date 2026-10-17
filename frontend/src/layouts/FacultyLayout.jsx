
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function FacultyLayout() {
  return (
    <div className="teacher-layout">
      <Sidebar />

      <main className="teacher-main">
        <Outlet />
      </main>
    </div>
  );
}
