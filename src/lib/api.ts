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

interface Para {
  id: string;
  name: string;
  district: string;
  gramPanchayat?: string;
  gramPanchayats?: string[];
  blocks?: string[];
  state: string;
  totalPopulation?: number;
  population?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalChildren?: number;
  enrolledChildren?: number;
  dropoutChildren?: number;
  neverEnrolledChildren?: number;
  assignedBalMitra?: string;
}

interface GramPanchayat {
  id: string;
  name: string;
  district: string;
  block?: string; // Single block property
  blocks?: string[]; // Array of blocks for backward compatibility
  state?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  totalChildren?: number;
  enrolledChildren?: number;
  dropoutChildren?: number;
  neverEnrolledChildren?: number;
  totalParas?: number;
  assignedBalMitra?: string; // Added assignedBalMitra field
}

interface BlockGramPanchayatData {
  block: string;
  gramPanchayat: Array<{
    name: string;
    isAssigned: boolean;
  }>;
}

interface DistrictGramPanchayatData {
  district: string;
  gramPanchayat: Array<{
    name: string;
    isAssigned: boolean;
  }>;
}

interface BlockGramPanchayatsItem {
  block: string;
  gramPanchayats: string[];
}

interface GramPanchayatResponse {
  gramPanchayats?: string[];
  blocks?: string[];
  blockGramPanchayats?: {
    block: string;
    gramPanchayats: string[];
  }[];
  total?: number;
  filters?: {
    district?: string | null;
  };
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
  surveyData?: {
    "section-1": {
      q1_1?: string; // fullName
      q1_3?: object;
      q1_4?: string; // gender
      q1_5?: string; // para/village
      q1_6?: string; // gram panchayat
      q1_8?: string; // block
      q1_9?: string; // mother tongue
      q1_9_other?: string; // other mother tongue specification
      q1_10?: string; // mother name
      q1_11?: string; // father name
      q1_12?: string; // mother education
      q1_13?: string; // father education
      q1_new_house?: string; // house number
    };
    "section-2"?: {
      q2_1?: string; // family occupation
      q2_1_other?: string; // other occupation specification
      q2_2?: string; // caste
      q2_2_other?: string; // other caste specification
      q2_3?: string; // caste category
      q2_4?: string; // caste specification (for "other" caste)
      q2_5?: string; // parents status
      q2_6?: string; // lives with whom
      q2_7?: string; // other specification for lives with whom
    };
    "section-3"?: {
      q3_1?: string; // ration card type
      q3_2?: string; // ration card number
    };
    "section-4"?: {
      q4_1?: string; // goes to school
      q4_2?: string; // school name
      q4_3?: string; // attendance status
      q4_4?: string; // current class
      q4_5?: string; // attendance status
      q4_6?: string; // education category (dropout/never enrolled)
      q4_7?: string; // last class studied (for dropouts)
      q4_8?: string | string[]; // dropout reasons
      q4_9?: string; // other dropout reason
      q4_10?: string | string[]; // never enrolled reasons
      q4_11?: string; // other never enrolled reason
    };
    "section-5"?: {
      q5_1?: string; // has caste certificate
      q5_2?: string; // has residence certificate
      q5_3?: string; // has aadhaar
      q5_4?: string; // aadhaar number
    };
    "section-6"?: {
      q6_1?: string; // has disability
      q6_2?: string | string[]; // disability types
      q6_3?: string; // other disability specification
    };
  };
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
      "q1_9_other": string | null; // other mother tongue specification
      "q1_10": string; // motherName
      "q1_11": string; // fatherName
      "q1_12": string; // motherEducated
      "q1_13": string; // fatherEducated
    };
    "section-2": {
      "q2_1": string; // familyOccupation
      "q2_1_other": string | null; // other occupation
      "q2_2": string; // caste
      "q2_2_other": string | null; // other caste
      "q2_3": string; // parentsStatus
      "q2_4": string; // livesWithWhom
      "q2_4_other": string | null; // other lives with whom
      "q2_5": string | null;
    };
    "section-3": {
      "q3_1": string; // economicStatus
      "q3_2": string; // aadhaarNumber
    };
    "section-4": {
      "q4_1": string; // goesToSchool
      "q4_2": string | null; // school name
      "q4_3": string | null;
      "q4_4": string | null; // current class
      "q4_5": string; // attendance status
      "q4_6": string; // education category (dropout/never enrolled)
      "q4_7": string | null; // last class studied
      "q4_8": string[] | string | null; // dropout reasons
      "q4_9": string | null; // other dropout reason
      "q4_10": string[] | string | null; // never enrolled reasons
      "q4_11": string | null; // other never enrolled reason
    };
    "section-5": {
      "q5_1": string; // hasCasteCertificate
      "q5_2": string; // hasResidenceCertificate
      "q5_3": string; // hasAadhaar
      "q5_4": string; // aadhaarNumber
    };
    "section-6": {
      "q6_1": string; // hasDisability
      "q6_2": string | string[] | null; // disability types
      "q6_3": string | null; // other disability specification
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
      //  Parse error response and throw it so frontend can access error details
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
    search?: string;
  } = {}): Promise<ApiResponse<UsersResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params.role) searchParams.append('role', params.role);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

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
    search?: string;
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
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/children${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<ChildrenResponse>(endpoint);
  }

  async getVillages(params: {
    district?: string;
    gramPanchayat?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<ApiResponse<VillagesResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params.district) searchParams.append('district', params.district);
    if (params.gramPanchayat) searchParams.append('gramPanchayat', params.gramPanchayat);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

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
    return this.request<BlockGramPanchayatData[]>('/paras/blocks-gramPanchayats');
  }

  async getDistrictGramPanchayats(district?: string): Promise<ApiResponse<GramPanchayatResponse | BlockGramPanchayatsItem[]>> {
    const searchParams = new URLSearchParams();
    if (district) searchParams.append('district', district);
    
    const endpoint = `/paras/blocks-gramPanchayats${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<GramPanchayatResponse | BlockGramPanchayatsItem[]>(endpoint);
  }

  async getParas(params: {
    district?: string;
    gramPanchayat?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<ApiResponse<{items: Para[], pagination: {page: number, limit: number, totalCount: number, hasMore: boolean}}>> {
    const searchParams = new URLSearchParams();
    
    if (params.district) searchParams.append('district', params.district);
    if (params.gramPanchayat) searchParams.append('gramPanchayat', params.gramPanchayat);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const endpoint = `/paras${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<{items: Para[], pagination: {page: number, limit: number, totalCount: number, hasMore: boolean}}>(endpoint);
  }

  async getGramPanchayats(params: {
    district?: string;
    block?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<ApiResponse<{items: GramPanchayat[], pagination: {page: number, limit: number, totalCount: number, hasMore: boolean}}>> {
    const searchParams = new URLSearchParams();
    
    if (params.district) searchParams.append('district', params.district);
    if (params.block) searchParams.append('block', params.block);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    try {
      const endpoint = `/paras/gramPanchayat${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      console.log('Making API request to:', BASE_URL + endpoint);
      const response = await this.request<{items: GramPanchayat[], pagination: {page: number, limit: number, totalCount: number, hasMore: boolean}}>(endpoint);
      console.log('API response received:', response);
      
      // Ensure data is in expected format
      if (response.success && (!response.data.items || !Array.isArray(response.data.items))) {
        console.error('API returned unexpected format:', response);
        return {
          ...response,
          data: {
            items: [],
            pagination: {
              page: params.page || 1,
              limit: params.limit || 20,
              totalCount: 0,
              hasMore: false
            }
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Error in getGramPanchayats:', error);
      throw error;
    }
  }

  async createPara(paraData: {
    name: string;
    district: string;
    gramPanchayats: string[];
    blocks: string[];
    state: string;
    totalPopulation: number;
  }): Promise<ApiResponse<Para>> {
    return this.request<Para>('/paras', {
      method: 'POST',
      body: JSON.stringify(paraData),
    });
  }

  async updatePara(paraId: string, paraData: {
    name?: string;
    district?: string;
    gramPanchayats?: string[];
    blocks?: string[];
    state?: string;
    totalPopulation?: number;
  }): Promise<ApiResponse<Para>> {
    return this.request<Para>(`/paras/${paraId}`, {
      method: 'PUT',
      body: JSON.stringify(paraData),
    });
  }

  async deletePara(paraId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/paras/${paraId}`, {
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
  BlockGramPanchayatData,
  DistrictGramPanchayatData,
  GramPanchayatResponse,
  BlockGramPanchayatsItem,
  Para,
  GramPanchayat
};
