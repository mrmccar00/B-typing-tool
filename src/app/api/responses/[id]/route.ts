import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SEGMENTS } from "@/lib/segments";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = (body as Record<string, unknown>)?.selfSelectedSegmentId;
  const segmentId = typeof raw === "number" ? raw : Number(raw);
  const segment = SEGMENTS.find((s) => s.id === segmentId);
  if (!segment) {
    return NextResponse.json(
      { error: "selfSelectedSegmentId must be one of the 7 valid segment ids." },
      { status: 400 }
    );
  }

  try {
    await prisma.surveyResponse.update({
      where: { id },
      data: {
        selfSelectedSegmentId: segment.id,
        selfSelectedSegmentName: segment.name,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Response not found." }, { status: 404 });
    }
    console.error("Failed to update self-selected segment:", err);
    return NextResponse.json(
      { error: "We couldn't save your answer right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
