package com.example.playground;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class PlaygroundApplication {
  public static void main(String[] args) {
    SpringApplication.run(PlaygroundApplication.class, args);
  }

  @Bean
  CommandLineRunner hello() {
    return args -> System.out.println("Playground ready on Spring Boot " + SpringBootVersion.getVersion());
  }

  @RestController
  static class HelloController {
    @GetMapping("/hello") String hello() { return "Hello from the playground!"; }
  }
}
