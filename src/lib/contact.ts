export const contactInterests = [
  { value: "new-club-website", label: "Launching a new club website" },
  { value: "replace-club-website", label: "Replacing our current club website" },
  { value: "learn-about-onzio", label: "Learning more about Onzio" },
  { value: "something-else", label: "Something else" },
] as const;

export type ContactInterest = (typeof contactInterests)[number]["value"];

export const contactInterestLabels = Object.fromEntries(
  contactInterests.map((interest) => [interest.value, interest.label]),
) as Record<ContactInterest, string>;
