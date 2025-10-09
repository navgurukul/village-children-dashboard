import React from 'react';
import { Question } from '@/types/survey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, Circle, Edit3, Users } from 'lucide-react';

interface QuestionAnalyticsData {
  totalResponses: number;
  data: { label: string; count: number; percentage?: string }[];
}

interface QuestionAnalyticsProps {
  question: Question;
  analytics: QuestionAnalyticsData;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(221, 83%, 53%)',
  'hsl(262, 83%, 58%)', 
  'hsl(295, 73%, 58%)',
  'hsl(329, 87%, 58%)',
  'hsl(346, 77%, 58%)',
  'hsl(14, 78%, 58%)',
  'hsl(31, 91%, 58%)',
  'hsl(45, 93%, 58%)',
  'hsl(79, 70%, 55%)',
  'hsl(142, 71%, 45%)',
  'hsl(173, 58%, 45%)',
  'hsl(199, 89%, 48%)',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  'hsl(220, 75%, 60%)',
  'hsl(260, 75%, 60%)',
  'hsl(300, 75%, 60%)',
  'hsl(340, 75%, 60%)',
  'hsl(20, 85%, 55%)',
  'hsl(50, 85%, 55%)',
  'hsl(80, 65%, 50%)',
  'hsl(120, 65%, 50%)',
  'hsl(160, 65%, 50%)',
  'hsl(200, 85%, 55%)'
];

const QuestionAnalytics = ({ question, analytics }: QuestionAnalyticsProps) => {
  const getQuestionIcon = () => {
    switch (question.type) {
      case 'single_choose':
      case 'yes_no':
        return <Circle className="h-4 w-4 text-primary" />;
      case 'multi_choose':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      default:
        return <Edit3 className="h-4 w-4 text-primary" />;
    }
  };

  const renderAnalytics = () => {
    switch (question.type) {
      case 'single_choose':
      case 'yes_no':
      case 'multi_choose':
        return (
          <div className="space-y-6">
            {/* Response Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {analytics.data.map((item, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg p-3 border border-border/50 bg-gradient-to-br from-background to-muted/20">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-muted-foreground truncate">{item.label}</div>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  </div>
                  <div className="text-lg font-bold text-foreground">{item.count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage ?? ''}</div>
                </div>
              ))}
            </div>

            {/* Visualization Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interactive Pie Chart */}
              <div className="p-6 rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/10">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Response Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="count"
                        label={(entry: any) => {
                        const pct = parseFloat(entry?.payload?.percentage ?? '0'); 
                        if (pct < 3) return ''; // hide label if less than 3%
                            return `${pct}%`; 
                        }}
                        labelLine={false}
                        >
                        {analytics.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                        const label = props?.payload?.label ?? name; 
                        let pct = props?.payload?.percentage ?? '';  
                        if (pct && !pct.toString().trim().endsWith('%')) {
                        pct = `${pct}%`;
                        }
                        return [pct, label]; 
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                  </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Enhanced Bar Chart */}
              <div className="p-6 rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/10">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Response Counts
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        formatter={(value, name) => [`${value} responses`, name]}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        radius={[6, 6, 0, 0]}
                      >
                        {analytics.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getQuestionIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-foreground leading-relaxed flex items-start justify-between">
              <div className="flex-1">
                <div>{question.questionText}</div>
                <div className="text-sm font-normal text-muted-foreground mt-1">
                  {question.questionTextHindi}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                  {analytics.totalResponses.toLocaleString()}
                </Badge>
                {question.isRequired && (
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                    Required
                  </Badge>
                )}
              </div>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderAnalytics()}
      </CardContent>
    </Card>
  );
};

export default QuestionAnalytics;