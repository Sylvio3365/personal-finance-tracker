package com.finance.api.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String fullName;
    private String email;
    private LocalDate dtn;
}
