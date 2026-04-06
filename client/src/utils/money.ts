export function formatCentsToEuro(cents: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function parseEuroInputToCents(input: string): number | null {
  const compact = input.trim().replace(/\s+/g, "").replace(/€/g, "");
  if (!compact) {
    return null;
  }

  if (!/^[\d.,]+$/.test(compact)) {
    return null;
  }

  let normalized = compact;
  const hasComma = compact.includes(",");
  const hasDot = compact.includes(".");

  if (hasComma && hasDot) {
    const lastComma = compact.lastIndexOf(",");
    const lastDot = compact.lastIndexOf(".");
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    normalized = compact.split(thousandsSeparator).join("");
    normalized = normalized.replace(decimalSeparator, ".");
  } else if (hasComma || hasDot) {
    const separator = hasComma ? "," : ".";
    const chunks = compact.split(separator);

    if (chunks.length === 2) {
      const fractionalLength = chunks[1].length;
      normalized =
        fractionalLength === 3
          ? chunks.join("")
          : `${chunks[0]}.${chunks[1]}`;
    } else {
      const fractional = chunks[chunks.length - 1];
      const whole = chunks.slice(0, -1).join("");
      normalized =
        fractional.length >= 1 && fractional.length <= 2
          ? `${whole}.${fractional}`
          : chunks.join("");
    }
  }

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const [whole, fractional = ""] = normalized.split(".");
  const cents = Number(whole) * 100 + Number(fractional.padEnd(2, "0"));

  return Number.isSafeInteger(cents) ? cents : null;
}
