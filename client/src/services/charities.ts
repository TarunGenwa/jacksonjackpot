import apiClient from '@/lib/api';
import { Charity } from '@/types/api';

export const charitiesService = {
  getAll: async (): Promise<Charity[]> => {
    return apiClient.get<Charity[]>('/charities');
  },

  getVerified: async (): Promise<Charity[]> => {
    return apiClient.get<Charity[]>('/charities/verified');
  },

  getById: async (id: string): Promise<Charity> => {
    return apiClient.get<Charity>(`/charities/${id}`);
  }
};