package com.finance.api.user.controller.command;

import com.finance.api.user.command.RegisterUtilisateurCommand;
import com.finance.api.user.command.UpdatePasswordCommand;
import com.finance.api.user.command.UpdateProfileCommand;
import com.finance.api.user.command.UserCommandHandler;
import com.finance.api.user.dto.PasswordUpdateRequest;
import com.finance.api.user.dto.UserRegistrationRequest;
import com.finance.api.user.dto.UserResponse;
import com.finance.api.user.dto.UserUpdateRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/command/users")
public class UserCommandController {
    private final UserCommandHandler userCommandHandler;

    public UserCommandController(UserCommandHandler userCommandHandler) {
        this.userCommandHandler = userCommandHandler;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody UserRegistrationRequest request) {
        RegisterUtilisateurCommand command = new RegisterUtilisateurCommand(
                request.getNom(),
                request.getPrenom(),
                request.getEmail(),
                request.getDtn(),
                request.getMotDePasse()
        );
        return userCommandHandler.register(command);
    }

    @PutMapping("/{userId}")
    public UserResponse updateProfile(
            @PathVariable Long userId,
            @RequestBody UserUpdateRequest request
    ) {
        UpdateProfileCommand command = new UpdateProfileCommand(
                userId,
                request.getNom(),
                request.getPrenom(),
                request.getEmail(),
                request.getDateNaissance()
        );
        return userCommandHandler.updateProfile(command);
    }

    @PutMapping("/{userId}/password")
    public void updatePassword(
            @PathVariable Long userId,
            @RequestBody PasswordUpdateRequest request
    ) {
        UpdatePasswordCommand command = new UpdatePasswordCommand(
                userId,
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        userCommandHandler.updatePassword(command);
    }
}
