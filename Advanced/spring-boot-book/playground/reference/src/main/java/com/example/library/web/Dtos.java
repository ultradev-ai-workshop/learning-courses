package com.example.library.web;

import com.example.library.catalog.Book;
import com.example.library.loans.Loan;
import com.example.library.members.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;

/** Request and response records: the API's contract, separate from the JPA entities. */
public final class Dtos {
  private Dtos() { }

  public record NewBook(@NotBlank @Pattern(regexp = "\\d{13}", message = "must be 13 digits") String isbn,
                        @NotBlank @Size(max = 200) String title,
                        @NotBlank @Size(max = 100) String author,
                        @Positive @Max(1000) int copies) {}

  public record BookDto(String isbn, String title, String author, int copies, int available) {
    public static BookDto of(Book b) { return new BookDto(b.getIsbn(), b.getTitle(), b.getAuthor(), b.getCopies(), b.getAvailable()); }
  }

  public record NewMember(@NotBlank @Size(max = 100) String name, @NotBlank @Email String email) {}

  public record MemberDto(Long id, String name, String email) {
    public static MemberDto of(Member m) { return new MemberDto(m.getId(), m.getName(), m.getEmail()); }
  }

  public record NewLoan(@NotNull Long memberId, @NotBlank String isbn) {}

  public record LoanDto(Long id, Long memberId, String isbn, String title, LocalDate dueOn, LocalDate returnedOn) {
    public static LoanDto of(Loan l) {
      return new LoanDto(l.getId(), l.getMember().getId(), l.getBook().getIsbn(), l.getBook().getTitle(), l.getDueOn(), l.getReturnedOn());
    }
  }

  public record PageDto<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
    public static <T> PageDto<T> of(Page<T> p) {
      return new PageDto<>(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
    }
  }
}
