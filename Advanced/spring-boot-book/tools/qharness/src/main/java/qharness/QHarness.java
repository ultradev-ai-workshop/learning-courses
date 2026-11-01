package qharness;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.context.properties.source.ConfigurationPropertySources;
import org.springframework.boot.convert.ApplicationConversionService;
import org.springframework.boot.convert.DurationStyle;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.AnnotationAwareOrderComparator;
import org.springframework.core.env.Profiles;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.env.SystemEnvironmentPropertySource;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.http.server.PathContainer;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.transaction.interceptor.NoRollbackRuleAttribute;
import org.springframework.transaction.interceptor.RollbackRuleAttribute;
import org.springframework.transaction.interceptor.RuleBasedTransactionAttribute;
import org.springframework.util.backoff.ExponentialBackOff;
import org.springframework.util.unit.DataSize;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.json.JsonMapper;

/** Reads a JSON array of tasks (file arg), prints a JSON array of string results (or "ERROR: Type"). */
public class QHarness {
  static final JsonMapper JSON = JsonMapper.builder().build();
  static final Validator VALIDATOR = Validation.buildDefaultValidatorFactory().getValidator();
  static final SpelExpressionParser SPEL = new SpelExpressionParser();
  static final PathPatternParser PATHS = PathPatternParser.defaultInstance;

  public static void main(String[] args) throws Exception {
    JsonNode tasks = JSON.readTree(Files.readString(Path.of(args[0])));
    List<String> out = new ArrayList<>();
    for (JsonNode t : tasks) {
      try { out.add(eval(t)); }
      catch (Exception e) { out.add("ERROR: " + rootName(e)); }
    }
    System.out.println(JSON.writeValueAsString(out));
  }

  static String rootName(Throwable e) { while (e.getCause() != null && e.getCause() != e) e = e.getCause(); return e.getClass().getSimpleName(); }
  static String s(JsonNode t, String f) { return t.get(f).asString(); }

  static String eval(JsonNode t) throws Exception {
    switch (s(t, "kind")) {
      case "spel": {
        Object root = JSON.convertValue(t.get("root"), Object.class);
        var ctx = new StandardEvaluationContext(root);
        ctx.addPropertyAccessor(new org.springframework.context.expression.MapAccessor());   // map keys as properties, like @Value
        Object v = SPEL.parseExpression(s(t, "expr")).getValue(ctx);
        return String.valueOf(v);
      }
      case "cron": return String.valueOf(CronExpression.parse(s(t, "expr")).next(LocalDateTime.parse(s(t, "from"))));
      case "cronValid": return String.valueOf(CronExpression.isValidExpression(s(t, "expr")));
      case "pathMatch": return String.valueOf(PATHS.parse(s(t, "pattern")).matches(PathContainer.parsePath(s(t, "path"))));
      case "pathVar": {
        var info = PATHS.parse(s(t, "pattern")).matchAndExtract(PathContainer.parsePath(s(t, "path")));
        return info == null ? "no match" : String.valueOf(info.getUriVariables().get(s(t, "var")));
      }
      case "pathWinner": {
        var path = PathContainer.parsePath(s(t, "path"));
        List<PathPattern> matching = new ArrayList<>();
        for (JsonNode p : t.get("patterns")) { var pp = PATHS.parse(p.asString()); if (pp.matches(path)) matching.add(pp); }
        if (matching.isEmpty()) return "none";
        matching.sort(PathPattern.SPECIFICITY_COMPARATOR);
        return matching.getFirst().getPatternString();
      }
      case "duration": return String.valueOf(DurationStyle.detectAndParse(s(t, "value")).toMillis());
      case "datasize": return String.valueOf(DataSize.parse(s(t, "value")).toBytes());
      case "envBind": {                          // does env var NAME=VALUE bind to property PROP?
        var env = new StandardEnvironment();
        env.getPropertySources().replace("systemEnvironment",
            new SystemEnvironmentPropertySource("systemEnvironment", Map.of(s(t, "env"), "42")));
        ConfigurationPropertySources.attach(env);
        return String.valueOf(Binder.get(env).bind(s(t, "prop"), String.class).isBound());
      }
      case "profiles": {
        Set<String> active = new HashSet<>();
        t.get("active").forEach(a -> active.add(a.asString()));
        return String.valueOf(Profiles.of(s(t, "expr")).matches(active::contains));
      }
      case "validate": {
        Object bean = switch (s(t, "constraint")) {
          case "NotBlank" -> new VNotBlank(str(t));
          case "NotEmpty" -> new VNotEmpty(str(t));
          case "NotNull" -> new VNotNull(str(t));
          case "Size2to5" -> new VSize(str(t));
          case "Email" -> new VEmail(str(t));
          case "Pattern5digits" -> new VPattern(str(t));
          case "Min18" -> new VMin(num(t));
          case "Positive" -> new VPositive(num(t));
          case "PositiveOrZero" -> new VPositiveOrZero(num(t));
          default -> throw new IllegalArgumentException(s(t, "constraint"));
        };
        return String.valueOf(VALIDATOR.validate(bean).isEmpty());
      }
      case "rollback": {
        var attr = new RuleBasedTransactionAttribute();
        List<RollbackRuleAttribute> rules = new ArrayList<>();
        for (JsonNode r : t.get("rollbackFor")) rules.add(new RollbackRuleAttribute(Class.forName(r.asString())));
        for (JsonNode r : t.get("noRollbackFor")) rules.add(new NoRollbackRuleAttribute(Class.forName(r.asString())));
        attr.setRollbackRules(rules);
        Throwable ex = (Throwable) Class.forName(s(t, "ex")).getDeclaredConstructor().newInstance();
        return String.valueOf(attr.rollbackOn(ex));
      }
      case "naming": {
        var strategy = switch (s(t, "strategy")) {
          case "SNAKE_CASE" -> new PropertyNamingStrategies.SnakeCaseStrategy();
          case "KEBAB_CASE" -> new PropertyNamingStrategies.KebabCaseStrategy();
          case "UPPER_CAMEL_CASE" -> new PropertyNamingStrategies.UpperCamelCaseStrategy();
          case "LOWER_DOT_CASE" -> new PropertyNamingStrategies.LowerDotCaseStrategy();
          default -> throw new IllegalArgumentException();
        };
        return strategy.nameForField(null, null, s(t, "name"));
      }
      case "convert": {
        var target = switch (s(t, "type")) {
          case "Integer" -> Integer.class; case "Boolean" -> Boolean.class; case "Long" -> Long.class;
          case "Double" -> Double.class; case "LocalDate" -> java.time.LocalDate.class; case "List" -> List.class;
          case "Duration" -> java.time.Duration.class; case "Character" -> Character.class;
          default -> throw new IllegalArgumentException();
        };
        Object v = ApplicationConversionService.getSharedInstance().convert(s(t, "value"), target);
        if (v instanceof java.time.Duration d) return String.valueOf(d.toMillis());
        return String.valueOf(v);
      }
      case "order": {
        List<Object> beans = new ArrayList<>();
        for (JsonNode b : t.get("beans")) {
          String name = b.get("name").asString();
          beans.add(b.has("order") && !b.get("order").isNull() ? new Named(name, b.get("order").asInt()) : new Unordered(name));
        }
        beans.sort(AnnotationAwareOrderComparator.INSTANCE);
        return String.join(",", beans.stream().map(Object::toString).toList());
      }
      case "backoff": {
        var b = new ExponentialBackOff(t.get("initial").asLong(), t.get("multiplier").asDouble());
        b.setMaxInterval(t.get("max").asLong());
        var exec = b.start();
        List<String> vals = new ArrayList<>();
        for (int i = 0; i < t.get("n").asInt(); i++) vals.add(String.valueOf(exec.nextBackOff()));
        return String.join(",", vals);
      }
      case "reactor": {                          // Flux.range(1, n) followed by a list of simple operators
        reactor.core.publisher.Flux<Integer> f = reactor.core.publisher.Flux.range(1, t.get("n").asInt());
        for (JsonNode op : t.get("ops")) {
          String[] p = op.asString().split(" ");
          int k = p.length > 1 ? Integer.parseInt(p[1]) : 0;
          f = switch (p[0]) {
            case "map*" -> f.map(x -> x * k);
            case "map+" -> f.map(x -> x + k);
            case "filterMod" -> f.filter(x -> x % k == 0);
            case "take" -> f.take(k);
            case "skip" -> f.skip(k);
            case "takeLast" -> f.takeLast(k);
            case "distinctMod" -> f.distinct(x -> x % k);
            case "reduceSum" -> f.reduce(0, Integer::sum).flux();
            case "count" -> f.count().map(Long::intValue).flux();
            default -> throw new IllegalArgumentException(p[0]);
          };
        }
        return String.valueOf(f.collectList().block());
      }
      default: throw new IllegalArgumentException("unknown kind");
    }
  }

  static String str(JsonNode t) { return t.get("value").isNull() ? null : t.get("value").asString(); }
  static Integer num(JsonNode t) { return t.get("value").isNull() ? null : t.get("value").asInt(); }

  record VNotBlank(@NotBlank String v) {}
  record VNotEmpty(@NotEmpty String v) {}
  record VNotNull(@NotNull String v) {}
  record VSize(@Size(min = 2, max = 5) String v) {}
  record VEmail(@Email String v) {}
  record VPattern(@Pattern(regexp = "\\d{5}") String v) {}
  record VMin(@Min(18) Integer v) {}
  record VPositive(@Positive Integer v) {}
  record VPositiveOrZero(@PositiveOrZero Integer v) {}

  record Named(String name, int order) implements Ordered { public int getOrder() { return order; } public String toString() { return name; } }
  record Unordered(String name) { public String toString() { return name; } }
}
