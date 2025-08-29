import type { ValidationRule, ValidationValue } from "react-hook-form";

export function getRuleValue<T extends ValidationValue>(
  rule?: ValidationRule<T>,
): T | undefined {
  if (typeof rule === "undefined" || rule instanceof RegExp) {
    return;
  }

  if (typeof rule === "object") {
    return rule.value;
  }

  return rule;
}