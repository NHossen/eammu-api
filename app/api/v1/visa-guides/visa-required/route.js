import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    visa_type: "visa-required",
    label: "Visa Required (Sticker Visa)",
    color: "#FF0000",

    // --- Core Description (targets: "what is visa required", "visa required meaning") ---
    description:
      "A visa-required destination means travelers must obtain an official entry visa from the destination country's embassy or consulate before departure. This visa is a formal authorization stamped or affixed in your passport, granting permission to enter, transit, or stay for a defined period. Requirements, fees, and processing times vary significantly by nationality, destination country, and purpose of travel.",

    // --- SEO Summary (for meta/structured data use) ---
    seo_summary:
      "Learn everything about visa-required travel: how to apply, required documents, processing times, fees, and expert tips to get your visa approved fast. Updated 2025 guide for international travelers.",

    // --- Key Facts Panel ---
    key_facts: {
      fee_range:           "USD 30–250+ (varies by destination and visa category)",
      processing_time:     "5–20 business days on average; some embassies offer 2–5 day express processing",
      validity_range:      "Single entry (30–90 days) to multiple entry (up to 10 years) — depends on bilateral agreements",
      passport_validity:   "Minimum 6 months beyond intended stay; at least 2 blank pages required",
      common_visa_types:   ["Tourist Visa", "Business Visa", "Student Visa", "Transit Visa", "Work Visa", "Medical Visa", "Family Reunion Visa"],
    },

    // --- Requirements (targets: "visa application documents checklist", "what documents needed for visa") ---
    requirements: {
      mandatory: [
        "Valid passport with at least 6 months validity beyond your travel dates and a minimum of 2 blank pages for the visa stamp",
        "Completed and signed visa application form — download from the official embassy or consulate website of your destination country",
        "Recent passport-size photographs — typically 2 copies, white background, taken within the last 6 months (check exact specs per embassy)",
        "Proof of sufficient financial means — bank statements for the last 3–6 months showing adequate funds (usually USD 50–100+ per day of stay)",
        "Confirmed return or onward travel ticket (flight, bus, or train booking in your name)",
        "Confirmed accommodation proof — hotel booking confirmation, Airbnb reservation, or a notarized invitation letter from your host",
        "Valid travel insurance covering the full duration of stay (minimum USD 30,000 medical coverage recommended)",
        "Visa application fee payment — amount varies by country; check the official embassy fee schedule",
      ],
      by_purpose: {
        tourism: [
          "Detailed travel itinerary — day-by-day plan of places you intend to visit",
          "Proof of ties to home country (employment letter, property ownership, or family commitments) to demonstrate intent to return",
        ],
        business: [
          "Official invitation letter from the host company in the destination country, on company letterhead",
          "Sponsorship letter from your employer confirming the purpose of travel, duration, and that the company will cover expenses",
          "Business registration certificate (if self-employed)",
        ],
        study: [
          "Original acceptance letter or enrollment confirmation from a recognized institution in the destination country",
          "Proof of tuition fee payment or scholarship letter",
          "Guardian's financial support letter (if a minor or dependent on parents)",
        ],
        transit: [
          "Confirmed onward ticket (final destination ticket) showing you will leave within the permitted transit window",
          "Valid visa for your final destination (if required)",
        ],
      },
    },

    // --- Step-by-Step Process (targets: "how to apply for visa step by step", "visa application process") ---
    steps: [
      {
        step: 1,
        title: "Determine the Correct Visa Type",
        detail:
          "Identify whether you need a tourist, business, student, transit, or other visa category. Applying for the wrong type is one of the most common reasons for rejection. Visit the official embassy website of your destination country for the full list of visa categories.",
      },
      {
        step: 2,
        title: "Check Your Eligibility & Entry Requirements",
        detail:
          "Confirm current entry requirements for your specific nationality. Requirements can change due to diplomatic relations, health advisories, or policy updates. Use official sources — embassy websites, IATA Travel Centre, or a trusted visa consultancy.",
      },
      {
        step: 3,
        title: "Download & Complete the Application Form",
        detail:
          "Obtain the official visa application form from the embassy's website. Fill it out completely and accurately — any discrepancy between your form and supporting documents can result in rejection. Print, sign, and date where required.",
      },
      {
        step: 4,
        title: "Gather & Organize Your Documents",
        detail:
          "Collect all required documents based on your visa category. Make clear, full-page photocopies of each document. Arrange originals and copies separately. Missing or unclear documents are the leading cause of visa delays.",
      },
      {
        step: 5,
        title: "Book Your Appointment",
        detail:
          "Most embassies and consulates require a prior appointment — walk-ins are rarely accepted. Book via the official embassy portal or visa application center (VAC) such as VFS Global or TLScontact. Book early, especially during peak travel seasons (June–August, December–January).",
      },
      {
        step: 6,
        title: "Attend Your Appointment & Submit Application",
        detail:
          "Arrive at your appointment on time with all original documents and copies. Submit your application, pay the visa fee (cash, card, or demand draft — varies by embassy), and provide biometric data (fingerprints and photo) if required.",
      },
      {
        step: 7,
        title: "Track Your Application",
        detail:
          "After submission, you will receive a receipt or tracking reference number. Monitor your application status via the embassy's online portal or VAC tracking system. Avoid contacting the embassy unnecessarily — it can slow down the process.",
      },
      {
        step: 8,
        title: "Collect Your Passport",
        detail:
          "Once a decision is made, collect your passport by visiting the VAC or embassy, or via the courier service if opted in. If approved, review the visa sticker carefully before leaving the counter — check the entry type (single/multiple), validity dates, permitted duration of stay, and any conditions.",
      },
      {
        step: 9,
        title: "Prepare for Travel",
        detail:
          "Make photocopies of your visa and carry them separately from your passport. Save a digital copy on your phone and email. Carry all supporting documents during travel — immigration officers may ask to see proof of accommodation, funds, or onward tickets.",
      },
    ],

    // --- Expert Tips (targets: "visa tips", "how to get visa approved", "visa rejection reasons") ---
    tips: {
      before_applying: [
        "Apply at least 4–8 weeks before your travel date — some embassies have appointment slots weeks in advance.",
        "Always apply for the visa that exactly matches your travel purpose. Applying for a tourist visa when you are attending a business meeting is a misrepresentation.",
        "Check the embassy's official website within 72 hours of your appointment to confirm no last-minute requirement changes.",
        "Ensure your bank statements show a consistent balance — large, sudden deposits before applying can raise red flags.",
      ],
      during_application: [
        "Be honest on your application form — immigration databases are highly sophisticated, and inconsistencies are easily detected.",
        "If you have previously been refused a visa anywhere, disclose it if asked. Failing to declare previous refusals is grounds for an immediate ban.",
        "Submit a well-organized document file — arrange documents in the same order as listed in the embassy checklist.",
        "When in doubt, include extra supporting documents. Over-documentation rarely hurts; under-documentation often does.",
      ],
      after_approval: [
        "Review your visa immediately: confirm entry type (single, double, multiple), validity period, and maximum days of stay per visit.",
        "Note the difference between visa validity (how long you can use it to enter) and permitted stay (how long you can remain after entry).",
        "Do not overstay your visa — overstaying even by one day can result in fines, deportation, and bans on future applications.",
        "Register with your country's embassy in the destination country for long stays (common requirement for many nationalities).",
      ],
    },

    // --- Common Rejection Reasons (targets: "visa rejection reasons", "why visa gets rejected") ---
    common_rejection_reasons: [
      "Incomplete or incorrectly filled application form",
      "Insufficient proof of financial means or unstable bank balance",
      "Lack of strong ties to home country (unemployment, no property, no family)",
      "Missing or expired supporting documents",
      "Previous immigration violations, overstays, or visa refusals not declared",
      "Inconsistencies between application form and supporting documents",
      "Criminal record or security concerns",
      "Failure to appear for an interview when required",
      "Applying too close to the travel date (insufficient processing time)",
    ],

    // --- Glossary (targets: "visa terms glossary", "what is visa validity", "what is duration of stay") ---
    glossary: {
      visa_validity:
        "The date range within which you must use the visa to enter the destination country. For example, 'valid from 01 Jan 2025 to 30 Jun 2025' means you must enter before 30 June.",
      duration_of_stay:
        "The maximum number of days you are permitted to remain in the country per entry, counted from your actual entry date. Often 30, 60, or 90 days.",
      single_entry_visa:
        "Allows one entry into the destination country. Once you exit, the visa is void even if the validity period has not expired.",
      multiple_entry_visa:
        "Allows unlimited entries within the visa validity period, subject to the permitted duration of stay per visit. Ideal for frequent travelers.",
      biometrics:
        "Fingerprints and a digital photograph collected at the embassy or visa application center. Required by many countries including Schengen, UK, USA, and Canada.",
      vac:
        "Visa Application Center — an outsourced center (e.g., VFS Global, TLScontact, BLS International) authorized to collect visa applications and documents on behalf of an embassy.",
    },

    // --- FAQs (targets: "visa required FAQ", voice-search & featured snippet optimization) ---
    faqs: [
      {
        question: "What does 'visa required' mean?",
        answer:
          "Visa required means that citizens of your passport-issuing country cannot enter the destination country without first obtaining an official visa. You must apply at the destination country's embassy or consulate before you travel.",
      },
      {
        question: "How long does visa processing take?",
        answer:
          "Standard processing typically takes 5–20 business days depending on the destination country and embassy workload. Many embassies offer express or priority processing for an additional fee, reducing wait times to 2–5 business days.",
      },
      {
        question: "Can I apply for a visa without a confirmed flight ticket?",
        answer:
          "Most embassies require a confirmed or provisional flight booking as part of the application. A provisional (on-hold) booking from an airline or travel agency is generally acceptable and avoids the risk of purchasing a non-refundable ticket before visa approval.",
      },
      {
        question: "What is the difference between visa validity and duration of stay?",
        answer:
          "Visa validity is the window during which you must enter the country. Duration of stay is how many days you can remain after entering. For example, a visa valid for 6 months with a 30-day stay means you can enter any time within 6 months, but can only stay up to 30 days per visit.",
      },
      {
        question: "What happens if my visa application is rejected?",
        answer:
          "If your visa is refused, you will typically receive a refusal letter stating the reason. You may re-apply with stronger supporting documents, appeal the decision (if that option exists), or apply for a different visa category if applicable. Multiple refusals can affect future applications, so it is advisable to strengthen your application before reapplying.",
      },
      {
        question: "Do I need travel insurance for a visa application?",
        answer:
          "Many countries, particularly Schengen zone countries and some Asian nations, require proof of travel insurance as a mandatory part of the visa application. Even when not mandatory, carrying travel insurance is strongly recommended to cover medical emergencies, trip cancellations, and loss of documents.",
      },
    ],

    // --- Schema hints (for JSON-LD generation on the consuming frontend) ---
    schema_hints: {
      type:        "Service",
      name:        "Visa Required — Travel Visa Application Guide",
      description: "Comprehensive guide on how to apply for a travel visa for visa-required destinations. Includes requirements, fees, step-by-step process, and expert tips.",
      keywords: [
        "visa required",
        "visa application",
        "how to apply for visa",
        "visa required countries",
        "tourist visa requirements",
        "visa documents checklist",
        "visa processing time",
        "visa fee",
        "visa application process",
        "travel visa guide",
        "embassy visa application",
        "visa on arrival vs visa required",
        "visa required meaning",
        "visa rejection reasons",
        "visa tips",
      ],
    },

    // --- Meta ---
    last_updated: "2025-06",
    data_source:  "Eammu Holidays — IATA Accredited Travel & Visa Consultancy",
    disclaimer:
      "Visa requirements and fees are subject to change without notice. Always verify current requirements with the official embassy or consulate of your destination country before applying.",
  });
}