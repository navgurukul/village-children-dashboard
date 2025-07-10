const BASE_URL = 'https://2595l28oa8.execute-api.ap-south-1.amazonaws.com/dev/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    mobile: string;
    role: string;
    isActive: boolean;
    loginAttempts: number;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
  expiresIn: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  role: string;
  block?: string;
  panchayat?: string;
  cluster?: string;
  isActive: boolean;
  loginAttempts: number;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  items: User[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
  };
}

interface CreateUserPayload {
  name: string;
  mobile: string;
  email: string;
  role: string;
  block?: string;
  panchayat?: string;
  cluster?: string;
}

interface UpdateUserPayload {
  name?: string;
  mobile?: string;
  email?: string;
  role?: string;
  block?: string;
  panchayat?: string;
  cluster?: string;
}

interface Village {
  id: string;
  name: string;
  district: string;
  panchayat: string;
  block: string;
  cluster: string;
  state: string;
  population: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VillagesResponse {
  items: Village[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
  };
}

interface CreateVillagePayload {
  name: string;
  district: string;
  panchayat: string;
  block: string;
  state: string;
  population: number;
}

interface UpdateVillagePayload {
  name?: string;
  district?: string;
  panchayat?: string;
  block?: string;
  cluster?: string;
  state?: string;
  population?: number;
}

interface Child {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  block: string;
  panchayat: string;
  cluster: string;
  para: string;
  villageId: string;
  motherName: string;
  fatherName: string;
  currentClass: string;
  educationStatus: string;
  schoolName: string;
  attendanceStatus: string;
  aadhaarNumber: string;
  caste: string;
  ageGroup: string;
  familyOccupation: string;
  motherTongue: string;
  schoolPara: string;
  fatherEducated: boolean;
  motherEducated: boolean;
  hasAadhaar: boolean;
  hasCasteCertificate: boolean;
  hasResidenceCertificate: boolean;
  hasDisability: boolean;
  isVulnerable: boolean;
  goesToSchool: boolean;
  parentsStatus: string;
  livesWithWhom: string;
  surveyedBy: string;
  surveyedAt: string;
  surveyVersion: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  searchText: string;
}

interface ChildrenResponse {
  items: Child[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
    queryTimeMs?: number;
  };
}

interface UpdateChildPayload {
  currentClass?: string;
  attendanceStatus?: string;
  age?: number;
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  block?: string;
  village?: string;
  fatherName?: string;
  motherName?: string;
  familyIncome?: string;
  caste?: string;
  medicalIssues?: string;
  educationStatus?: string;
  schoolName?: string;
  dropoutReason?: string;
  lastAttended?: string;
}

interface DashboardOverview {
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
  enrollmentRate: number;
  dropoutRate: number;
  genderBreakdown: {
    total: {
      boys: number;
      girls: number;
      others: number;
    };
    enrolled: {
      boys: number;
      girls: number;
    };
    dropout: {
      boys: number;
      girls: number;
    };
    neverEnrolled: {
      boys: number;
      girls: number;
    };
  };
  ageGroupBreakdown: {
    [key: string]: {
      total: number;
      enrolled: number;
      dropout: number;
      neverEnrolled: number;
    };
  };
  casteBreakdown: {
    [key: string]: {
      total: number;
      enrolled: number;
      dropout: number;
      neverEnrolled: number;
    };
  };
  vulnerableChildren: number;
  childrenWithDisability: number;
  recentSurveys: number;
  timeRange: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getDashboardOverview(params: {
    period?: string;
    block?: string;
    panchayat?: string;
    caste?: string;
    hasDisability?: boolean;
  } = {}): Promise<ApiResponse<DashboardOverview>> {
    const searchParams = new URLSearchParams();
    
    if (params.period) searchParams.append('period', params.period);
    if (params.block) searchParams.append('block', params.block);
    if (params.panchayat) searchParams.append('panchayat', params.panchayat);
    if (params.caste) searchParams.append('caste', params.caste);
    if (params.hasDisability !== undefined) searchParams.append('hasDisability', params.hasDisability.toString());

    const endpoint = `/dashboard/overview${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<DashboardOverview>(endpoint);
  }

  async getUsers(params: {
    role?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<UsersResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params.role) searchParams.append('role', params.role);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<UsersResponse>(endpoint);
  }

  async createUser(userData: CreateUserPayload): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: UpdateUserPayload): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getChildren(params: {
    block?: string;
    panchayat?: string;
    cluster?: string;
    villageId?: string;
    surveyedBy?: string;
    educationStatus?: string;
    gender?: string;
    caste?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<ChildrenResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params.block) searchParams.append('block', params.block);
    if (params.panchayat) searchParams.append('panchayat', params.panchayat);
    if (params.cluster) searchParams.append('cluster', params.cluster);
    if (params.villageId) searchParams.append('villageId', params.villageId);
    if (params.surveyedBy) searchParams.append('surveyedBy', params.surveyedBy);
    if (params.educationStatus) searchParams.append('educationStatus', params.educationStatus);
    if (params.gender) searchParams.append('gender', params.gender);
    if (params.caste) searchParams.append('caste', params.caste);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/children${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<ChildrenResponse>(endpoint);
  }

  async getVillages(params: {
    district?: string;
    panchayat?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<VillagesResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params.district) searchParams.append('district', params.district);
    if (params.panchayat) searchParams.append('panchayat', params.panchayat);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/villages${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<VillagesResponse>(endpoint);
  }

  async createVillage(villageData: CreateVillagePayload): Promise<ApiResponse<Village>> {
    return this.request<Village>('/villages', {
      method: 'POST',
      body: JSON.stringify(villageData),
    });
  }

  async updateVillage(villageId: string, villageData: UpdateVillagePayload): Promise<ApiResponse<Village>> {
    return this.request<Village>(`/villages/${villageId}`, {
      method: 'PUT',
      body: JSON.stringify(villageData),
    });
  }

  async deleteVillage(villageId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/villages/${villageId}`, {
      method: 'DELETE',
    });
  }

  async updateChild(childId: string, childData: UpdateChildPayload): Promise<ApiResponse<any>> {
    return this.request<any>(`/children/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(childData),
    });
  }

  async deleteChild(childId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/children/${childId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export type { 
  User, 
  CreateUserPayload, 
  UpdateUserPayload,
  LoginResponse, 
  UsersResponse,
  Village,
  VillagesResponse,
  CreateVillagePayload,
  UpdateVillagePayload,
  Child,
  ChildrenResponse,
  UpdateChildPayload,
  DashboardOverview
};
