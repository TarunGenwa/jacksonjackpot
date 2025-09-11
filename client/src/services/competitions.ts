import apiClient from '@/lib/api';
import { Competition } from '@/types/api';

export const competitionsService = {
  getActive: async (): Promise<Competition[]> => {
    return apiClient.get<Competition[]>('/competitions/active');
  },

  getUpcoming: async (): Promise<Competition[]> => {
    return apiClient.get<Competition[]>('/competitions/upcoming');
  },

  getAll: async (params?: { status?: string; charityId?: string }): Promise<Competition[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.charityId) searchParams.append('charityId', params.charityId);
    
    const endpoint = `/competitions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiClient.get<Competition[]>(endpoint);
  },

  getById: async (id: string): Promise<Competition> => {
    return apiClient.get<Competition>(`/competitions/${id}`);
  },
};