// Export deduplication utilities
import { ExportJob } from '@/components/NotificationCenter';

export interface ExportFilters {
  blockFilter?: string;
  gramPanchayatFilter?: string;
  statusFilter?: string;
  searchTerm?: string;
}

export interface EnhancedExportJob extends ExportJob {
  jobKey: string;
  scope: 'current' | 'all';
  filters: ExportFilters;
  expiresAt: Date;
}

// Generate unique key for export job based on type, scope, filters, and data cycle
export const generateExportJobKey = (
  type: 'children-export' | 'gram-panchayat-export',
  scope: 'current' | 'all',
  filters: ExportFilters
): string => {
  const now = new Date();
  let dataDate = new Date();
  
  // If before 3 AM, use previous day's data cycle since data refreshes at 3 AM
  if (now.getHours() < 3) {
    dataDate.setDate(dataDate.getDate() - 1);
  }
  
  const dataCycle = dataDate.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Normalize filters to avoid false duplicates
  const normalizedFilters = {
    blockFilter: filters.blockFilter === 'all' ? undefined : filters.blockFilter,
    gramPanchayatFilter: filters.gramPanchayatFilter === 'all' ? undefined : filters.gramPanchayatFilter,
    statusFilter: filters.statusFilter === 'all' ? undefined : filters.statusFilter,
    searchTerm: filters.searchTerm?.trim() || undefined
  };
  
  // Remove undefined values
  const cleanFilters = Object.fromEntries(
    Object.entries(normalizedFilters).filter(([_, value]) => value !== undefined)
  );
  
  const filtersString = JSON.stringify(cleanFilters);
  const encoded = btoa(filtersString);
  
  return `${type}_${scope}_${dataCycle}_${encoded}`;
};

// Find existing job with same key that's still valid
export const findExistingJob = (jobKey: string): EnhancedExportJob | null => {
  try {
    const jobs = JSON.parse(localStorage.getItem('export_jobs') || '[]') as EnhancedExportJob[];
    const now = new Date();
    
    return jobs.find((job: EnhancedExportJob) => 
      job.jobKey === jobKey && 
      new Date(job.expiresAt) > now &&
      (job.status === 'completed' || job.status === 'processing' || job.status === 'pending')
    ) || null;
  } catch (error) {
    console.error('Error finding existing job:', error);
    return null;
  }
};

// Create enhanced export job with deduplication data
export const createEnhancedExportJob = (
  job: ExportJob,
  jobKey: string,
  scope: 'current' | 'all',
  filters: ExportFilters
): EnhancedExportJob => {
  const expiresAt = new Date();
  
  // Set expiry to next 3 AM (when data refreshes)
  if (expiresAt.getHours() >= 3) {
    // If current time is after 3 AM today, expire tomorrow at 3 AM
    expiresAt.setDate(expiresAt.getDate() + 1);
  }
  expiresAt.setHours(3, 0, 0, 0); // 3:00 AM
  
  return {
    ...job,
    jobKey,
    scope,
    filters,
    expiresAt
  };
};

// Clean up expired jobs from localStorage
export const cleanupExpiredJobs = (): void => {
  try {
    const jobs = JSON.parse(localStorage.getItem('export_jobs') || '[]') as EnhancedExportJob[];
    const now = new Date();
    
    const validJobs = jobs.filter((job: EnhancedExportJob) => {
      if (!job.expiresAt) return true; // Keep jobs without expiry (backward compatibility)
      return new Date(job.expiresAt) > now;
    });
    
    if (validJobs.length !== jobs.length) {
      localStorage.setItem('export_jobs', JSON.stringify(validJobs));
    }
  } catch (error) {
    console.error('Error cleaning up expired jobs:', error);
  }
};
