// Java version of claude_http.py (Chapter 3): java.net.http + Jackson, retries with backoff.
package docspilot.llm;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;

public final class ClaudeHttp {
    private static final URI URL = URI.create("https://api.anthropic.com/v1/messages");
    public static final ObjectMapper JSON = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    private final String apiKey = System.getenv("ANTHROPIC_API_KEY");
    private final int maxRetries;

    public ClaudeHttp(int maxRetries) { this.maxRetries = maxRetries; }

    public JsonNode create(ObjectNode body) throws Exception {
        for (int attempt = 0; ; attempt++) {
            HttpRequest req = HttpRequest.newBuilder(URL)
                .timeout(Duration.ofSeconds(120))
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(JSON.writeValueAsString(body)))
                .build();
            HttpResponse<String> res;
            try {
                res = http.send(req, HttpResponse.BodyHandlers.ofString());
            } catch (java.io.IOException e) {          // connection reset, timeout
                if (attempt >= maxRetries) throw e;
                sleep(backoff(attempt, null)); continue;
            }
            int s = res.statusCode();
            if (s == 200) return JSON.readTree(res.body());
            boolean retryable = s == 408 || s == 409 || s == 429 || s >= 500;  // 529 = overloaded
            if (!retryable || attempt >= maxRetries) {
                throw new ClaudeApiException(s, res.headers().firstValue("request-id").orElse("?"), res.body());
            }
            sleep(backoff(attempt, res.headers().firstValue("retry-after").orElse(null)));
        }
    }

    /** Honor retry-after when present; otherwise exponential backoff with full jitter. */
    static long backoff(int attempt, String retryAfter) {
        if (retryAfter != null) {
            try { return Long.parseLong(retryAfter) * 1000; } catch (NumberFormatException ignored) {}
        }
        long cap = Math.min(30_000, 500L << attempt);
        return ThreadLocalRandom.current().nextLong(cap);
    }

    private static void sleep(long ms) throws InterruptedException { Thread.sleep(ms); }

    public static String text(JsonNode response) {
        StringBuilder sb = new StringBuilder();
        for (JsonNode block : response.path("content"))
            if ("text".equals(block.path("type").asText())) sb.append(block.path("text").asText());
        return sb.toString();
    }

    public static final class ClaudeApiException extends RuntimeException {
        public final int status; public final String requestId;
        ClaudeApiException(int status, String requestId, String body) {
            super("Claude API " + status + " (request-id " + requestId + "): " + body);
            this.status = status; this.requestId = requestId;
        }
    }
}
