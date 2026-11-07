export type Plan = {
  name: string;
  price: number;
  blurb: string;
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Starter",
    price: 0,
    blurb: "For trying it out.",
    features: ["3 habits", "7-day history"],
  },
  {
    name: "Pro",
    price: 6,
    blurb:
      "For people who track every day and want reminders that adapt to them.",
    features: ["Unlimited habits", "Full history", "Smart reminders"],
    featured: true,
  },
  {
    name: "Team",
    price: 15,
    blurb: "For study groups.",
    features: ["Shared goals", "Group streaks", "Admin tools"],
  },
];

export const features = [
  {
    icon: "🎯",
    title: "Tiny goals",
    text: "Break big goals into daily habits you can finish in five minutes.",
  },
  {
    icon: "🔥",
    title: "Streaks",
    text: "See your streak grow and keep it alive with gentle reminders.",
  },
  {
    icon: "📈",
    title: "Insights",
    text: "Weekly charts show what works and when you are most consistent.",
  },
];

export type Status = "on-track" | "at-risk" | "paused";

export const habits: {
  name: string;
  streak: number;
  done: number;
  status: Status;
}[] = [
  { name: "Read 20 pages", streak: 12, done: 86, status: "on-track" },
  { name: "Practice Tailwind", streak: 5, done: 64, status: "on-track" },
  { name: "Walk 8,000 steps", streak: 2, done: 38, status: "at-risk" },
  { name: "Meditate", streak: 0, done: 10, status: "paused" },
];
