package com.example.library.loans;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.library.catalog.BookRepository;
import com.example.library.catalog.CatalogService;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional                                   // each test rolls back: the seed data stays as in V2__seed.sql
class LibraryServiceTest {

  static final Instant NOW = Instant.parse("2026-03-02T10:00:00Z");
  static final MutableClock CLOCK = new MutableClock(NOW);

  @TestConfiguration
  static class FixedClock {
    @Bean @Primary Clock testClock() { return CLOCK; }
  }

  @Autowired LibraryService library;
  @Autowired CatalogService catalog;
  @Autowired BookRepository books;

  @Test
  void borrowingTakesACopyAndSetsTheDueDate() {
    CLOCK.set(NOW);
    Loan loan = library.borrow(1L, "9780441013593");
    assertThat(loan.getDueOn()).isEqualTo(LocalDate.of(2026, 3, 16));
    assertThat(books.findByIsbn("9780441013593").orElseThrow().getAvailable()).isEqualTo(1);
  }

  @Test
  void theLastCopyCannotBeLentTwice() {
    CLOCK.set(NOW);
    library.borrow(1L, "9780141439518");                                  // only one copy
    assertThatThrownBy(() -> library.borrow(2L, "9780141439518"))
        .isInstanceOfSatisfying(LoanPolicy.LoanRefused.class, e -> assertThat(e.code()).isEqualTo("unavailable"));
  }

  @Test
  void overdueLoansBlockNewLoansUntilReturned() {
    CLOCK.set(NOW);
    Loan loan = library.borrow(1L, "9780441478125");
    CLOCK.set(NOW.plusSeconds(20 * 86400));                                // 20 days later
    assertThat(library.overdue()).extracting(Loan::getId).containsExactly(loan.getId());
    assertThatThrownBy(() -> library.borrow(1L, "9780441013593"))
        .isInstanceOfSatisfying(LoanPolicy.LoanRefused.class, e -> assertThat(e.code()).isEqualTo("overdue"));

    library.giveBack(loan.getId());
    assertThat(library.overdue()).isEmpty();
    assertThat(library.borrow(1L, "9780441013593").getId()).isNotNull();
  }

  @Test
  void limitOfThreeOpenLoans() {
    CLOCK.set(NOW);
    catalog.addBook("9780000000001", "Extra", "Anon", 5);
    library.borrow(2L, "9780441013593");
    library.borrow(2L, "9780441478125");
    library.borrow(2L, "9780000000001");
    assertThatThrownBy(() -> library.borrow(2L, "9780000000001"))
        .isInstanceOfSatisfying(LoanPolicy.LoanRefused.class, e -> assertThat(e.code()).isEqualTo("limit"));
  }

  /** A Clock the test can move forward. */
  static final class MutableClock extends Clock {
    private volatile Instant instant;
    MutableClock(Instant instant) { this.instant = instant; }
    void set(Instant instant) { this.instant = instant; }
    @Override public ZoneOffset getZone() { return ZoneOffset.UTC; }
    @Override public Clock withZone(java.time.ZoneId zone) { return this; }
    @Override public Instant instant() { return instant; }
  }
}
