package com.example.library.web;

import com.example.library.loans.LibraryService;
import com.example.library.web.Dtos.LoanDto;
import com.example.library.web.Dtos.NewLoan;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
  private final LibraryService library;
  public LoanController(LibraryService library) { this.library = library; }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public LoanDto borrow(@Valid @RequestBody NewLoan req) { return LoanDto.of(library.borrow(req.memberId(), req.isbn())); }

  @PostMapping("/{id}/return")
  public LoanDto giveBack(@PathVariable Long id) { return LoanDto.of(library.giveBack(id)); }

  @GetMapping("/overdue")
  public List<LoanDto> overdue() { return library.overdue().stream().map(LoanDto::of).toList(); }
}
