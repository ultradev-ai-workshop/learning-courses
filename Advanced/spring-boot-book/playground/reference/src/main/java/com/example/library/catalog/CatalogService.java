package com.example.library.catalog;

import com.example.library.NotFoundException;
import com.example.library.members.Member;
import com.example.library.members.MemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CatalogService {

  public static class AlreadyExists extends RuntimeException {
    public AlreadyExists(String message) { super(message); }
  }

  private final BookRepository books;
  private final MemberRepository members;

  public CatalogService(BookRepository books, MemberRepository members) { this.books = books; this.members = members; }

  @Transactional
  public Book addBook(String isbn, String title, String author, int copies) {
    if (books.existsByIsbn(isbn)) throw new AlreadyExists("A book with ISBN " + isbn + " already exists");
    return books.save(new Book(isbn, title, author, copies));
  }

  @Transactional
  public Member register(String name, String email) {
    if (members.existsByEmail(email)) throw new AlreadyExists("A member with email " + email + " already exists");
    return members.save(new Member(name, email));
  }

  public Book book(String isbn) { return books.findByIsbn(isbn).orElseThrow(() -> new NotFoundException("Book", isbn)); }

  public Page<Book> search(String q, Pageable pageable) {
    return q == null || q.isBlank() ? books.findAll(pageable) : books.findByTitleContainingIgnoreCase(q, pageable);
  }
}
