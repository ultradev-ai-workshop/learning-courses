package com.example.library.web;

import com.example.library.catalog.CatalogService;
import com.example.library.loans.LibraryService;
import com.example.library.web.Dtos.LoanDto;
import com.example.library.web.Dtos.MemberDto;
import com.example.library.web.Dtos.NewMember;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/members")
public class MemberController {
  private final CatalogService catalog;
  private final LibraryService library;
  public MemberController(CatalogService catalog, LibraryService library) { this.catalog = catalog; this.library = library; }

  @PostMapping
  public ResponseEntity<MemberDto> register(@Valid @RequestBody NewMember req, UriComponentsBuilder uri) {
    var member = catalog.register(req.name(), req.email());
    return ResponseEntity.created(uri.path("/api/members/{id}").build(member.getId())).body(MemberDto.of(member));
  }

  @GetMapping("/{id}/loans")
  public List<LoanDto> loans(@PathVariable Long id) {
    return library.openLoansOf(id).stream().map(LoanDto::of).toList();
  }
}
