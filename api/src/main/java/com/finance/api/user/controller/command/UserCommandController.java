package com.finance.api.user.controller.command;

import com.finance.api.user.command.RegisterUtilisateurCommand;
import com.finance.api.user.command.UserCommandHandler;
import com.finance.api.user.dto.UserRegistrationRequest;
import com.finance.api.user.dto.UserResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/command/utilisateurs")
public class UserCommandController {
    private final UserCommandHandler userCommandHandler;

    public UserCommandController(UserCommandHandler userCommandHandler) {
        this.userCommandHandler = userCommandHandler;
    }

    @PostMapping
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
}
