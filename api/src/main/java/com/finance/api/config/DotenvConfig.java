package com.finance.api.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvException;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class DotenvConfig {

    @PostConstruct
    public void loadEnv() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .filename(".env")
                    .load();

            System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
            System.setProperty("DB_PORT", dotenv.get("DB_PORT"));
            System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
            System.setProperty("DB_USER", dotenv.get("DB_USER"));
            System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
            System.setProperty("DB_SSL_MODE", dotenv.get("DB_SSL_MODE"));

            System.out.println("Environment variables loaded from .env file");
            System.out.println("DB_HOST: " + System.getProperty("DB_HOST"));
        } catch (DotenvException e) {
            System.err.println("Failed to load .env file: " + e.getMessage());
        }
    }
}
