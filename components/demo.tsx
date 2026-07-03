"use client";

import { Timeline } from "@/components/ui/timeline";
import { MapPin, FileText, CalendarDays, Ellipsis } from "lucide-react";

const timelineItems = [
  {
    date: "2026-03-08",
    title: "Sunachuri, Manahari, Nepal",
    description:
      "March 8–10, 2026 · Creative Bible Exposition training session conducted in Sunachuri village.",
    href: "assets/sunachuri-report.pdf",
    icon: <MapPin className="h-3 w-3" />,
  },
  {
    date: "2026-06-17",
    title: "Evangelical Christian College, Lalitpur-18, Nepal",
    description:
      "June 17–19, 2026 · Training held at Evangelical Christian College in Lalitpur.",
    href: "https://creative-bible-exposition.vercel.app/",
    icon: <FileText className="h-3 w-3" />,
  },
  {
    date: "2026-07-01",
    title: "The journey continues…",
    description:
      "More training sessions and reports will be added here as the ministry expands.",
    icon: <Ellipsis className="h-3 w-3" />,
  },
];

export default function TimelineReports() {
  return (
    <Timeline
      items={timelineItems}
      initialCount={5}
      showMoreText="Load More Reports"
      showLessText="Show Less"
      dotClassName="bg-gradient-to-b from-background to-muted ring-1 ring-border"
      lineClassName="border-l border-border"
      titleClassName="font-semibold"
    />
  );
}
