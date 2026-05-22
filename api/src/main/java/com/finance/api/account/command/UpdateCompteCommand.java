package com.finance.api.account.command;

public record UpdateCompteCommand(
    Long compteId,
    String nom
) {}
