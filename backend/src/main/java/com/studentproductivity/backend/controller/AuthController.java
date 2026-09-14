package com.studentproductivity.backend.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.studentproductivity.backend.dto.AuthResponse;
import com.studentproductivity.backend.dto.LoginRequest;
import com.studentproductivity.backend.entity.User;
import com.studentproductivity.backend.service.AuthService;
import com.studentproductivity.backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            User user = authService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            String token = jwtService.generateToken(user.getEmail());

            AuthResponse response = new AuthResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    token
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }
}