package com.acadslot.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.acadslot.app.dto.ApiResponse;
import com.acadslot.app.dto.SubmitAppointmentRequestDto;
import com.acadslot.app.entity.AppointmentRequest;
import com.acadslot.app.entity.Availability;
import com.acadslot.app.entity.User;
import com.acadslot.app.repository.AvailabilityRepository;
import com.acadslot.app.repository.UserRepository;
import com.acadslot.app.service.RequestAndApprovalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final UserRepository userRepository;
    private final AvailabilityRepository availabilityRepository;
    private final RequestAndApprovalService requestService;

    // GET /api/student/availability
    @GetMapping("/availability")
    public ResponseEntity<ApiResponse<List<Availability>>> getAvailability() {
        List<Availability> availabilities = availabilityRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Availability fetched", availabilities));
    }

    // POST /api/student/requests
    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<AppointmentRequest>> submitRequest(
            @RequestAttribute("userId") Long studentId,
            @Valid @RequestBody SubmitAppointmentRequestDto dto) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        AppointmentRequest request = requestService.submitRequest(
                student,
                dto.getAvailabilityId(),
                dto.getRequestedStartTime(),
                dto.getRequestedDuration(),
                dto.getReason()
        );
        
        return ResponseEntity.ok(ApiResponse.success("Request submitted successfully and is now PENDING", request));
    }
}
