import { create } from 'zustand';
import type { Quest } from '../types/api';
import { questApi } from '../services/api';

interface QuestState {
  quests: Quest[];
  currentQuest: Quest | null;
  isLoading: boolean;
  error: string | null;
  fetchQuests: () => Promise<void>;
  fetchQuestById: (id: string) => Promise<void>;
  createQuest: (data: Partial<Quest>) => Promise<void>;
  updateQuest: (id: string, data: Partial<Quest>) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
  clearError: () => void;
  setCurrentQuest: (quest: Quest | null) => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  currentQuest: null,
  isLoading: false,
  error: null,

  fetchQuests: async () => {
    set({ isLoading: true, error: null });
    try {
      const quests = await questApi.getAll();
      set({ quests, isLoading: false, error: null });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch quests';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchQuestById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const quest = await questApi.getById(id);
      set({ currentQuest: quest, isLoading: false, error: null });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch quest';
      set({ error: errorMessage, isLoading: false, currentQuest: null });
    }
  },

  createQuest: async (data: Partial<Quest>) => {
    set({ isLoading: true, error: null });
    try {
      const newQuest = await questApi.create(data);
      set((state) => ({ 
        quests: [newQuest, ...state.quests], 
        isLoading: false, 
        error: null 
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create quest';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateQuest: async (id: string, data: Partial<Quest>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedQuest = await questApi.update(id, data);
      set((state) => ({
        quests: state.quests.map((q) => (q.id === id ? updatedQuest : q)),
        currentQuest: state.currentQuest?.id === id ? updatedQuest : state.currentQuest,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update quest';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteQuest: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await questApi.delete(id);
      set((state) => ({
        quests: state.quests.filter((q) => q.id !== id),
        currentQuest: state.currentQuest?.id === id ? null : state.currentQuest,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete quest';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  setCurrentQuest: (quest: Quest | null) => set({ currentQuest: quest }),
}));

