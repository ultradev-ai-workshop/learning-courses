package com.example.library.catalog;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
  Optional<Book> findByIsbn(String isbn);
  boolean existsByIsbn(String isbn);
  Page<Book> findByTitleContainingIgnoreCase(String text, Pageable pageable);
}
