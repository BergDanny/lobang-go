import type { Quest } from '../types/api';
import { formatTime } from './time-utils';

/**
 * Maps backend Quest format to frontend QuestCard format
 */
export interface QuestCardData {
  id: string;
  title: string;
  description: string;
  locationFrom: string;
  locationTo: string;
  bounty: number;
  xp: number;
  category: string;
  deadline: string;
  status: "open" | "assigned" | "completed";
  difficulty: string;
}

/**
 * Calculate XP based on bounty (10 XP per RM)
 */
function calculateXP(bounty: number): number {
  return Math.round(bounty * 10);
}

/**
 * Calculate difficulty based on bounty
 */
function calculateDifficulty(bounty: number): string {
  if (bounty < 5) return "Easy";
  if (bounty < 10) return "Medium";
  return "Hard";
}

/**
 * Map backend Quest to frontend QuestCard format
 */
export function mapQuestToCard(quest: Quest): QuestCardData {
  // Ensure bounty is a number
  const bounty = typeof quest.bounty === 'number' ? quest.bounty : parseFloat(String(quest.bounty)) || 0;
  
  return {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    locationFrom: quest.location_from || "Not specified",
    locationTo: quest.location_to,
    bounty: bounty,
    xp: calculateXP(bounty),
    category: quest.category,
    deadline: formatTime(quest.deadline),
    status: quest.status === "open" ? "open" : quest.status === "in_progress" ? "assigned" : "completed",
    difficulty: calculateDifficulty(bounty),
  };
}

