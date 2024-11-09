export interface Incident {
  id: string;
  description: string;
  time: string;
  location: string;
  action: string;
}

export const POSTS = [
  "Security Account Manager",
  "CAL1-Badge Check",
  "CAL1-Bag Check",
  "CAL1-Rear Entrance",
  "CAL1-Receiving(East Gate)",
  "CAL1-Shipping(West Gate)",
  "CAL1-Supervisor",
  "CAL2-Badge Check",
  "CAL2-Bag Check",
  "CAL2-Supervisor",
  "CAL2-Receiving(North Gate)",
  "CAL2-Shipping(South Gate)",
] as const;

export type Post = (typeof POSTS)[number];

export interface DutyLog {
  _id: string;
  name: string;
  badgeNumber: string;
  post: Post;
  startTime: string;
  endTime: string | null;
  status: "active" | "completed";
  incidents: Incident[];
}
