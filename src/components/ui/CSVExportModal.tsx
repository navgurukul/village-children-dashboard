import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Loader2, Download } from 'lucide-react';
import { generateExportJobKey, findExistingJob, ExportFilters } from '@/utils/exportDeduplication';

interface CSVExportModalProps {
  open: boolean;
  onClose: () => void;
  onExportCurrentPage: () => void;
  onExportAllData: () => Promise<void>;
  currentPageCount?: number;
  totalCount?: number;
  jobType: 'children-export' | 'gram-panchayat-export';
  currentFilters?: ExportFilters; 
}

const CSVExportModal = ({
  open,
  onClose,
  onExportCurrentPage,
  onExportAllData,
  currentPageCount,
  totalCount,
  jobType,
  currentFilters = {},
}: CSVExportModalProps) => {
  const [exportType, setExportType] = useState<'current' | 'all'>('current');
  const [isExporting, setIsExporting] = useState(false);
  const [existingJob, setExistingJob] = useState<any>(null);

  // Check for existing jobs when modal opens
  React.useEffect(() => {
    if (open && exportType === 'all') {
      const jobKey = generateExportJobKey(jobType, 'all', currentFilters);
      const existing = findExistingJob(jobKey);
      setExistingJob(existing);
    } else {
      setExistingJob(null);
    }
  }, [open, exportType, jobType, currentFilters]);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (exportType === 'all' && existingJob) {
        if (existingJob.status === 'completed' && existingJob.downloadUrl) {
          // Silently download existing file without any notification
          window.open(existingJob.downloadUrl, '_blank');
          onClose();
          return;
        } else if (existingJob.status === 'processing' || existingJob.status === 'pending') {
          // Silently close modal - job already in progress
          onClose();
          return;
        }
      }

      if (exportType === 'current') {
        onExportCurrentPage();
        onClose();
      } else {
        await onExportAllData();
        onClose();
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const alertMessage =
    jobType === 'children-export'
      ? "The exported data includes survey responses recorded until the previous day. Real-time updates will appear in tomorrow's export."
      : "The exported data reflects the most recent records in real time.";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Data to CSV</DialogTitle>
          <DialogDescription>
            Choose which data you'd like to export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={exportType} onValueChange={(value) => setExportType(value as 'current' | 'all')}>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="current" id="current" />
              <Label htmlFor="current" className="font-normal cursor-pointer flex-1">
                <span>Export Current Page</span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal cursor-pointer flex-1">
                <span>Export All Data</span>
              </Label>
            </div>
          </RadioGroup>

          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              {alertMessage}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isExporting ? 'Processing...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVExportModal;
