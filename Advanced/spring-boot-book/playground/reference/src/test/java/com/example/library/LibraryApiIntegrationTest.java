package com.example.library;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.library.web.Dtos.LoanDto;
import com.example.library.web.Dtos.MemberDto;
import com.example.library.web.Dtos.NewBook;
import com.example.library.web.Dtos.NewLoan;
import com.example.library.web.Dtos.NewMember;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.client.RestTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
class LibraryApiIntegrationTest {
  @Autowired RestTestClient client;

  @Test
  void fullLoanCycleOverHttp() {
    client.post().uri("/api/books").body(new NewBook("9781111111111", "Integration Testing", "QA Team", 1))
        .exchange()
        .expectStatus().isCreated()
        .expectHeader().value("Location", loc -> assertThat(loc).endsWith("/api/books/9781111111111"));

    MemberDto member = client.post().uri("/api/members").body(new NewMember("Test Reader", "reader@example.com"))
        .exchange().expectStatus().isCreated()
        .expectBody(MemberDto.class).returnResult().getResponseBody();

    LoanDto loan = client.post().uri("/api/loans").body(new NewLoan(member.id(), "9781111111111"))
        .exchange().expectStatus().isCreated()
        .expectBody(LoanDto.class).returnResult().getResponseBody();
    assertThat(loan.title()).isEqualTo("Integration Testing");

    client.post().uri("/api/loans").body(new NewLoan(member.id(), "9781111111111"))       // the only copy is out
        .exchange().expectStatus().isEqualTo(409)
        .expectBody().jsonPath("$.reason").isEqualTo("unavailable");

    client.post().uri("/api/loans/{id}/return", loan.id()).exchange().expectStatus().isOk()
        .expectBody().jsonPath("$.returnedOn").isNotEmpty();

    client.get().uri("/api/books/9781111111111").exchange().expectStatus().isOk()
        .expectBody().jsonPath("$.available").isEqualTo(1);
  }

  @Test
  void seedDataAndPaging() {
    client.get().uri("/api/books?size=2").exchange().expectStatus().isOk()
        .expectBody()
        .jsonPath("$.content.length()").isEqualTo(2)
        .jsonPath("$.content[0].title").isEqualTo("Dune")
        .jsonPath("$.totalElements").value(n -> assertThat(((Number) n).intValue()).isGreaterThanOrEqualTo(3));
  }

  @Test
  void healthIsUp() {
    client.get().uri("/actuator/health").exchange().expectStatus().isOk().expectBody().jsonPath("$.status").isEqualTo("UP");
  }
}
