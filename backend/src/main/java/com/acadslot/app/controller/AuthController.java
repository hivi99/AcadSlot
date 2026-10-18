package com.acadslot.app.controller;

import com.acadslot.app.dto.ApiResponse;
import com.acadslot.app.dto.AuthResponseDto;
import com.acadslot.app.entity.User;
import com.acadslot.app.repository.UserRepository;
import com.acadslot.app.security.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@RequestBody LoginRequest request) {
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password hash
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT
        String token = jwtUtil.generateToken(user);
        AuthResponseDto responseData = new AuthResponseDto(token, user.getRole(), user.getName());

        return ResponseEntity.ok(ApiResponse.success("Login successful", responseData));
    }
}

@Data
class LoginRequest {
    private String email;
    private String password;
}
