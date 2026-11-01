package com.example.library.loans;

import com.example.library.LibraryProperties;
import org.springframework.stereotype.Component;

/** The lending rules, kept free of persistence so they are trivial to unit test. */
@Component
public class LoanPolicy {

  public static class LoanRefused extends RuntimeException {
    private final String code;
    public LoanRefused(String code, String message) { super(message); this.code = code; }
    public String code() { return code; }
  }

  private final LibraryProperties props;

  public LoanPolicy(LibraryProperties props) { this.props = props; }

  public void check(int openLoans, boolean hasOverdue, boolean bookAvailable) {
    if (hasOverdue) throw new LoanRefused("overdue", "Return your overdue books first");
    if (openLoans >= props.maxOpenLoans())
      throw new LoanRefused("limit", "You already have " + openLoans + " books (limit " + props.maxOpenLoans() + ")");
    if (!bookAvailable) throw new LoanRefused("unavailable", "No copy is available right now");
  }
}
