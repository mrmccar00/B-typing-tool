import type { VariableId } from "./questions";

// Linear discriminant model coefficients, reproduced exactly from the
// "10 question DISCRIM" sheet of CP_Classify_Tool_10_Questions.xlsx.
// Do not edit these numbers without re-deriving them from the source model.

export type SegmentId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Segment = {
  id: SegmentId;
  name: string;
  emoji: string;
  // Positive-sounding description shown on the reveal screen, sourced from
  // Class_B_Segment_Profiles.pdf. Edit freely - it does not affect scoring.
  blurb: string;
  constant: number;
  coefficients: Record<VariableId, number>;
};

export const SEGMENTS: Segment[] = [
  {
    id: 1,
    name: "Unfussy Tightknit Crews",
    emoji: "🤝",
    blurb:
      "You keep things simple and centered on what matters most: your close friends, your pets, and a home that's easy to enjoy. A private patio, room to host, and a pet-friendly building are what make a place feel like yours.",
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
    blurb:
      "You're practical and financially disciplined, prioritizing real value and long-term savings over flash. Renting frees you from ownership costs and hassle, so you can keep building toward the future on your own terms.",
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
    blurb:
      "You've found your rhythm, and you love it: a peaceful, familiar home base where routine and comfort matter more than chasing what's new. A quiet, well-located spot to unwind is really all you need.",
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
    blurb:
      "You're ambitious, active, and always moving toward what's next. Your home is fuel for a fitness-driven, socially engaged lifestyle — less a destination, more a launchpad for bigger goals ahead.",
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
    blurb:
      "You've built a comfortable, secure life, and you're perfectly content with it. Space, privacy, and the freedom to skip maintenance and repairs let you focus on what actually matters to you.",
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
    blurb:
      "You go all in on the lifestyle you want: premium finishes, an on-site gym, and a full social calendar. You'd rather invest in living well now, and your home is where that active, connected life comes together.",
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
    blurb:
      "Family comes first for you, always. You want practical, functional space for everyone under one roof, without the guesswork or upkeep that comes with owning a home.",
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
