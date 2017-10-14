/**
 * Do no touch what ever is inside pleeeeese.
 * @example
 * {{#php}}<?= "What ever"; ?>{{/raw}}
 */
module.exports = function(options) {
  return options.fn(this);
}
