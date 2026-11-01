package com.example.library;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("library")
public record LibraryProperties(
    @DefaultValue("14") @Min(1) @Max(60) int loanDays,
    @DefaultValue("3") @Min(1) @Max(20) int maxOpenLoans) {}
