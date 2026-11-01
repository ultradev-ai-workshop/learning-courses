package com.example.library.web;

import com.example.library.NotFoundException;
import com.example.library.catalog.CatalogService.AlreadyExists;
import com.example.library.loans.LoanPolicy.LoanRefused;
import java.net.URI;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Maps domain exceptions to RFC 9457 problem responses, in one place. */
@RestControllerAdvice
public class ApiErrors extends ResponseEntityExceptionHandler {
  private static final String TYPES = "https://library.example.com/problems/";

  @ExceptionHandler
  ProblemDetail notFound(NotFoundException e) {
    return problem(HttpStatus.NOT_FOUND, "not-found", "Not found", e.getMessage());
  }

  @ExceptionHandler
  ProblemDetail duplicate(AlreadyExists e) {
    return problem(HttpStatus.CONFLICT, "duplicate", "Already exists", e.getMessage());
  }

  @ExceptionHandler
  ProblemDetail refused(LoanRefused e) {
    var pd = problem(HttpStatus.CONFLICT, "loan-refused", "Loan refused", e.getMessage());
    pd.setProperty("reason", e.code());
    return pd;
  }

  @ExceptionHandler
  ProblemDetail stateConflict(IllegalStateException e) {
    return problem(HttpStatus.CONFLICT, "invalid-state", "Invalid state", e.getMessage());
  }

  @ExceptionHandler
  ProblemDetail concurrent(ObjectOptimisticLockingFailureException e) {
    return problem(HttpStatus.CONFLICT, "concurrent-update", "Concurrent update", "Someone else changed this at the same time; please retry");
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers,
                                                                HttpStatusCode status, WebRequest request) {
    Map<String, String> errors = new TreeMap<>();
    ex.getFieldErrors().forEach(fe -> errors.put(fe.getField(), fe.getDefaultMessage()));
    var pd = problem(HttpStatus.BAD_REQUEST, "validation", "Invalid request", "The request has " + errors.size() + " invalid field(s)");
    pd.setProperty("errors", errors);
    return ResponseEntity.badRequest().body(pd);
  }

  private static ProblemDetail problem(HttpStatus status, String type, String title, String detail) {
    var pd = ProblemDetail.forStatusAndDetail(status, detail);
    pd.setType(URI.create(TYPES + type));
    pd.setTitle(title);
    return pd;
  }
}
