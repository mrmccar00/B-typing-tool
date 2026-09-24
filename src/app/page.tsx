"use client";

import { useMemo, useState } from "react";
import { QUESTIONS, type Answers, type VariableId } from "@/lib/questions";

type SegmentResultView = {
  segmentId: number;
  name: string;
  emoji: string;
  blurb: string;
  probability: number;
};

type Stage = "intro" | "question" | "submitting" | "results" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [numberDraft, setNumberDraft] = useState("");
  const [results, setResults] = useState<SegmentResultView[] | null>(null);
  const [assignedId, setAssignedId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const question = QUESTIONS[questionIndex];
  const progressPct = Math.round((questionIndex / QUESTIONS.length) * 100);

  function startSurvey() {
    setStage("question");
    setQuestionIndex(0);
    setAnswers({});
    setNumberDraft("");
  }

  function goToQuestion(index: number) {
    setQuestionIndex(index);
    const existing = QUESTIONS[index].kind === "number" ? answers[QUESTIONS[index].id] : undefined;
    setNumberDraft(existing !== undefined ? String(existing) : "");
  }

  async function submitAnswers(finalAnswers: Answers) {
    setStage("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong submitting your answers.");
      }
      setResults(data.result.results);
      setAssignedId(data.result.assignedSegmentId);
      setStage("results");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error.");
      setStage("error");
    }
  }

  function handleScaleSelect(variableId: VariableId, value: number) {
    const nextAnswers = { ...answers, [variableId]: value };
    setAnswers(nextAnswers);

    if (questionIndex + 1 < QUESTIONS.length) {
      goToQuestion(questionIndex + 1);
    } else {
      submitAnswers(nextAnswers as Answers);
    }
  }

  function handleNumberContinue() {
    const value = Number(numberDraft);
    if (!Number.isFinite(value)) return;
    const min = question.min ?? -Infinity;
    const max = question.max ?? Infinity;
    if (value < min || value > max) return;

    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);

    if (questionIndex + 1 < QUESTIONS.length) {
      goToQuestion(questionIndex + 1);
    } else {
      submitAnswers(nextAnswers as Answers);
    }
  }

  function handleBack() {
    if (questionIndex > 0) {
      goToQuestion(questionIndex - 1);
    } else {
      setStage("intro");
    }
  }

  function handleRestart() {
    setResults(null);
    setAssignedId(null);
    setErrorMessage(null);
    startSurvey();
  }

  const isNumberValid = useMemo(() => {
    if (stage !== "question" || question.kind !== "number") return false;
    const value = Number(numberDraft);
    const min = question.min ?? -Infinity;
    const max = question.max ?? Infinity;
    return Number.isFinite(value) && value >= min && value <= max;
  }, [numberDraft, question, stage]);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-10">
      {stage === "intro" && <IntroScreen onStart={startSurvey} />}

      {stage === "question" && (
        <QuestionScreen
          index={questionIndex}
          total={QUESTIONS.length}
          progressPct={progressPct}
          onBack={handleBack}
          numberDraft={numberDraft}
          setNumberDraft={setNumberDraft}
          isNumberValid={isNumberValid}
          onNumberContinue={handleNumberContinue}
          onScaleSelect={handleScaleSelect}
          selectedValue={answers[question.id]}
        />
      )}

      {stage === "submitting" && (
        <div className="animate-fade-in text-center text-brand-700">
          <div className="mb-4 text-5xl">✨</div>
          <p className="text-lg font-medium">Crunching the numbers...</p>
        </div>
      )}

      {stage === "error" && (
        <div className="animate-fade-in text-center">
          <p className="mb-4 text-lg font-medium text-red-700">{errorMessage}</p>
          <button
            onClick={handleRestart}
            className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow hover:bg-brand-700"
          >
            Try again
          </button>
        </div>
      )}

      {stage === "results" && results && assignedId !== null && (
        <ResultsScreen results={results} assignedId={assignedId} onRestart={handleRestart} />
      )}
    </main>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in text-center">
      <div className="mb-6 text-6xl">🏘️</div>
      <h1 className="mb-3 text-3xl font-bold text-brand-900 sm:text-4xl">
        What&rsquo;s Your Renter Type?
      </h1>
      <p className="mx-auto mb-8 max-w-md text-brand-700">
        Answer 10 quick questions about your lifestyle and we&rsquo;ll reveal which renter
        segment fits you best &mdash; probabilities and all.
      </p>
      <button
        onClick={onStart}
        className="rounded-full bg-brand-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-brand-700"
      >
        Let&rsquo;s go →
      </button>
      <p className="mt-4 text-xs text-brand-500">Takes about 2 minutes. Fully anonymous.</p>
    </div>
  );
}

function QuestionScreen({
  index,
  total,
  progressPct,
  onBack,
  numberDraft,
  setNumberDraft,
  isNumberValid,
  onNumberContinue,
  onScaleSelect,
  selectedValue,
}: {
  index: number;
  total: number;
  progressPct: number;
  onBack: () => void;
  numberDraft: string;
  setNumberDraft: (v: string) => void;
  isNumberValid: boolean;
  onNumberContinue: () => void;
  onScaleSelect: (variableId: VariableId, value: number) => void;
  selectedValue: number | undefined;
}) {
  const question = QUESTIONS[index];

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-brand-600">
          <button onClick={onBack} className="hover:underline">
            ← Back
          </button>
          <span>
            Question {index + 1} of {total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div key={question.id} className="animate-pop-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-4 text-5xl">{question.emoji}</div>
        <h2 className="mb-2 text-xl font-bold text-brand-900 sm:text-2xl">{question.prompt}</h2>
        {question.helper && <p className="mb-6 text-sm text-brand-600">{question.helper}</p>}

        {question.kind === "scale" && (
          <div className="mt-6 flex flex-col gap-3">
            {question.options!.map((option) => (
              <button
                key={option.value}
                onClick={() => onScaleSelect(question.id, option.value)}
                className={`rounded-2xl border-2 px-5 py-3 text-left font-medium transition hover:border-brand-500 hover:bg-brand-50 ${
                  selectedValue === option.value
                    ? "border-brand-600 bg-brand-50"
                    : "border-brand-100 bg-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {question.kind === "number" && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                inputMode="numeric"
                min={question.min}
                max={question.max}
                value={numberDraft}
                onChange={(e) => setNumberDraft(e.target.value)}
                className="w-32 rounded-2xl border-2 border-brand-200 px-4 py-3 text-center text-2xl font-bold text-brand-900 focus:border-brand-500 focus:outline-none"
                autoFocus
              />
              {question.numberLabel && (
                <span className="text-brand-600">{question.numberLabel}</span>
              )}
            </div>
            <button
              onClick={onNumberContinue}
              disabled={!isNumberValid}
              className="rounded-full bg-brand-600 px-8 py-3 font-semibold text-white shadow transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({
  results,
  assignedId,
  onRestart,
}: {
  results: SegmentResultView[];
  assignedId: number;
  onRestart: () => void;
}) {
  const top = results.find((r) => r.segmentId === assignedId)!;
  const rest = results.filter((r) => r.segmentId !== assignedId);

  return (
    <div className="w-full animate-fade-in text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-500">
        Your renter type is
      </p>
      <div className="mb-8 animate-pop-in rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-3 text-6xl">{top.emoji}</div>
        <h2 className="mb-2 text-3xl font-extrabold text-brand-900">{top.name}</h2>
        <p className="mx-auto mb-4 max-w-sm text-brand-700">{top.blurb}</p>
        <div className="inline-block rounded-full bg-brand-600 px-4 py-1 text-sm font-bold text-white">
          {(top.probability * 100).toFixed(0)}% match
        </div>
      </div>

      <div className="rounded-3xl bg-white/70 p-6 text-left shadow">
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-brand-500">
          Full probability breakdown
        </h3>
        <div className="flex flex-col gap-3">
          <ProbabilityBar segment={top} highlighted />
          {rest.map((segment) => (
            <ProbabilityBar key={segment.segmentId} segment={segment} />
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 rounded-full border-2 border-brand-600 px-6 py-2 font-semibold text-brand-700 transition hover:bg-brand-600 hover:text-white"
      >
        Take the quiz again
      </button>
    </div>
  );
}

function ProbabilityBar({
  segment,
  highlighted = false,
}: {
  segment: SegmentResultView;
  highlighted?: boolean;
}) {
  const pct = segment.probability * 100;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className={`font-medium ${highlighted ? "text-brand-900" : "text-brand-700"}`}>
          {segment.emoji} {segment.name}
        </span>
        <span className={`font-bold ${highlighted ? "text-brand-900" : "text-brand-600"}`}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            highlighted ? "bg-brand-600" : "bg-brand-400"
          }`}
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
    </div>
  );
}
