package com.acadslot.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.acadslot.app.dto.ApiResponse;
import com.acadslot.app.dto.SystemStatsDto;
import com.acadslot.app.entity.User;
import com.acadslot.app.entity.enums.AppointmentStatus;
import com.acadslot.app.entity.enums.RequestStatus;
import com.acadslot.app.entity.enums.Role;
import com.acadslot.app.repository.AppointmentRepository;
import com.acadslot.app.repository.AppointmentRequestRepository;
import com.acadslot.app.repository.AvailabilityRepository;
import com.acadslot.app.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentRequestRepository requestRepository;
    private final AvailabilityRepository availabilityRepository;

    // GET /api/admin/dashboard (Stats)
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<SystemStatsDto>> getSystemStats() {
        SystemStatsDto stats = new SystemStatsDto();
        
        // Count users using Java streams on our custom queries
        stats.setTotalStudents(userRepository.findByRole(Role.STUDENT).size());
        stats.setTotalTeachers(userRepository.findByRole(Role.TEACHER).size());
        
        // Count total DB rows for system monitoring
        stats.setTotalPendingRequests(
            requestRepository.findAll().stream().filter(r -> r.getStatus() == RequestStatus.PENDING).count()
        );
        stats.setTotalUpcomingAppointments(
            appointmentRepository.findAll().stream().filter(a -> a.getStatus() == AppointmentStatus.UPCOMING).count()
        );

        return ResponseEntity.ok(ApiResponse.success("System stats retrieved", stats));
    }

    // GET /api/admin/students
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<User>>> getStudents() {
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", userRepository.findByRole(Role.STUDENT)));
    }

    // GET /api/admin/teachers
    @GetMapping("/teachers")
    public ResponseEntity<ApiResponse<List<User>>> getTeachers() {
        return ResponseEntity.ok(ApiResponse.success("Teachers retrieved", userRepository.findByRole(Role.TEACHER)));
    }

    // PATCH /api/admin/users/{id}/status (Enable/Disable User)
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable("id") Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Flip the boolean
        user.setActive(!user.isActive());
        userRepository.save(user);
        
        String state = user.isActive() ? "enabled" : "disabled";
        return ResponseEntity.ok(ApiResponse.success("User successfully " + state, null));
    }
}
