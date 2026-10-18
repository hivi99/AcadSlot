
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FacultyLayout from "./layouts/FacultyLayout";

import TeacherDashboard from "./page/auth/teacher/TeacherDashboard";
import DoubtRequest from "./page/auth/teacher/DoubtRequest";
import FacultyAvailability from "./page/auth/teacher/FacultyAvailability";
import FacultySession from "./page/auth/teacher/FacultySession";
import TeacherNotif from "./page/auth/teacher/TeacherNotif";
import TeacherServiceRequest from "./page/auth/teacher/TeacherServiceRequest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
<Route path="/teacher" element={<FacultyLayout />}>
  <Route index element={<TeacherDashboard />} />
  <Route path="requests" element={<DoubtRequest />} />
  <Route path="availability" element={<FacultyAvailability />} />
  <Route path="sessions" element={<FacultySession />} />
  <Route path="notifications" element={<TeacherNotif />} />
  <Route path="services" element={<TeacherServiceRequest />} />
</Route>


        <Route path="/" element={<Navigate to="/teacher" replace />} />
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
