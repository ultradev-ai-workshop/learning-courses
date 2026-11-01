package com.example.library.web;

import com.example.library.catalog.CatalogService;
import com.example.library.web.Dtos.BookDto;
import com.example.library.web.Dtos.NewBook;
import com.example.library.web.Dtos.PageDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/books")
public class BookController {
  private final CatalogService catalog;
  public BookController(CatalogService catalog) { this.catalog = catalog; }

  @GetMapping
  public PageDto<BookDto> search(@RequestParam(required = false) String q,
                                 @RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "20") int size) {
    var request = PageRequest.of(Math.max(page, 0), Math.clamp(size, 1, 100), Sort.by("title"));
    return PageDto.of(catalog.search(q, request).map(BookDto::of));
  }

  @GetMapping("/{isbn}")
  public BookDto get(@PathVariable String isbn) { return BookDto.of(catalog.book(isbn)); }

  @PostMapping
  public ResponseEntity<BookDto> add(@Valid @RequestBody NewBook req, UriComponentsBuilder uri) {
    var book = catalog.addBook(req.isbn(), req.title(), req.author(), req.copies());
    return ResponseEntity.created(uri.path("/api/books/{isbn}").build(book.getIsbn())).body(BookDto.of(book));
  }
}
