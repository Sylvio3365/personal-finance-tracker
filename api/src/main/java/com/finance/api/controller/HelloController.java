package com.finance.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Welcome to the Personal Finance Tracker API!";
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello World!";
    }
}
