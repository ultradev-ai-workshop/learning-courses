package com.example.library.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Version;

@Entity
public class Book {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true, length = 13)
  private String isbn;
  @Column(nullable = false)
  private String title;
  @Column(nullable = false)
  private String author;
  private int copies;
  private int available;
  @Version
  private long version;                            // optimistic locking: two loans of the last copy can't both win

  protected Book() { }

  public Book(String isbn, String title, String author, int copies) {
    this.isbn = isbn; this.title = title; this.author = author; this.copies = copies; this.available = copies;
  }

  public boolean isAvailable() { return available > 0; }

  public void lend() {
    if (available == 0) throw new IllegalStateException("no copy of " + isbn + " available");
    available--;
  }

  public void giveBack() {
    if (available == copies) throw new IllegalStateException("all copies of " + isbn + " are already on the shelf");
    available++;
  }

  public Long getId() { return id; }
  public String getIsbn() { return isbn; }
  public String getTitle() { return title; }
  public String getAuthor() { return author; }
  public int getCopies() { return copies; }
  public int getAvailable() { return available; }
}
