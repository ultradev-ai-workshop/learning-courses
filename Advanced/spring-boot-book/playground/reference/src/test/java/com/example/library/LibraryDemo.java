package com.example.library;

import org.springframework.boot.SpringApplication;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

/** Starts the API on a free port, walks through a loan as a client would, and stops. */
public class LibraryDemo {
  public static void main(String[] args) {
    try (var ctx = SpringApplication.run(LibraryApplication.class, "--server.port=0")) {
      var http = RestClient.builder()
          .baseUrl("http://localhost:" + ctx.getEnvironment().getProperty("local.server.port"))
          .defaultHeader("Content-Type", "application/json")
          .defaultStatusHandler(status -> true, (req, res) -> { })      // print errors instead of throwing
          .build();

      JsonNode page = http.get().uri("/api/books?size=2").retrieve().body(JsonNode.class);
      System.out.println("catalog: " + page.get("totalElements") + " books, first page " + page.get("content").findValuesAsString("title"));

      JsonNode loan = http.post().uri("/api/loans").body("{\"memberId\":1,\"isbn\":\"9780141439518\"}").retrieve().body(JsonNode.class);
      System.out.println("ada borrowed: " + loan.get("title").asString() + ", due in 14 days: " + !loan.get("dueOn").isNull());

      var refused = http.post().uri("/api/loans").body("{\"memberId\":2,\"isbn\":\"9780141439518\"}").retrieve().toEntity(JsonNode.class);
      System.out.println("grace: " + refused.getStatusCode().value() + " " + refused.getBody().get("title").asString()
          + " (" + refused.getBody().get("reason").asString() + ")");

      var invalid = http.post().uri("/api/books").body("{\"isbn\":\"12\",\"title\":\"\",\"author\":\"X\",\"copies\":1}").retrieve().toEntity(JsonNode.class);
      System.out.println("invalid book: " + invalid.getStatusCode().value() + " " + invalid.getBody().get("errors").propertyNames());

      http.post().uri("/api/loans/{id}/return", loan.get("id").asLong()).retrieve().toBodilessEntity();
      System.out.println("after return, ada has " + http.get().uri("/api/members/1/loans").retrieve().body(JsonNode.class).size() + " open loans");

      JsonNode metric = http.get().uri("/actuator/metrics/library.loans").retrieve().body(JsonNode.class);
      System.out.println("loan attempts recorded: " + metric.get("measurements").get(0).get("value").asInt());
    }
  }
}
