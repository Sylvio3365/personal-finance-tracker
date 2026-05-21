package com.finance.api.user.controller.query;

import com.finance.api.user.query.GetUtilisateurByIdQuery;
import com.finance.api.user.query.UserQueryHandler;
import com.finance.api.user.dto.UserResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/query/utilisateurs")
public class UserQueryController {
    private final UserQueryHandler userQueryHandler;

    public UserQueryController(UserQueryHandler userQueryHandler) {
        this.userQueryHandler = userQueryHandler;
    }

    @GetMapping("/{utilisateurId}")
    public UserResponse getById(@PathVariable Long utilisateurId) {
        return userQueryHandler.getById(new GetUtilisateurByIdQuery(utilisateurId));
    }
}
