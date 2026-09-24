import { SEGMENTS, type Segment, type SegmentId } from "./segments";
import { VARIABLE_IDS, type Answers } from "./questions";

export type SegmentResult = {
  segmentId: SegmentId;
  name: string;
  emoji: string;
  blurb: string;
  score: number;
  probability: number;
};

export type ClassificationResult = {
  assignedSegmentId: SegmentId;
  results: SegmentResult[]; // sorted by probability, descending
};

function computeScore(segment: Segment, answers: Answers): number {
  let score = segment.constant;
  for (const variableId of VARIABLE_IDS) {
    score += segment.coefficients[variableId] * answers[variableId];
  }
  return score;
}

/**
 * Reproduces the workbook's SCORE -> EXP(SCORE) -> PROBABILITY chain.
 * Scores are shifted by the max before exponentiating (a standard,
 * numerically-safe softmax) which does not change the resulting
 * probabilities versus the workbook's raw EXP() approach.
 */
export function classify(answers: Answers): ClassificationResult {
  const scores = SEGMENTS.map((segment) => ({
    segment,
    score: computeScore(segment, answers),
  }));

  const maxScore = Math.max(...scores.map((s) => s.score));
  const expScores = scores.map((s) => ({
    ...s,
    exp: Math.exp(s.score - maxScore),
  }));
  const sumExp = expScores.reduce((sum, s) => sum + s.exp, 0);

  const results: SegmentResult[] = expScores
    .map(({ segment, score, exp }) => ({
      segmentId: segment.id,
      name: segment.name,
      emoji: segment.emoji,
      blurb: segment.blurb,
      score,
      probability: exp / sumExp,
    }))
    .sort((a, b) => b.probability - a.probability);

  return {
    assignedSegmentId: results[0].segmentId,
    results,
  };
}
