import React from 'react';
import { Bell, Download, CheckCircle, XCircle, Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface ExportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileName?: string;
  downloadUrl?: string;
  createdAt: Date;
  error?: string;
  progress?: number;
}

interface NotificationCenterProps {
  exportJobs: ExportJob[];
  onClearJob: (jobId: string) => void;
}

const NotificationCenter = ({ exportJobs, onClearJob }: NotificationCenterProps) => {
  const activeJobs = exportJobs.filter(job => job.status === 'processing' || job.status === 'pending');
  const hasNotifications = exportJobs.length > 0;

  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'processing':
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: ExportJob['status']) => {
    switch (status) {
      case 'processing':
      case 'pending':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
    }
  };

  const getStatusBadgeVariant = (status: ExportJob['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'processing':
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const formatFullDateTime = (date: Date) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  const handleDownload = (downloadUrl: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `children_records_all_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {activeJobs.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeJobs.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end" side="bottom">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h3 className="font-semibold">Export Notifications</h3>
          </div>
        </div>

        {!hasNotifications ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No export notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {exportJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(job.status)}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <p className="text-sm font-medium">CSV Export - All Data</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
                            {getStatusText(job.status)}
                          </Badge>
                        </div>
                        
                        {job.status === 'completed' && (
                          <p className="text-xs text-muted-foreground mb-2">
                            Your export is ready to download
                          </p>
                        )}
                        
                        {job.status === 'failed' && (
                          <div className="mb-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">
                                  Export Failed
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400">
                                  {job.error || 'Something went wrong. Please try again.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {(job.status === 'processing' || job.status === 'pending') && (
                          <div className="mb-3 w-full space-y-1">
                            <p className="text-xs text-muted-foreground">
                              {job.progress !== undefined && job.progress > 0
                                ? `${Math.round(job.progress)}% Complete`
                                : 'Starting...'}
                            </p>
                            <div className="w-full">
                              <Progress value={job.progress || 0} className="h-3 w-full" />
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            Created: {formatFullDateTime(job.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {job.status === 'completed' && job.downloadUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1 text-xs h-8"
                          onClick={() => handleDownload(job.downloadUrl!)}
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onClearJob(job.id)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
