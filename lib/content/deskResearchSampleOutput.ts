export type DeskResearchSampleTableRow = {
  name: string;
  city: string;
  category?: string;
  type?: string;
  fitScore: number | null;
  quantityStatus?: string;
  exportReadiness?: string;
  validationStatus?: string;
  recommendation?: string;
  legalFeasibility?: string;
  evidenceSummary?: string;
  notes: string;
};

export type DeskResearchSampleRecordCard = {
  pipeline: string;
  name: string;
  location: string;
  category: string;
  scoreOrStatus: string;
  rationale: string;
  reviewStatus: string;
};

export type DeskResearchSampleOutput = {
  sectionTitle: string;
  sectionTitleHu: string;
  sectionLead: string;
  intro: string[];
  privacyNote: string;
  pipelines: {
    quantity: {
      label: string;
      subtitle: string;
      sourceFile: string;
      rows: DeskResearchSampleTableRow[];
    };
    quality: {
      label: string;
      subtitle: string;
      sourceFile: string;
      rows: DeskResearchSampleTableRow[];
    };
  };
  cards: DeskResearchSampleRecordCard[];
};

// TODO: confirm whether full sample export can be public
export const deskResearchSampleOutput: DeskResearchSampleOutput = {
  sectionTitle: "Referencia kutatási output",
  sectionTitleHu: "Reference research output",
  sectionLead:
    "AI-támogatott desk research capability demó: strukturált, review-olható és kliensoldalon is átadható research delivery.",
  intro: [
    "A referencia minta egy svájci brand-collaboration mapping assignmentből származik, de ugyanaz a workflow-logika más desk research témákra is alkalmazható.",
  ],
  privacyNote:
    "A preview capability-demó célból szűrt mezőket mutat; érzékeny reviewer mezők és belső jegyzetek nincsenek publikálva.",
  pipelines: {
    quantity: {
      label: "Quantity pipeline",
      subtitle: "Longlist, scoring, shortlist preparation",
      sourceFile: "master_quantity.xlsx (repo: quantity_data.xlsx)",
      rows: [
    {
        "name":  "20km/h",
        "city":  "Zurich",
        "category":  "Gallery",
        "fitScore":  2,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a broad commercial venue lead for coverage and prioritisation; direct POS relevance is inferred and should…"
    },
    {
        "name":  "25hours Hotel Zürich Langstrasse",
        "city":  "Zurich",
        "category":  "Hotel",
        "fitScore":  4,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a potential POS/distribution lead based on combined category and commercial context signals; actual sales a…"
    },
    {
        "name":  "25hours Hotel Zürich West",
        "city":  "Zurich",
        "category":  "Hotel",
        "fitScore":  4,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a potential POS/distribution lead based on combined category and commercial context signals; actual sales a…"
    },
    {
        "name":  "2places Side",
        "city":  "Basel",
        "category":  "Hotel",
        "fitScore":  3,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant based on adult-audience likelihood and venue context signals; lead relevance is inferred and requires validati…"
    },
    {
        "name":  "2places",
        "city":  "Basel",
        "category":  "Hotel",
        "fitScore":  3,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant based on adult-audience likelihood and venue context signals; lead relevance is inferred and requires validati…"
    },
    {
        "name":  "3DD espace de concertation",
        "city":  "Geneva",
        "category":  "Community centre",
        "fitScore":  3,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a broad commercial venue lead for coverage and prioritisation; direct POS relevance is inferred and should…"
    },
    {
        "name":  "46a",
        "city":  "Lausanne",
        "category":  "Hotel",
        "fitScore":  3,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant based on adult-audience likelihood and venue context signals; lead relevance is inferred and requires validati…"
    },
    {
        "name":  "9 Hôtel Pâquis",
        "city":  "Geneva",
        "category":  "Hotel",
        "fitScore":  4,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a potential POS/distribution lead based on combined category and commercial context signals; actual sales a…"
    },
    {
        "name":  "a publik",
        "city":  "Zurich",
        "category":  "Gallery",
        "fitScore":  4,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a broad commercial venue lead for coverage and prioritisation; direct POS relevance is inferred and should…"
    },
    {
        "name":  "Absolute Art Gallery",
        "city":  "Lugano",
        "category":  "Gallery",
        "fitScore":  1,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Included as a broad lead based on available category and location data; further validation is required."
    },
    {
        "name":  "ACCOR Hôtel Mercure Bienne",
        "city":  "Biel/Bienne",
        "category":  "Hotel",
        "fitScore":  5,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant based on adult-audience likelihood and venue context signals; lead relevance is inferred and requires validati…"
    },
    {
        "name":  "Ackermannshof",
        "city":  "Basel",
        "category":  "Museum",
        "fitScore":  1,
        "quantityStatus":  "candidate",
        "exportReadiness":  "Unchecked",
        "notes":  "Included as a broad lead based on available category and location data; further validation is required."
    },
    {
        "name":  "#studio",
        "city":  "Zurich",
        "category":  "Hairdresser",
        "fitScore":  3,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a broad commercial venue lead for coverage and prioritisation; direct POS relevance is inferred and should…"
    },
    {
        "name":  "\u0026 Other Stories",
        "city":  "Zurich",
        "category":  "Clothing store",
        "fitScore":  5,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a retail or convenience-style lead with strong potential POS context; actual product availability should be…"
    },
    {
        "name":  "\u0027ekō",
        "city":  "Basel",
        "category":  "Clothing store",
        "fitScore":  3,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a broad commercial venue lead for coverage and prioritisation; direct POS relevance is inferred and should…"
    },
    {
        "name":  "(Blumenau) Li-Beirut",
        "city":  "Winterthur",
        "category":  "Restaurant",
        "fitScore":  3,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a food/drink venue with recurring public footfall and potential adult audience mix; commercial fit depends…"
    },
    {
        "name":  "(sphery)",
        "city":  "Zurich",
        "category":  "Fitness Centre",
        "fitScore":  3,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a broad commercial venue lead for coverage and prioritisation; direct POS relevance is inferred and should…"
    },
    {
        "name":  "01bar",
        "city":  "Zurich",
        "category":  "Bar",
        "fitScore":  2,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant due to adult-oriented social context and engagement potential; suitability and product-sales status require ve…"
    },
    {
        "name":  "10\u0027 dieci",
        "city":  "Basel",
        "category":  "Fast food",
        "fitScore":  5,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a food/drink venue with recurring public footfall and potential adult audience mix; commercial fit depends…"
    },
    {
        "name":  "10\u0027 dieci",
        "city":  "Basel",
        "category":  "Fast food",
        "fitScore":  5,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a food/drink venue with recurring public footfall and potential adult audience mix; commercial fit depends…"
    },
    {
        "name":  "10\u0027 dieci",
        "city":  "Biel/Bienne",
        "category":  "Fast food",
        "fitScore":  4,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a food/drink venue with recurring public footfall and potential adult audience mix; commercial fit depends…"
    },
    {
        "name":  "10\u0027 dieci",
        "city":  "Geneva",
        "category":  "Fast food",
        "fitScore":  4,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a food/drink venue with recurring public footfall and potential adult audience mix; commercial fit depends…"
    },
    {
        "name":  "10\u0027 dieci",
        "city":  "Geneva",
        "category":  "Fast food",
        "fitScore":  4,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a food/drink venue with recurring public footfall and potential adult audience mix; commercial fit depends…"
    },
    {
        "name":  "10\u0027 dieci",
        "city":  "Geneva",
        "category":  "Restaurant",
        "fitScore":  4,
        "quantityStatus":  "export_ready",
        "exportReadiness":  "Unchecked",
        "notes":  "Relevant as a food/drink venue with recurring public footfall and potential adult audience mix; commercial fit depends…"
    }
]
    },
    quality: {
      label: "Quality pipeline",
      subtitle: "Deeper profiling, evidence summaries, research-ready records",
      sourceFile: "master.xlsx (repo: quality_data.xlsx)",
      rows: [
    {
        "name":  "1620",
        "city":  "Andermatt",
        "type":  "wine bar / bistro",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to identify high-density adult venues for brand activation. The venue\u0027s focus on wine and adul…"
    },
    {
        "name":  "169 West",
        "city":  "Zürich",
        "type":  "wine bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to identify trend-driven social venues in urban centers with high adult density. The venue\u0027s f…"
    },
    {
        "name":  "1872",
        "city":  "Interlaken",
        "type":  "hotel bar / lounge",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "3 sources captured",
        "notes":  "The venue aligns with client goals to prioritize premium nightlife environments in high-density areas, but further vali…"
    },
    {
        "name":  "21Club",
        "city":  "Geneva",
        "type":  "fine-dining bar / club-adjacent premium social venue",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  4,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to prioritize premium nightlife venues in urban centers with high adult density."
    },
    {
        "name":  "Abaton Bar",
        "city":  "Zürich",
        "type":  "Loungebar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals of targeting premium nightlife venues in urban centers like Zürich."
    },
    {
        "name":  "Abflugbar",
        "city":  "Bern",
        "type":  "lounge bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to identify high-density nightlife venues in urban centers for brand activation."
    },
    {
        "name":  "Adam\u0027s Lounge Bar",
        "city":  "Montreux",
        "type":  "lounge bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "4 sources captured",
        "notes":  "Aligns with client goals to identify high-density nightlife venues for brand activation. The venue\u0027s central location a…"
    },
    {
        "name":  "Affekt Bar",
        "city":  "St. Gallen",
        "type":  "electronic-music bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "2 sources captured",
        "notes":  "Aligns with client goals to identify trend-driven urban hotspots and high-density nightlife clusters."
    },
    {
        "name":  "Afro-Pfingsten Festival",
        "city":  "Winterthur",
        "type":  "cultural \u0026 music festival",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  4,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "The Afro-Pfingsten Festival aligns with client goals of identifying culturally relevant venues and large-scale events f…"
    },
    {
        "name":  "Albani Music Club",
        "city":  "Winterthur",
        "type":  "nightclub \u0026 live music club",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "restricted",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals of targeting premium nightlife venues in urban centers with high-density adult gatherings."
    },
    {
        "name":  "Alpineum",
        "city":  "Lucerne",
        "type":  "restaurant bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to identify venues for adult social gatherings and brand activations in urban centers."
    },
    {
        "name":  "Alps View Festival",
        "city":  "Val-de-Ruz",
        "type":  "open-air techno festival",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "The festival aligns with client goals of targeting large-scale events and open-air environments, but further validation…"
    },
    {
        "name":  "Alt St.Gallen",
        "city":  "St. Gallen",
        "type":  "cocktail bar / nightlife bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to identify high-density nightlife venues for brand activation and partnerships, focusing on u…"
    },
    {
        "name":  "AmBach Festival",
        "city":  "Glarus",
        "type":  "boutique electronic \u0026 indie festival",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "The festival aligns with client goals to identify trend-driven social venues and supports segmentation of boutique even…"
    },
    {
        "name":  "Amber Bar",
        "city":  "Basel",
        "type":  "cocktail bar (American Bar)",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  4,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "2 sources captured",
        "notes":  "Aligns with client goals to prioritize premium nightlife venues in urban centers with high-density adult social cluster…"
    },
    {
        "name":  "American Bar | Château Gütsch",
        "city":  "Lucerne",
        "type":  "cocktail bar (hotel American Bar)",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to prioritize premium nightlife venues in urban centers with high adult density."
    },
    {
        "name":  "AMR Jazz Festival",
        "city":  "Geneva",
        "type":  "recurring jazz festival",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "The event aligns with client goals of identifying culturally relevant venues and offers potential for brand activation…"
    },
    {
        "name":  "Analog Bar",
        "city":  "St. Gallen",
        "type":  "lounge bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "2 sources captured",
        "notes":  "Aligns with client goals to map LAMP venues in urban centers with high-density nightlife clusters."
    },
    {
        "name":  "Andorra Bar",
        "city":  "Zürich",
        "type":  "cocktail bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  4,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to prioritize high-density nightlife clusters in urban centers for brand activation."
    },
    {
        "name":  "Anton’s Bar",
        "city":  "St. Moritz",
        "type":  "hotel bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "2 sources captured",
        "notes":  "Aligns with client goals to prioritize premium nightlife venues in high-density leisure destinations. Offers potential…"
    },
    {
        "name":  "Arch Bar",
        "city":  "Winterthur",
        "type":  "cocktail bar / event bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to map adult urban social nodes and prioritize venues for brand activation \u0026 partnerships in h…"
    },
    {
        "name":  "Art Basel (Basel Edition)",
        "city":  "Basel",
        "type":  "international art fair / cultural mega-event",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  4,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to prioritize culturally relevant venues with high footfall and premium audience concentration."
    },
    {
        "name":  "Arthur’s Rive Gauche",
        "city":  "Geneva",
        "type":  "restaurant bar",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  3,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "1 source captured",
        "notes":  "Aligns with client goals to identify high-density nightlife venues in urban centers like Geneva. However, further valid…"
    },
    {
        "name":  "Atelier Bar",
        "city":  "Thun",
        "type":  "cocktail bar (American Bar)",
        "validationStatus":  "in_review",
        "recommendation":  "Pending reviewer recommendation",
        "fitScore":  4,
        "legalFeasibility":  "uncertain",
        "evidenceSummary":  "2 sources captured",
        "notes":  "Aligns with client goals to prioritize premium nightlife venues for brand activation and partnerships, focusing on high…"
    }
]
    }
  },
  cards: [
    {
        "pipeline":  "Quantity pipeline",
        "name":  "25hours Hotel Zürich Langstrasse",
        "location":  "Zurich",
        "category":  "Hotel",
        "scoreOrStatus":  "Fit 4 / candidate",
        "rationale":  "Relevant as a potential POS/distribution lead based on combined category and commercial context signals; actual sales a…",
        "reviewStatus":  "Longlist candidate"
    },
    {
        "pipeline":  "Quantity pipeline",
        "name":  "(Blumenau) Li-Beirut",
        "location":  "Winterthur",
        "category":  "Restaurant",
        "scoreOrStatus":  "Fit 3 / export_ready",
        "rationale":  "Relevant as a food/drink venue with recurring public footfall and potential adult audience mix; commercial fit depends…",
        "reviewStatus":  "Export-ready row"
    },
    {
        "pipeline":  "Quality pipeline",
        "name":  "21Club",
        "location":  "Geneva",
        "category":  "fine-dining bar / club-adjacent premium social venue",
        "scoreOrStatus":  "Fit 4 / in_review",
        "rationale":  "Aligns with client goals to prioritize premium nightlife venues in urban centers with high adult density.",
        "reviewStatus":  "Pending reviewer recommendation"
    },
    {
        "pipeline":  "Quality pipeline",
        "name":  "Albani Music Club",
        "location":  "Winterthur",
        "category":  "nightclub \u0026 live music club",
        "scoreOrStatus":  "Fit 3 / restricted",
        "rationale":  "Aligns with client goals of targeting premium nightlife venues in urban centers with high-density adult gatherings.",
        "reviewStatus":  "in_review"
    }
]
};
