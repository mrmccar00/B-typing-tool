import type { VariableId } from "./questions";

// Linear discriminant model coefficients, reproduced exactly from the
// "10 question DISCRIM" sheet of CP_Classify_Tool_10_Questions.xlsx.
// Do not edit these numbers without re-deriving them from the source model.

export type SegmentId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Segment = {
  id: SegmentId;
  name: string;
  emoji: string;
  // Placeholder blurb - edit freely, it does not affect scoring.
  blurb: string;
  constant: number;
  coefficients: Record<VariableId, number>;
};

export const SEGMENTS: Segment[] = [
  {
    id: 1,
    name: "Unfussy Tightknit Crews",
    emoji: "🤝",
    blurb: "Low-key and social — happiest with a tight circle of people close by.",
    constant: -39.460788809999997,
    coefficients: {
      Q28_02: 2.3210133558999999,
      Q33: 0.5959044431,
      S01: 0.2863371199,
      Q23: 3.3792151104,
      Q15_01: 4.6499829406,
      Q28_09: 2.5089297287,
      Q30: 2.3892076341,
      CV_Q21_02: 0.5888608426,
      D_HH_Size: 1.7209898395,
      Q26: 1.6012702144,
    },
  },
  {
    id: 2,
    name: "Budget-Bound Homebodies",
    emoji: "🏡",
    blurb: "Practical and home-focused, mindful of every dollar.",
    constant: -31.587605069999999,
    coefficients: {
      Q28_02: 2.5472540103,
      Q33: 0.2633953764,
      S01: 0.2964635915,
      Q23: 0.8698005262,
      Q15_01: 2.8749269162,
      Q28_09: 1.9386263285,
      Q30: 2.9763684697,
      CV_Q21_02: 0.4713446328,
      D_HH_Size: 1.724714213,
      Q26: 2.5787729683,
    },
  },
  {
    id: 3,
    name: "Quiet Long-Timers",
    emoji: "🌙",
    blurb: "Settled, steady, and content to stay put.",
    constant: -34.241813729999997,
    coefficients: {
      Q28_02: 1.9069844333,
      Q33: 0.295767099,
      S01: 0.5225515655,
      Q23: 1.3658394742,
      Q15_01: 4.1648098462,
      Q28_09: 1.6091058815,
      Q30: 1.9545209898,
      CV_Q21_02: 0.5907010211,
      D_HH_Size: 1.5968936558,
      Q26: 1.4230016736,
    },
  },
  {
    id: 4,
    name: "Aspirers",
    emoji: "🚀",
    blurb: "Ambitious and active, always working toward the next milestone.",
    constant: -43.469468440000003,
    coefficients: {
      Q28_02: 4.3077337909,
      Q33: 0.6547045504,
      S01: 0.2466073438,
      Q23: 2.8807300067,
      Q15_01: 2.4523659429,
      Q28_09: 3.2336393859,
      Q30: 2.871466214,
      CV_Q21_02: 0.0407161105,
      D_HH_Size: 1.3431648427,
      Q26: 2.7875627383,
    },
  },
  {
    id: 5,
    name: "Comfortable & Established Renters",
    emoji: "🛋️",
    blurb: "Financially secure and settled into a comfortable routine.",
    constant: -46.561028380000003,
    coefficients: {
      Q28_02: 2.1924816299,
      Q33: 0.8209192097,
      S01: 0.4259644412,
      Q23: 1.7764163424,
      Q15_01: 4.50497764,
      Q28_09: 2.9105311627,
      Q30: 2.9894880765,
      CV_Q21_02: 0.4983912935,
      D_HH_Size: 1.4724637928,
      Q26: 1.9716874081,
    },
  },
  {
    id: 6,
    name: "Stretchers",
    emoji: "🤸",
    blurb: "Stretching to afford an active, on-trend lifestyle.",
    constant: -50.895679090000002,
    coefficients: {
      Q28_02: 5.9094613442,
      Q33: 0.2973127682,
      S01: 0.295887439,
      Q23: 2.1018480097,
      Q15_01: 3.4324922778,
      Q28_09: 3.1841350341,
      Q30: 3.1679836861,
      CV_Q21_02: 0.4310193154,
      D_HH_Size: 1.7574784907,
      Q26: 2.824641128,
    },
  },
  {
    id: 7,
    name: "Family-First Renters",
    emoji: "👨‍👩‍👧",
    blurb: "Family and home life come first, above all else.",
    constant: -35.794134600000003,
    coefficients: {
      Q28_02: 2.5951575495,
      Q33: 0.4040543532,
      S01: 0.3182523555,
      Q23: 3.0282195146,
      Q15_01: 2.6987334313,
      Q28_09: 1.7632364759,
      Q30: 2.417474513,
      CV_Q21_02: 0.2708953605,
      D_HH_Size: 2.5726768707,
      Q26: 2.1808029625,
    },
  },
];
