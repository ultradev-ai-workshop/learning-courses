// A tiny router: method + URLPattern path → handler; 404 and 405 handled for you (Chapter 11).
export class Router {
  #routes = [];

  #add(method, path, handler) {
    this.#routes.push({ method, pattern: new URLPattern({ pathname: path }), handler });
    return this;
  }
  get(path, handler) { return this.#add("GET", path, handler); }
  post(path, handler) { return this.#add("POST", path, handler); }
  patch(path, handler) { return this.#add("PATCH", path, handler); }
  delete(path, handler) { return this.#add("DELETE", path, handler); }

  match(method, pathname) {
    let pathMatched = false;
    for (const route of this.#routes) {
      const m = route.pattern.exec({ pathname });
      if (!m) continue;
      pathMatched = true;
      if (route.method === method) return { handler: route.handler, params: m.pathname.groups };
    }
    return { status: pathMatched ? 405 : 404 };
  }
}
