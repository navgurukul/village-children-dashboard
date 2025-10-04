const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { Survey } from '@/types/survey';

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
   gramPanchayats: string[];
}

interface DistrictGramPanchayatData {
  district: string;
   gramPanchayats: string[];
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
      q1_1?: string; // Child's full name
      q1_2?: string; // House number
      q1_3?: object; // Child's DOB
      q1_4?: string; // Child's gender
      q1_5?: string; // Development block
      q1_6?: string; // Gram Panchayat name
      q1_7?: string; // Which para (tola/place) does the child live in?
      q1_8?: string; // Family's mother tongue or dialect
      q1_8_other?: string; // Other mother tongue specification
      q1_9?: string; // Child's mother's name
      q1_10?: string; // Child's father's name
      q1_11?: string; // Is the child's mother educated?
      q1_12?: string; // Is the child's father educated?
      q1_13?: string;
      q1_new_house?: string; // Legacy house number field
    };
    "section-2"?: {
      q2_1?: string; // Head of family's occupation
      q2_2?: string; // Please specify the occupation
      q2_3?: string; // Caste category
      q2_4?: string; // Please specify the caste
      q2_5?: string; // Current status of child's parents
      q2_6?: string; // Lives with whom
      q2_7?: string; // Other specification for lives with whom
    };
    "section-3"?: {
      q3_1?: string; // Family's economic classification (type of ration card)
      q3_2?: string; // Ration card number
    };
    "section-4"?: {
      q4_1?: string; // Does the child go to school?
      q4_2?: string; // If yes, what is the full name of the school and in which para is the school located?
      q4_3?: string; // Does the child go to school from home or live in a hostel?
      q4_4?: string; // What class is the child currently studying in?
      q4_5?: string; // Child's school attendance status
      q4_6?: string; // If the child does not go to school, which category does he/she fall into?
      q4_7?: string; // If the child is a school dropout, up to which class did he/she study?
      q4_8?: string | string[]; // Reason for dropping out of school
      q4_9?: string; // Please specify the reason for dropout
      q4_10?: string | string[]; // If the child has never enrolled, what is the reason for not enrolling in school?
      q4_11?: string; // Other reason for never enrolling
    };
    "section-5"?: {
      q5_1?: string; // Does the child have a caste certificate?
      q5_2?: string; // Does the child have a residence certificate?
      q5_3?: string; // Does the child have an Aadhaar card?
      q5_4?: string; // If yes, Write child's Aadhaar Number
    };
    "section-6"?: {
      q6_1?: string; // Does the child fall under any category of disability?
      q6_2?: string | string[]; // If yes, what type of disability is it?
      q6_3?: string; // Other disability specification
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
      "q1_1": string; // Child's full name
      "q1_2": string; // House number
      "q1_3": string; // Child's DOB
      "q1_4": string; // Child's gender
      "q1_5": string; // Development block
      "q1_6": string; // Gram Panchayat name
      "q1_7": string; // Para (tola/place)
      "q1_8": string; // Family's mother tongue
      "q1_8_other": string | null; // Other mother tongue specification
      "q1_9": string; // Child's mother's name
      "q1_10": string; // Child's father's name
      "q1_11": string; // Is mother educated
      "q1_12": string; // Is father educated
      "q1_13": string | null; // Additional field if needed
    };
    "section-2": {
      "q2_1": string; // Head of family's occupation
      "q2_2": string | null; // Specific occupation
      "q2_3": string; // Caste category
      "q2_4": string | null; // Specific caste
      "q2_5": string; // Parents status
      "q2_6": string; // Lives with whom
      "q2_7": string | null; // Other specification for lives with
    };
    "section-3": {
      "q3_1": string; // Family's economic classification (type of ration card)
      "q3_2": string; // Ration card number
    };
    "section-4": {
      "q4_1": string; // Does the child go to school?
      "q4_2": string | null; // If yes, what is the full name of the school and in which para is the school located?
      "q4_3": string | null; // Does the child go to school from home or live in a hostel?
      "q4_4": string | null; // What class is the child currently studying in?
      "q4_5": string; // Child's school attendance status
      "q4_6": string; // If the child does not go to school, which category does he/she fall into?
      "q4_7": string | null; // If the child is a school dropout, up to which class did he/she study?
      "q4_8": string[] | string | null; // Reason for dropping out of school
      "q4_9": string | null; // Please specify the reason for dropout
      "q4_10": string[] | string | null; // If the child has never enrolled, what is the reason for not enrolling in school?
      "q4_11": string | null; // Other reason for never enrolling
    };
    "section-5": {
      "q5_1": string; // Does the child have a caste certificate?
      "q5_2": string; // Does the child have a residence certificate?
      "q5_3": string; // Does the child have an Aadhaar card?
      "q5_4": string; // If yes, Write child's Aadhaar Number
    };
    "section-6": {
      "q6_1": string; // Does the child fall under any category of disability?
      "q6_2": string | string[] | null; // If yes, what type of disability is it?
      "q6_3": string | null; // Other disability specification
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
      other: number;
    };
    enrollments: {
      total: number;
      boys: number;
      girls: number;
      other: number;
    };
    neverEnrolled: {
      total: number;
      boys: number;
      girls: number;
      other: number;
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
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ApiResponse<DashboardSummary>> {
    const searchParams = new URLSearchParams();
    
    if (params.block) searchParams.append('block', params.block);
    if (params.gramPanchayat) searchParams.append('gramPanchayat', params.gramPanchayat);
    if (params.villageId) searchParams.append('villageId', params.villageId);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const endpoint = `/dashboard/summary${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<DashboardSummary>(endpoint);
  }

  async getSurveyQuestions(): Promise<ApiResponse<Survey>> {
    return this.request<Survey>('/surveys/questions');
  }

  async getDashboardOverview(params: {
    block?: string;
    gramPanchayat?: string;
    villageId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    
    if (params.block) searchParams.append('block', params.block);
    if (params.gramPanchayat) searchParams.append('gramPanchayat', params.gramPanchayat);
    if (params.villageId) searchParams.append('villageId', params.villageId);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const endpoint = `/dashboard/overview${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<any>(endpoint);
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
    gramPanchayat?: string; 
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
    if (params.gramPanchayat) searchParams.append('gramPanchayat', params.gramPanchayat);
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

  async bulkUploadGramPanchayats(formData: FormData): Promise<ApiResponse<any>> {
    return this.request<any>('/gramPanchayats/bulk-upload', {
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

  async createGramPanchayat(payload: { name: string; block: string; villages: { name: string; paras: { name: string }[] }[] }): Promise<ApiResponse<any>> {
    return this.request<any>('/gramPanchayats', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateGramPanchayat(gpId: string, payload: { name: string; block: string; villages: { name: string; paras: { name: string }[] }[] }): Promise<ApiResponse<any>> {
    return this.request<any>(`/gramPanchayats/${gpId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
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
