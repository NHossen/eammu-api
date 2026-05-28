import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const limit = await checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json({ error: limit.message }, { status: limit.status });
  }

  return NextResponse.json({
    visa_type:        "e-visa",
    label:            "E-Visa",
    color:            "#00C2FF",
    description:      "Apply online before travel. No embassy visit required. You'll receive approval via email.",
    requirements: [
      "Valid passport (minimum 6 months validity)",
      "Digital passport photo (JPEG, white background, under 1MB)",
      "Valid email address for confirmation",
      "Credit or debit card for online payment",
      "Return or onward flight ticket",
      "Hotel booking confirmation",
      "Proof of sufficient funds",
    ],
    steps: [
      "Visit the official e-visa portal of your destination country.",
      "Create an account or proceed as a guest applicant.",
      "Fill out the online application form with personal and travel details.",
      "Upload required documents (passport scan, photo).",
      "Pay the e-visa fee online using a credit/debit card.",
      "Submit the application and note your application reference number.",
      "Wait for approval email (usually 24–72 hours).",
      "Download and print your e-visa approval letter.",
      "Present the printed e-visa at the port of entry.",
    ],
    fee:              "USD 20–80 (varies by country and nationality)",
    processing_time:  "24–72 hours (some instant approvals)",
    validity:         "Usually 30–90 days from approval date",
    tips: [
      "Only apply through the official government portal — avoid third-party sites charging extra fees.",
      "Apply at least 72 hours before your travel date.",
      "Print multiple copies of your e-visa approval.",
      "Check if your nationality is eligible for e-visa before applying.",
    ],
    related_links: {
      check_passport:  "https://api.eammu.com/api/v1/passport",
      country_details: "https://api.eammu.com/api/v1/countries",
    },
  });
}