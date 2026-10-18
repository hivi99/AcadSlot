package com.acadslot.app.service;

import com.acadslot.app.entity.Appointment;
import com.acadslot.app.entity.AppointmentRequest;
import com.acadslot.app.entity.Availability;
import com.acadslot.app.entity.User;
import com.acadslot.app.entity.enums.AppointmentStatus;
import com.acadslot.app.entity.enums.NotificationType;
import com.acadslot.app.entity.enums.RequestStatus;
import com.acadslot.app.repository.AppointmentRepository;
import com.acadslot.app.repository.AppointmentRequestRepository;
import com.acadslot.app.repository.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestAndApprovalService {

    private final AppointmentRequestRepository requestRepository;
    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final NotificationService notificationService;

    // ==========================================
    // STUDENT: Submit Request
    // ==========================================
    @Transactional
    public AppointmentRequest submitRequest(User student, Long availabilityId, LocalTime reqStart, Integer duration, String reason) {
        Availability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Availability not found"));

        // RULE 4: Duration must be positive
        if (duration <= 0) throw new RuntimeException("Duration must be greater than 0");

        // RULE 8: Student can only have ONE active request per teacher
        boolean hasActive = requestRepository.existsByStudentAndTeacherAndStatusIn(
                student, availability.getTeacher(), List.of(RequestStatus.PENDING, RequestStatus.ACCEPTED)
        );
        if (hasActive) {
            throw new RuntimeException("You already have an active request or appointment with this teacher.");
        }

        // RULE 5: Request must fit completely inside availability window
        LocalTime reqEnd = reqStart.plusMinutes(duration);
        if (reqStart.isBefore(availability.getStartTime()) || reqEnd.isAfter(availability.getEndTime())) {
            throw new RuntimeException("Requested time does not fit within the teacher's availability window.");
        }

        AppointmentRequest request = new AppointmentRequest();
        request.setStudent(student);
        request.setTeacher(availability.getTeacher());
        request.setAvailability(availability);
        request.setRequestedStartTime(reqStart);
        request.setRequestedDuration(duration);
        request.setReason(reason);
        request.setStatus(RequestStatus.PENDING);

        return requestRepository.save(request);
    }

    // ==========================================
    // TEACHER: Approve Request
    // ==========================================
    @Transactional
    public Appointment approveRequest(Long requestId, User teacher) {
        AppointmentRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is no longer pending.");
        }

        LocalTime newStart = request.getRequestedStartTime();
        LocalTime newEnd = newStart.plusMinutes(request.getRequestedDuration());
        LocalDate date = request.getAvailability().getDate();

        // RULE 6 & 10: Overlap Detection
        List<Appointment> existingAppointments = appointmentRepository
                .findByTeacherIdAndDateAndStatus(teacher.getId(), date, AppointmentStatus.UPCOMING);

        for (Appointment existing : existingAppointments) {
            // Standard Interval Overlap Formula: (StartA < EndB) && (EndA > StartB)
            if (newStart.isBefore(existing.getEndTime()) && newEnd.isAfter(existing.getStartTime())) {
                throw new RuntimeException("Conflict: This request overlaps with an already confirmed appointment.");
            }
        }

        // All checks passed! Update request and create the actual Appointment
        request.setStatus(RequestStatus.ACCEPTED);
        requestRepository.save(request);

        Appointment appointment = new Appointment();
        appointment.setRequest(request);
        appointment.setStudent(request.getStudent());
        appointment.setTeacher(teacher);
        appointment.setDate(date);
        appointment.setStartTime(newStart);
        appointment.setEndTime(newEnd);
        appointment.setDuration(request.getRequestedDuration());
        appointment.setVenue(request.getAvailability().getVenue());
        appointment.setStatus(AppointmentStatus.UPCOMING);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // TRIGGER NOTIFICATION
        notificationService.createNotification(
                request.getStudent(),
                "Appointment Approved",
                "Your appointment request for " + date + " at " + newStart + " has been approved.",
                NotificationType.APPOINTMENT_ACCEPTED
        );

        return savedAppointment;
    }

    // ==========================================
    // TEACHER: Reject Request
    // ==========================================
    @Transactional
    public void rejectRequest(Long requestId, User teacher) {
        AppointmentRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be rejected.");
        }

        request.setStatus(RequestStatus.REJECTED);
        requestRepository.save(request);

        // TRIGGER NOTIFICATION
        notificationService.createNotification(
                request.getStudent(),
                "Request Rejected",
                "Your appointment request on " + request.getAvailability().getDate() + " was rejected.",
                NotificationType.APPOINTMENT_REJECTED
        );
    }

    // ==========================================
    // TEACHER: Cancel Confirmed Appointment (Rule 11 & Section 15)
    // ==========================================
    @Transactional
    public void cancelAppointment(Long appointmentId, String cancelReason, User teacher) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (appointment.getStatus() != AppointmentStatus.UPCOMING) {
            throw new RuntimeException("Only upcoming appointments can be cancelled.");
        }
        if (cancelReason == null || cancelReason.trim().isEmpty()) {
            throw new RuntimeException("Cancellation reason is strictly required."); // Rule 11
        }

        // Section 15 requirement: Both Appointment and underlying Request become CANCELLED
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelReason(cancelReason);
        
        AppointmentRequest request = appointment.getRequest();
        request.setStatus(RequestStatus.CANCELLED);

        appointmentRepository.save(appointment);
        requestRepository.save(request);

        // TRIGGER NOTIFICATION
        notificationService.createNotification(
                appointment.getStudent(),
                "Appointment Cancelled",
                "Your appointment on " + appointment.getDate() + " has been cancelled. Reason: " + cancelReason,
                NotificationType.APPOINTMENT_CANCELLED
        );
    }
}
