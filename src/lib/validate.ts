import { QUESTIONS } from "./questions";
import type { Answers } from "./questions";

export function validateAnswers(
  input: unknown
): { ok: true; answers: Answers } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Answers must be an object." };
  }
  const record = input as Record<string, unknown>;
  const answers = {} as Answers;

  for (const question of QUESTIONS) {
    const raw = record[question.id];
    const value = typeof raw === "number" ? raw : Number(raw);

    if (!Number.isFinite(value)) {
      return { ok: false, error: `Missing or invalid answer for ${question.id}.` };
    }

    if (question.kind === "scale") {
      const allowed = question.options?.map((o) => o.value) ?? [];
      if (!allowed.includes(value)) {
        return {
          ok: false,
          error: `Answer for ${question.id} must be one of: ${allowed.join(", ")}.`,
        };
      }
    } else {
      const min = question.min ?? -Infinity;
      const max = question.max ?? Infinity;
      if (value < min || value > max || !Number.isInteger(value)) {
        return {
          ok: false,
          error: `Answer for ${question.id} must be a whole number between ${min} and ${max}.`,
        };
      }
    }

    answers[question.id] = value;
  }

  return { ok: true, answers };
}
