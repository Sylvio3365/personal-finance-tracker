package com.finance.api.user.command;

public record UpdatePasswordCommand(
    Long utilisateurId,
    String currentPassword,
    String newPassword
) {
}
