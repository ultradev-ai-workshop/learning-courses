// Domain errors. `new.target.name` gives each subclass its own name automatically.
export class ShopError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = new.target.name;
  }
}
export class ValidationError extends ShopError {}
export class OutOfStockError extends ShopError {}
export class PaymentError extends ShopError {}
