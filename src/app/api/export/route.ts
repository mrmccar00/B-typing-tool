import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { SEGMENTS } from "@/lib/segments";
import { toCsv } from "@/lib/csv";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const responses = await prisma.surveyResponse.findMany({
    orderBy: { createdAt: "asc" },
  });

  const header = [
    "id",
    "created_at",
    "q28_02_running_freq",
    "q33_income_band",
    "s01_age",
    "q23_guest_freq",
    "q15_01_school_distance",
    "q28_09_strength_training_freq",
    "q30_tech_attitude",
    "cv_q21_02_pet_importance",
    "d_hh_size_household_size",
    "q26_cooking_style",
    "assigned_segment_id",
    "assigned_segment_name",
    ...SEGMENTS.map((s) => `prob_${s.name}`),
  ];

  const rows = responses.map((r) => {
    const probabilities = r.probabilities as Record<string, number>;
    return [
      r.id,
      r.createdAt.toISOString(),
      r.q28_02,
      r.q33,
      r.s01,
      r.q23,
      r.q15_01,
      r.q28_09,
      r.q30,
      r.cvQ21_02,
      r.dHhSize,
      r.q26,
      r.assignedSegmentId,
      r.assignedSegmentName,
      ...SEGMENTS.map((s) => (probabilities[s.id]?.toFixed(4) ?? "")),
    ];
  });

  const csv = toCsv([header, ...rows]);
  const filename = `segment-survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
