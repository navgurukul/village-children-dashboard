import React from 'react';
import { Survey } from '@/types/survey';
import QuestionAnalytics from './QuestionAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Info } from 'lucide-react';

interface SurveyAnalyticsDisplayProps {
  survey: Survey;
  analyticsData: any;
  totalSurveys: number;
  calculatedAt?: string;
}

const SurveyAnalyticsDisplay = ({ survey, analyticsData, totalSurveys, calculatedAt }: SurveyAnalyticsDisplayProps) => {
  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return 'Last updated daily at 3 AM';
    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    return `Last updated on ${formattedDate} at 3 AM`;
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>              <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {survey.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {survey.titleHindi} • {totalSurveys ? totalSurveys.toLocaleString() : "0"} responses collected
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-background">
              <Info className="h-3 w-3 mr-1" />
              {formatLastUpdated(calculatedAt)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Survey Sections Analytics */}
      <div className="space-y-8">
        {survey.sections
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <div key={section.id} className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-primary rounded-full"></div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.titleHindi}</p>
                </div>
              </div>
              
              {/* Section Questions Analytics */}
              <div className="space-y-6">
                {section.questions
                  .filter(q => q.id !== 'q4_10' && q.id !== 'q4_12') // Hide q4_10 and q4_12 from analytics
                  .filter(q => q.type !== 'written') // Hide all written type questions from analytics
                  .filter(q => q.type !== 'calendar') // Hide all calendar type questions (e.g., Child's DOB)
                  .sort((a, b) => a.order - b.order)
                  .map(question => (
                    <QuestionAnalytics
                      key={question.id}
                      question={question}
                      analytics={(analyticsData && (analyticsData[question.id] || analyticsData[question.id?.replace('_', '-')])) || { totalResponses: 0, data: [] }}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SurveyAnalyticsDisplay;