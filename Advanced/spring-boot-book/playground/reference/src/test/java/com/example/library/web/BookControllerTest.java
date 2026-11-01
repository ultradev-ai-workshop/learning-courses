package com.example.library.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.example.library.NotFoundException;
import com.example.library.catalog.Book;
import com.example.library.catalog.CatalogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

@WebMvcTest(BookController.class)
class BookControllerTest {
  @Autowired MockMvcTester mvc;
  @MockitoBean CatalogService catalog;

  @Test
  void returnsABook() {
    given(catalog.book("9780441013593")).willReturn(new Book("9780441013593", "Dune", "Frank Herbert", 2));
    assertThat(mvc.get().uri("/api/books/9780441013593")).hasStatusOk().bodyJson().isLenientlyEqualTo("""
        {"isbn":"9780441013593","title":"Dune","author":"Frank Herbert","copies":2,"available":2}""");
  }

  @Test
  void unknownBookIsAProblem() {
    given(catalog.book("1")).willThrow(new NotFoundException("Book", "1"));
    assertThat(mvc.get().uri("/api/books/1")).hasStatus(HttpStatus.NOT_FOUND)
        .bodyJson().extractingPath("$.type").isEqualTo("https://library.example.com/problems/not-found");
  }

  @Test
  void validatesNewBooks() {
    assertThat(mvc.post().uri("/api/books").contentType(MediaType.APPLICATION_JSON)
        .content("""
            {"isbn":"123","title":"","author":"X","copies":0}"""))
        .hasStatus(HttpStatus.BAD_REQUEST)
        .bodyJson().extractingPath("$.errors").asMap().containsOnlyKeys("copies", "isbn", "title");
  }
}
