import apiClient from '@/lib/api';
import { Competition } from '@/types/api';

export const competitionsService = {
  getActive: async (): Promise<Competition[]> => {
    return apiClient.get<Competition[]>('/competitions/active');
  },

  getUpcoming: async (): Promise<Competition[]> => {
    return apiClient.get<Competition[]>('/competitions/upcoming');
  },

  getAll: async (params?: { status?: string; charityId?: string; type?: string }): Promise<Competition[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.charityId) searchParams.append('charityId', params.charityId);
    if (params?.type) searchParams.append('type', params.type);

    const endpoint = `/competitions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiClient.get<Competition[]>(endpoint);
  },

  getByType: async (type: string): Promise<Competition[]> => {
    return apiClient.get<Competition[]>(`/competitions?type=${type}`);
  },

  getById: async (id: string): Promise<Competition> => {
    return apiClient.get<Competition>(`/competitions/${id}`);
  },
};