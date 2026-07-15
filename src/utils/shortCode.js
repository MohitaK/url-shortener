
const BASE62_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const shortCode = (id, secret) => {
    // XOR with a fixed secret so short codes aren't sequentially
    // guessable (id=5 and id=6 won't produce adjacent-looking codes),
    // while staying reversible for decoding on lookup (see ARCHITECTURE.md).
    let value = id ^ secret;

    if (value === 0) return BASE62_ALPHABET[0];

    const digits = [];

    while (value > 0) {
        const remainder = value % 62;
        digits.push(BASE62_ALPHABET[remainder]);

        value = Math.floor(value / 62);
    }

    return digits.reverse().join("");
}

