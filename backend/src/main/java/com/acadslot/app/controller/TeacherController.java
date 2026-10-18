package com.acadslot.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.acadslot.app.dto.ApiResponse;
import com.acadslot.app.dto.CancelDto;
import com.acadslot.app.dto.CreateAvailabilityRequest;
import com.acadslot.app.entity.Appointment;
import com.acadslot.app.entity.AppointmentRequest;
import com.acadslot.app.entity.Availability;
import com.acadslot.app.entity.User;
import com.acadslot.app.repository.AppointmentRepository;
import com.acadslot.app.repository.AppointmentRequestRepository;
import com.acadslot.app.repository.AvailabilityRepository;
import com.acadslot.app.repository.UserRepository;
import com.acadslot.app.service.RequestAndApprovalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final UserRepository userRepository;
    private final AvailabilityRepository availabilityRepository;
    private final RequestAndApprovalService approvalService;
    private final AppointmentRequestRepository requestRepository;
    private final AppointmentRepository appointmentRepository;

    // POST /api/teacher/availability
    @PostMapping("/availability")
    public ResponseEntity<ApiResponse<Availability>> createAvailability(
            @RequestAttribute("userId") Long teacherId,
            @Valid @RequestBody CreateAvailabilityRequest dto) {
        
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new RuntimeException("Start time must be before end time"); // Rule 3
        }

        Availability availability = new Availability();
        availability.setTeacher(teacher);
        availability.setDate(dto.getDate());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());
        availability.setVenue(dto.getVenue());
        availability.setSubject(dto.getSubject());
        availability.setDescription(dto.getDescription());

        Availability saved = availabilityRepository.save(availability);
        return ResponseEntity.ok(ApiResponse.success("Availability created successfully", saved));
    }

    // PATCH /api/teacher/requests/{id}/approve
    @PatchMapping("/requests/{id}/approve")
    public ResponseEntity<ApiResponse<Appointment>> approveRequest(
            @RequestAttribute("userId") Long teacherId,
            @PathVariable("id") Long requestId) {

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Appointment confirmedAppointment = approvalService.approveRequest(requestId, teacher);
        
        return ResponseEntity.ok(ApiResponse.success("Request approved and appointment confirmed", confirmedAppointment));
    }

    // PATCH /api/teacher/requests/{id}/reject
    @PatchMapping("/requests/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectRequest(
            @RequestAttribute("userId") Long teacherId,
            @PathVariable("id") Long requestId) {

        User teacher = userRepository.findById(teacherId).orElseThrow();
        approvalService.rejectRequest(requestId, teacher);
        
        return ResponseEntity.ok(ApiResponse.success("Request rejected successfully", null));
    }

    // PATCH /api/teacher/appointments/{id}/cancel
    @PatchMapping("/appointments/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @RequestAttribute("userId") Long teacherId,
            @PathVariable("id") Long appointmentId,
            @Valid @RequestBody CancelDto cancelDto) {

        User teacher = userRepository.findById(teacherId).orElseThrow();
        approvalService.cancelAppointment(appointmentId, cancelDto.getReason(), teacher);
        
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", null));
    }

    // GET /api/teacher/requests
    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<AppointmentRequest>>> getMyRequests(
            @RequestAttribute("userId") Long teacherId) {
        List<AppointmentRequest> requests = requestRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId);
        return ResponseEntity.ok(ApiResponse.success("Requests fetched", requests));
    }

    // GET /api/teacher/appointments
    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getMyAppointments(
            @RequestAttribute("userId") Long teacherId) {
        List<Appointment> appointments = appointmentRepository.findByTeacherIdOrderByDateDesc(teacherId);
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched", appointments));
    }
}
