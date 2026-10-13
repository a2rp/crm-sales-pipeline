export const dealStages = ["Qualification", "Discovery", "Proposal", "Negotiation", "Closed won", "Closed lost"];

export const dealOwners = ["Maya Chen", "Jordan Lee", "Alex Morgan", "Sam Rivera"];

export const initialDeals = [
  { id: "NS-2408", name: "Regional data platform", company: "Harborline Health", value: 84000, stage: "Negotiation", probability: 80, closeDate: "2026-10-23", owner: "Maya Chen", source: "Partner referral", nextStep: "Review security terms", lastActivity: "Today, 9:40 AM" },
  { id: "NS-2407", name: "Customer experience suite", company: "Lumen Hotels", value: 62500, stage: "Proposal", probability: 55, closeDate: "2026-11-04", owner: "Jordan Lee", source: "Website inquiry", nextStep: "Send revised proposal", lastActivity: "Today, 8:15 AM" },
  { id: "NS-2406", name: "Team analytics rollout", company: "Fieldnote Labs", value: 42000, stage: "Discovery", probability: 35, closeDate: "2026-11-12", owner: "Alex Morgan", source: "Conference", nextStep: "Map reporting needs", lastActivity: "Yesterday" },
  { id: "NS-2405", name: "Operations workspace", company: "Juniper & Co.", value: 38500, stage: "Qualification", probability: 20, closeDate: "2026-11-18", owner: "Sam Rivera", source: "Outbound", nextStep: "Confirm team size", lastActivity: "Yesterday" },
  { id: "NS-2404", name: "Secure file exchange", company: "Cove Financial", value: 78000, stage: "Negotiation", probability: 75, closeDate: "2026-10-29", owner: "Jordan Lee", source: "Executive referral", nextStep: "Align on legal review", lastActivity: "Oct 11" },
  { id: "NS-2403", name: "Inventory intelligence", company: "Northstar Retail Group", value: 51000, stage: "Proposal", probability: 55, closeDate: "2026-11-08", owner: "Maya Chen", source: "Website inquiry", nextStep: "Present team plan", lastActivity: "Oct 11" },
  { id: "NS-2402", name: "Field service pilot", company: "Atlas Equipment", value: 26500, stage: "Discovery", probability: 35, closeDate: "2026-11-21", owner: "Sam Rivera", source: "Partner referral", nextStep: "Book workflow review", lastActivity: "Oct 10" },
  { id: "NS-2401", name: "Customer data cleanup", company: "Marigold Home", value: 18000, stage: "Qualification", probability: 20, closeDate: "2026-12-02", owner: "Alex Morgan", source: "Outbound", nextStep: "Share discovery guide", lastActivity: "Oct 9" },
  { id: "NS-2398", name: "Growth planning workspace", company: "Evergreen Market", value: 36000, stage: "Closed won", probability: 100, closeDate: "2026-10-09", owner: "Maya Chen", source: "Conference", nextStep: "Plan kickoff", lastActivity: "Oct 9" },
  { id: "NS-2396", name: "Store network refresh", company: "Copper & Pine", value: 29000, stage: "Closed won", probability: 100, closeDate: "2026-10-06", owner: "Jordan Lee", source: "Partner referral", nextStep: "Schedule onboarding", lastActivity: "Oct 6" },
  { id: "NS-2394", name: "Legacy reporting upgrade", company: "Brightway Foods", value: 22000, stage: "Closed lost", probability: 0, closeDate: "2026-10-03", owner: "Alex Morgan", source: "Outbound", nextStep: "Revisit next quarter", lastActivity: "Oct 3" },
];

export const initialContacts = [
  { id: "C-301", name: "Priya Nair", title: "VP, Operations", company: "Harborline Health", email: "priya.nair@harborline.example", phone: "+1 (415) 555-0138", owner: "Maya Chen", lastContact: "Today", status: "Active" },
  { id: "C-302", name: "Elliot Park", title: "Director of Guest Experience", company: "Lumen Hotels", email: "elliot.park@lumen.example", phone: "+1 (206) 555-0194", owner: "Jordan Lee", lastContact: "Today", status: "Active" },
  { id: "C-303", name: "Nina Foster", title: "Head of Analytics", company: "Fieldnote Labs", email: "nina.foster@fieldnote.example", phone: "+1 (312) 555-0172", owner: "Alex Morgan", lastContact: "Yesterday", status: "Active" },
  { id: "C-304", name: "Mateo Silva", title: "COO", company: "Juniper & Co.", email: "mateo.silva@juniper.example", phone: "+1 (503) 555-0147", owner: "Sam Rivera", lastContact: "Oct 10", status: "New lead" },
  { id: "C-305", name: "Leah Brooks", title: "Chief Information Officer", company: "Cove Financial", email: "leah.brooks@cove.example", phone: "+1 (212) 555-0182", owner: "Jordan Lee", lastContact: "Oct 11", status: "Active" },
  { id: "C-306", name: "Owen Kim", title: "VP, Merchandising", company: "Northstar Retail Group", email: "owen.kim@northstarretail.example", phone: "+1 (617) 555-0163", owner: "Maya Chen", lastContact: "Oct 10", status: "Active" },
  { id: "C-307", name: "Chloe Martin", title: "Service Design Lead", company: "Atlas Equipment", email: "chloe.martin@atlas.example", phone: "+1 (720) 555-0116", owner: "Sam Rivera", lastContact: "Oct 9", status: "New lead" },
  { id: "C-308", name: "Grace Evans", title: "Founder", company: "Evergreen Market", email: "grace.evans@evergreen.example", phone: "+1 (408) 555-0112", owner: "Maya Chen", lastContact: "Oct 9", status: "Customer" },
];

export const initialTasks = [
  { id: "T-701", title: "Review the security addendum", kind: "Follow-up", dueDate: "2026-10-13", owner: "Maya Chen", dealId: "NS-2408", completed: false },
  { id: "T-702", title: "Send updated proposal", kind: "Email", dueDate: "2026-10-13", owner: "Jordan Lee", dealId: "NS-2407", completed: false },
  { id: "T-703", title: "Discovery call with Nina", kind: "Meeting", dueDate: "2026-10-14", owner: "Alex Morgan", dealId: "NS-2406", completed: false },
  { id: "T-704", title: "Confirm pilot locations", kind: "Call", dueDate: "2026-10-15", owner: "Sam Rivera", dealId: "NS-2402", completed: false },
  { id: "T-705", title: "Send kickoff checklist", kind: "Email", dueDate: "2026-10-12", owner: "Maya Chen", dealId: "NS-2398", completed: true },
];

export const formatCurrency = (amount, compact = false) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: compact ? "compact" : "standard",
  maximumFractionDigits: compact ? 1 : 0,
}).format(amount || 0);

export const formatDate = (value, options = { month: "short", day: "numeric" }) => {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleDateString("en-US", options);
};

export const toLocalISODate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
