import { NextRequest, NextResponse } from "next/server";
import { classify } from "@/lib/scoring";
import { validateAnswers } from "@/lib/validate";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const validation = validateAnswers(record?.answers);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { answers } = validation;
  const classification = classify(answers);
  const assigned = classification.results.find(
    (r) => r.segmentId === classification.assignedSegmentId
  )!;

  const probabilities: Record<string, number> = {};
  for (const r of classification.results) {
    probabilities[r.segmentId] = r.probability;
  }

  await prisma.surveyResponse.create({
    data: {
      q28_02: answers.Q28_02,
      q33: answers.Q33,
      s01: answers.S01,
      q23: answers.Q23,
      q15_01: answers.Q15_01,
      q28_09: answers.Q28_09,
      q30: answers.Q30,
      cvQ21_02: answers.CV_Q21_02,
      dHhSize: answers.D_HH_Size,
      q26: answers.Q26,
      assignedSegmentId: assigned.segmentId,
      assignedSegmentName: assigned.name,
      probabilities,
    },
  });

  return NextResponse.json({ result: classification });
}
