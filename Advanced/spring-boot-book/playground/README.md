# Spring Boot Study Book — playground

A ready-made Spring Boot 4.1 project (Java 25) for the book's examples and exercises.

```bash
./mvnw spring-boot:run          # start the app on http://localhost:8080 (try /hello and /actuator/health)
./mvnw test                     # run the tests
./mvnw package && java -jar target/playground-0.0.1-SNAPSHOT.jar
```

- Put exercise code under `src/main/java/com/example/playground/` (sub-packages are scanned automatically).
- Examples with their own `main` method can be run from your IDE, or with
  `./mvnw spring-boot:run -Dspring-boot.run.main-class=com.example.playground.ex1.MyApp`.
- `reference/` is the finished **Library Loans API** from Chapter 20 — a separate project:
  `cd reference && ../mvnw test`.

No Maven wrapper yet? Run `mvn -N wrapper:wrapper` once, or use an installed Maven (`mvn …`).
