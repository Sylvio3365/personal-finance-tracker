package com.finance.api.user.controller.query;

import com.finance.api.user.query.GetUtilisateurByIdQuery;
import com.finance.api.user.query.UserQueryHandler;
import com.finance.api.user.dto.UserResponse;
import com.finance.api.user.dto.LoginRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/query/utilisateurs")
public class UserQueryController {
    private final UserQueryHandler userQueryHandler;

    public UserQueryController(UserQueryHandler userQueryHandler) {
        this.userQueryHandler = userQueryHandler;
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return userQueryHandler.login(request);
    }

    @GetMapping("/{utilisateurId}")
    public UserResponse getById(@PathVariable Long utilisateurId) {
        return userQueryHandler.getById(new GetUtilisateurByIdQuery(utilisateurId));
    }
}
