package com.example.library.loans;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.library.LibraryProperties;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class LoanPolicyTest {
  private final LoanPolicy policy = new LoanPolicy(new LibraryProperties(14, 3));

  @ParameterizedTest(name = "{0} open loans → allowed")
  @CsvSource({ "0", "1", "2" })
  void allowsUpToTheLimit(int open) {
    assertThatCode(() -> policy.check(open, false, true)).doesNotThrowAnyException();
  }

  @ParameterizedTest(name = "open={0}, overdue={1}, available={2} → {3}")
  @CsvSource({
      "3, false, true,  limit",
      "0, true,  true,  overdue",
      "5, true,  false, overdue",
      "0, false, false, unavailable"
  })
  void refuses(int open, boolean overdue, boolean available, String code) {
    assertThatThrownBy(() -> policy.check(open, overdue, available))
        .isInstanceOfSatisfying(LoanPolicy.LoanRefused.class, e -> org.assertj.core.api.Assertions.assertThat(e.code()).isEqualTo(code));
  }
}
