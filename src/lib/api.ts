const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  assignedBlock?: string;
  assignedGramPanchayat?: string;
  gramPanchayat?: string;
  isActive: boolean;
  loginAttempts: number;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
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
  gramPanchayat: string;
  state: string;
  population: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlockGramPanchayatData {
  block: string;
  gramPanchayat: Array<{
    name: string;
    isAssigned: boolean;
  }>;
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
  gramPanchayat: string;
  block: string;
  state: string;
  population: number;
}

interface UpdateVillagePayload {
  name?: string;
  district?: string;
  gramPanchayat?: string;
  block?: string;
  cluster?: string;
  state?: string;
  population?: number;
}

interface Child {
  id: string;
  basicInfo: {
    fullName: string;
    age: number;
    dateOfBirth?: string;
    gender: string;
    para: string;
    gramPanchayat?: string;
    cluster: string;
    block: string;
    motherTongue: string;
  };
  familyInfo: {
    motherName: string;
    fatherName: string;
    motherEducated: boolean;
    fatherEducated: boolean;
    familyOccupation: string;
    caste: string;
    parentsStatus: string;
    livesWithWhom: string;
  };
  economicInfo: {
    rationCardType?: string;
    rationCardNumber?: string;
    economicStatus?: string;
  };
  educationInfo: {
    goesToSchool: boolean;
    schoolName: string;
    currentClass: string;
    attendanceStatus: string;
    educationStatus: string;
    educationCategory: string;
  };
  documentsInfo: {
    hasCasteCertificate: boolean;
    hasResidenceCertificate: boolean;
    hasAadhaar: boolean;
    aadhaarNumber: string;
  };
  healthInfo: {
    hasDisability: boolean;
  };
  derivedFields: {
    educationStatus: string;
    isVulnerable: boolean;
    ageGroup: string;
    riskFactors?: string[];
    priorityLevel?: string;
    economicStatus?: string;
    searchText: string;
  };
  surveyMeta: {
    villageId: string;
    surveyedBy: string;
    surveyedAt: string;
    surveyVersion: string;
    lastUpdatedAt: string;
    lastUpdatedBy: string;
  };
  auditInfo: {
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface ChildrenResponse {
  children: Child[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
    hasMore: boolean;
    queryTimeMs?: number;
  };
}

interface UpdateChildPayload {
  villageId: string;
  surveyData: {
    "section-1": {
      "q1_1": string; // fullName
      "q1_2": string; // age
      "q1_3": string; // dateOfBirth
      "q1_4": string; // gender
      "q1_5": string; // para
      "q1_6": string; // panchayat
      "q1_7": string; // cluster
      "q1_8": string; // block
      "q1_9": string; // motherTongue
      "q1_10": string; // motherName
      "q1_11": string; // fatherName
      "q1_12": string; // motherEducated
      "q1_13": string; // fatherEducated
    };
    "section-2": {
      "q2_1": string; // familyOccupation
      "q2_2": string; // caste
      "q2_3": string; // parentsStatus
      "q2_4": string; // livesWithWhom
      "q2_5": string | null;
    };
    "section-3": {
      "q3_1": string; // economicStatus
      "q3_2": string; // aadhaarNumber
    };
    "section-4": {
      "q4_1": string; // goesToSchool
      "q4_2": string | null;
      "q4_3": string | null;
      "q4_4": string | null;
      "q4_5": string; // educationStatus
      "q4_6": string; // currentClass
      "q4_7": string[]; // dropoutReasons
      "q4_8": string | null;
    };
    "section-5": {
      "q5_1": string; // hasAadhaar
      "q5_2": string; // hasCasteCertificate
      "q5_3": string; // hasResidenceCertificate
      "q5_4": string; // aadhaarNumber
    };
    "section-6": {
      "q6_1": string; // hasDisability
      "q6_2": string | null;
    };
  };
}

interface DashboardSummary {
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
  enrollmentRate: number;
  dropoutRate: number;
  childrenWithDisability: number;
  recentSurveyFindings: {
    dropouts: {
      total: number;
      boys: number;
      girls: number;
    };
    enrollments: {
      total: number;
      boys: number;
      girls: number;
    };
    neverEnrolled: {
      total: number;
      boys: number;
      girls: number;
    };
  };
  longDropoutPeriods: {
    moreThan1Year: number;
    sixToTwelveMonths: number;
    threeToSixMonths: number;
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
    const headers: Record<string, string> = {};
    
    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

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
      // Parse error response and throw it so frontend can access error details
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      throw { response: { status: response.status, data: errorData } };
    }

    return response.json();
  }

  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getDashboardSummary(params: {
    block?: string;
    gramPanchayat?: string;
    villageId?: string;
  } = {}): Promise<ApiResponse<DashboardSummary>> {
    const searchParams = new URLSearchParams();
    
    if (params.block) searchParams.append('block', params.block);
    if (params.gramPanchayat) searchParams.append('gramPanchayat', params.gramPanchayat);
    if (params.villageId) searchParams.append('villageId', params.villageId);

    const endpoint = `/dashboard/summary${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<DashboardSummary>(endpoint);
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

  async bulkUploadVillages(formData: FormData): Promise<ApiResponse<any>> {
    return this.request<any>('/villages/bulk-upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header, let browser set it with boundary
      },
    });
  }

  async bulkUploadUsers(formData: FormData): Promise<ApiResponse<any>> {
    return this.request<any>('/users/bulk-upload/balmitra', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header, let browser set it with boundary
      },
    });
  }

  async getBlocksGramPanchayats(): Promise<ApiResponse<BlockGramPanchayatData[]>> {
    return this.request<BlockGramPanchayatData[]>('/villages/blocks-gramPanchayats');
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

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request<any>('/users/profile', {
      method: 'GET',
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
  DashboardSummary,
  BlockGramPanchayatData
};
