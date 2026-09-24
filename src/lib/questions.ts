// Question and answer-scale definitions for the CP Renter Segment Classification Tool.
// Variable ids and response codes must match the coefficients in segments.ts exactly.

export type VariableId =
  | "Q28_02"
  | "Q33"
  | "S01"
  | "Q23"
  | "Q15_01"
  | "Q28_09"
  | "Q30"
  | "CV_Q21_02"
  | "D_HH_Size"
  | "Q26";

export type ScaleOption = { value: number; label: string };

export type Question = {
  id: VariableId;
  emoji: string;
  prompt: string;
  helper?: string;
  kind: "scale" | "number";
  options?: ScaleOption[];
  min?: number;
  max?: number;
  numberLabel?: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "Q28_02",
    emoji: "🏃",
    prompt: "How often do you go running outdoors during peak season?",
    kind: "scale",
    options: [
      { value: 1, label: "Never or rarely" },
      { value: 2, label: "A few times a month" },
      { value: 3, label: "About once a week" },
      { value: 4, label: "Multiple days a week" },
      { value: 5, label: "Daily or almost daily" },
    ],
  },
  {
    id: "Q33",
    emoji: "💰",
    prompt: "What's your total annual household income before taxes?",
    kind: "scale",
    options: [
      { value: 1, label: "Less than $20,000" },
      { value: 2, label: "$20,000 to < $30,000" },
      { value: 3, label: "$30,000–$34,999" },
      { value: 4, label: "$35,000–$39,999" },
      { value: 5, label: "$40,000–$44,999" },
      { value: 6, label: "$45,000–$49,999" },
      { value: 7, label: "$50,000–$54,999" },
      { value: 8, label: "$55,000–$59,999" },
      { value: 9, label: "$60,000–$64,999" },
      { value: 10, label: "$65,000–$69,999" },
      { value: 11, label: "$70,000–$74,999" },
      { value: 12, label: "$75,000–$79,999" },
      { value: 13, label: "$80,000–$84,999" },
      { value: 14, label: "$85,000–$89,999" },
      { value: 15, label: "$90,000–$94,999" },
      { value: 16, label: "$95,000–$99,999" },
      { value: 17, label: "$100,000–$124,999" },
      { value: 18, label: "$125,000–$149,999" },
      { value: 19, label: "$150,000–$199,999" },
      { value: 20, label: "$200,000–$249,999" },
      { value: 21, label: "$250,000 or more" },
    ],
  },
  {
    id: "S01",
    emoji: "🎂",
    prompt: "How old are you?",
    helper: "Enter a number between 20 and 75.",
    kind: "number",
    min: 20,
    max: 75,
    numberLabel: "years old",
  },
  {
    id: "Q23",
    emoji: "🚪",
    prompt: "On average, how often do you have guests visit your apartment?",
    kind: "scale",
    options: [
      { value: 1, label: "Never or almost never" },
      { value: 2, label: "Less than once a month" },
      { value: 3, label: "About once a month" },
      { value: 4, label: "A few times a month" },
      { value: 5, label: "About once a week or more often" },
    ],
  },
  {
    id: "Q15_01",
    emoji: "🏫",
    prompt: "What's the farthest you'd be willing to live from K-12 schools (by car)?",
    kind: "scale",
    options: [
      { value: 1, label: "Under five minutes" },
      { value: 2, label: "5 to 15 minutes" },
      { value: 3, label: "16 to 25 minutes" },
      { value: 4, label: "More than 25 minutes" },
    ],
  },
  {
    id: "Q28_09",
    emoji: "🏋️",
    prompt: "How often do you do weightlifting or strength training during peak season?",
    kind: "scale",
    options: [
      { value: 1, label: "Never or rarely" },
      { value: 2, label: "A few times a month" },
      { value: 3, label: "About once a week" },
      { value: 4, label: "Multiple days a week" },
      { value: 5, label: "Daily or almost daily" },
    ],
  },
  {
    id: "Q30",
    emoji: "📱",
    prompt: "Which best describes you?",
    helper: "1 = Technology makes things more complicated than they need to be · 7 = I like to have the latest and greatest technology",
    kind: "scale",
    options: [
      { value: 1, label: "1 — Technology makes things more complicated than they need to be" },
      { value: 2, label: "2" },
      { value: 3, label: "3" },
      { value: 4, label: "4" },
      { value: 5, label: "5" },
      { value: 6, label: "6" },
      { value: 7, label: "7 — I like to have the latest and greatest technology" },
    ],
  },
  {
    id: "CV_Q21_02",
    emoji: "🐾",
    prompt: "\"My pets are central to my life, and I go above and beyond for them.\" How much do you agree?",
    helper: "Choose 0 if this doesn't apply to you (no pets).",
    kind: "scale",
    options: [
      { value: 0, label: "No pets / not applicable" },
      { value: 1, label: "Strongly disagree" },
      { value: 2, label: "Moderately disagree" },
      { value: 3, label: "Slightly disagree" },
      { value: 4, label: "Neither agree nor disagree" },
      { value: 5, label: "Slightly agree" },
      { value: 6, label: "Moderately agree" },
      { value: 7, label: "Strongly agree" },
    ],
  },
  {
    id: "D_HH_Size",
    emoji: "🏠",
    prompt: "Besides you, how many people live in your current home?",
    helper: "Include any other adults or children who've lived at this address for at least two months.",
    kind: "number",
    min: 0,
    max: 15,
    numberLabel: "people",
  },
  {
    id: "Q26",
    emoji: "🍳",
    prompt: "Which best describes the dinners you cook at home?",
    helper: "1 = I mostly heat up prepared or ready-to-eat foods · 7 = I regularly make elaborate or time-intensive meals",
    kind: "scale",
    options: [
      { value: 1, label: "1 — I mostly heat up prepared or ready-to-eat foods" },
      { value: 2, label: "2" },
      { value: 3, label: "3" },
      { value: 4, label: "4" },
      { value: 5, label: "5" },
      { value: 6, label: "6" },
      { value: 7, label: "7 — I regularly make elaborate or time-intensive meals" },
    ],
  },
];

export const VARIABLE_IDS: VariableId[] = QUESTIONS.map((q) => q.id);

export type Answers = Record<VariableId, number>;
