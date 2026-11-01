package com.example.library.loans;

import com.example.library.catalog.Book;
import com.example.library.members.Member;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

@Entity
public class Loan {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  private Book book;
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  private Member member;
  private LocalDate borrowedOn;
  private LocalDate dueOn;
  private LocalDate returnedOn;

  protected Loan() { }

  public Loan(Book book, Member member, LocalDate borrowedOn, LocalDate dueOn) {
    this.book = book; this.member = member; this.borrowedOn = borrowedOn; this.dueOn = dueOn;
  }

  public boolean isOpen() { return returnedOn == null; }
  public boolean isOverdue(LocalDate today) { return isOpen() && dueOn.isBefore(today); }

  public void close(LocalDate today) {
    if (!isOpen()) throw new IllegalStateException("loan " + id + " was already returned");
    returnedOn = today;
    book.giveBack();
  }

  public Long getId() { return id; }
  public Book getBook() { return book; }
  public Member getMember() { return member; }
  public LocalDate getBorrowedOn() { return borrowedOn; }
  public LocalDate getDueOn() { return dueOn; }
  public LocalDate getReturnedOn() { return returnedOn; }
}
