const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiError {
  message: string;
  statusCode?: number;
}

class AdminApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      }));
      throw new Error(error.message || 'An error occurred');
    }
    return response.json();
  }

  // Users API
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.isActive) searchParams.append('isActive', params.isActive);

    const response = await fetch(
      `${API_BASE_URL}/admin/users?${searchParams}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async getUserStatistics() {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/statistics`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async getUserById(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${id}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async updateUser(id: string, data: any) {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${id}`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse(response);
  }

  async updateUserRole(id: string, role: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${id}/role`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ role }),
      }
    );
    return this.handleResponse(response);
  }

  async toggleUserStatus(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${id}/toggle-status`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  async deleteUser(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${id}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // Competitions API
  async getCompetitions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    charityId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.charityId) searchParams.append('charityId', params.charityId);

    const response = await fetch(
      `${API_BASE_URL}/admin/competitions?${searchParams}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async getCompetitionStatistics() {
    const response = await fetch(
      `${API_BASE_URL}/admin/competitions/statistics`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async getCompetitionById(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/competitions/${id}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async updateCompetition(id: string, data: any) {
    const response = await fetch(
      `${API_BASE_URL}/admin/competitions/${id}`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse(response);
  }

  async updateCompetitionStatus(id: string, status: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/competitions/${id}/status`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    return this.handleResponse(response);
  }

  async deleteCompetition(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/competitions/${id}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // Charities API
  async getCharities(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isVerified?: string;
    isActive?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.isVerified) searchParams.append('isVerified', params.isVerified);
    if (params?.isActive) searchParams.append('isActive', params.isActive);

    const response = await fetch(
      `${API_BASE_URL}/admin/charities?${searchParams}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async getCharityStatistics() {
    const response = await fetch(
      `${API_BASE_URL}/admin/charities/statistics`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async getCharityById(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/charities/${id}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  async updateCharity(id: string, data: any) {
    const response = await fetch(
      `${API_BASE_URL}/admin/charities/${id}`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse(response);
  }

  async toggleCharityVerification(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/charities/${id}/toggle-verification`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  async updateCharityVerification(id: string, isVerified: boolean) {
    const response = await fetch(
      `${API_BASE_URL}/admin/charities/${id}/verification`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isVerified }),
      }
    );
    return this.handleResponse(response);
  }

  async toggleCharityActive(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/charities/${id}/toggle-active`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  async deleteCharity(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/admin/charities/${id}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }
}

export const adminApi = new AdminApiService();