package com.example.library.loans;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LoanRepository extends JpaRepository<Loan, Long> {

  long countByMemberIdAndReturnedOnIsNull(Long memberId);

  boolean existsByMemberIdAndReturnedOnIsNullAndDueOnBefore(Long memberId, LocalDate today);

  @Query("SELECT l FROM Loan l JOIN FETCH l.book WHERE l.member.id = :memberId AND l.returnedOn IS NULL ORDER BY l.dueOn")
  List<Loan> openLoansOf(Long memberId);

  @Query("SELECT l FROM Loan l JOIN FETCH l.book JOIN FETCH l.member WHERE l.returnedOn IS NULL AND l.dueOn < :today ORDER BY l.dueOn")
  List<Loan> overdue(LocalDate today);
}
