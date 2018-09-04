/**
 * Checks if a variable is an non-empty string
 * @param str
 * @returns {*|boolean}
 */
exports.isString = function(str) {
    return ( str &&
    (typeof str === 'string' || str instanceof String));
}

/**
 * Checks if a variable is an non-empty string
 * @param str
 * @returns {*|boolean}
 */
exports.isNonEmptyString = function(str) {
    return ( str &&
    (typeof str === 'string' || str instanceof String) &&
    str.length && str.length > 0);
}

/**
 * Checks if a variable is an non-empty string
 * @param str
 * @returns {*|boolean}
 */
exports.isEmptyString = function(str) {
    return ( str &&
    (typeof str === 'string' || str instanceof String) &&
    str.length && str.length === 0);
}

/**
 * Zufallszahl mit Minimum und Maximum
 * @param min untere Grenze
 * @param max obere Grenze
 */
exports.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}