package com.example.library.loans;

import com.example.library.LibraryProperties;
import com.example.library.NotFoundException;
import com.example.library.catalog.Book;
import com.example.library.catalog.BookRepository;
import com.example.library.members.Member;
import com.example.library.members.MemberRepository;
import io.micrometer.core.instrument.MeterRegistry;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class LibraryService {

  private final BookRepository books;
  private final MemberRepository members;
  private final LoanRepository loans;
  private final LoanPolicy policy;
  private final LibraryProperties props;
  private final Clock clock;
  private final MeterRegistry meters;

  public LibraryService(BookRepository books, MemberRepository members, LoanRepository loans,
                        LoanPolicy policy, LibraryProperties props, Clock clock, MeterRegistry meters) {
    this.books = books; this.members = members; this.loans = loans;
    this.policy = policy; this.props = props; this.clock = clock; this.meters = meters;
  }

  @Transactional
  public Loan borrow(Long memberId, String isbn) {
    Member member = members.findById(memberId).orElseThrow(() -> new NotFoundException("Member", memberId));
    Book book = books.findByIsbn(isbn).orElseThrow(() -> new NotFoundException("Book", isbn));
    LocalDate today = LocalDate.now(clock);
    try {
      policy.check((int) loans.countByMemberIdAndReturnedOnIsNull(memberId),
          loans.existsByMemberIdAndReturnedOnIsNullAndDueOnBefore(memberId, today),
          book.isAvailable());
    } catch (LoanPolicy.LoanRefused refused) {
      meters.counter("library.loans", "outcome", refused.code()).increment();
      throw refused;
    }
    book.lend();                                    // dirty checking + @Version write the change at commit
    Loan loan = loans.save(new Loan(book, member, today, today.plusDays(props.loanDays())));
    meters.counter("library.loans", "outcome", "ok").increment();
    return loan;
  }

  @Transactional
  public Loan giveBack(Long loanId) {
    Loan loan = loans.findById(loanId).orElseThrow(() -> new NotFoundException("Loan", loanId));
    loan.close(LocalDate.now(clock));
    return loan;
  }

  public List<Loan> openLoansOf(Long memberId) {
    if (!members.existsById(memberId)) throw new NotFoundException("Member", memberId);
    return loans.openLoansOf(memberId);
  }

  public List<Loan> overdue() {
    return loans.overdue(LocalDate.now(clock));
  }
}
