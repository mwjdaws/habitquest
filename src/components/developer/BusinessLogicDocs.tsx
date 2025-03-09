
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BusinessLogicDocs: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Logic Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Habit Tracking System</h3>
            <p className="text-sm text-muted-foreground mt-1">
              The habit tracking system uses several key concepts:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><span className="font-medium">Streaks:</span> Consecutive days of habit completion</li>
              <li><span className="font-medium">Frequency:</span> Days of the week when habits should be completed</li>
              <li><span className="font-medium">Completion:</span> Recorded when a habit is marked as done</li>
              <li><span className="font-medium">Failure:</span> Recorded when a habit is explicitly skipped</li>
            </ul>
            
            <div className="mt-3 p-3 border rounded-md bg-muted/30">
              <h4 className="font-medium">Streak Calculation Logic</h4>
              <p className="text-xs md:text-sm mt-1">
                Streaks are calculated based on consecutive completion dates, taking frequency into account.
                A streak is only broken if a habit is explicitly marked as failed on a required day.
                Habits are automatically reset to 0 streak when marked as failed.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Goals and Key Results</h3>
            <p className="text-sm text-muted-foreground mt-1">
              The OKR (Objectives and Key Results) system operates on two levels:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><span className="font-medium">Goals:</span> Main objectives with start/end dates</li>
              <li><span className="font-medium">Key Results:</span> Measurable outcomes that track progress</li>
              <li><span className="font-medium">Progress Calculation:</span> Based on key result completion percentage</li>
              <li><span className="font-medium">Habit Integration:</span> Key results can be linked to habits</li>
            </ul>
            
            <div className="mt-3 p-3 border rounded-md bg-muted/30">
              <h4 className="font-medium">Progress Calculation</h4>
              <p className="text-xs md:text-sm mt-1">
                Goal progress is calculated as: (sum of current key result values) / (sum of target key result values) * 100
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Sleep Tracking</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sleep tracking includes multiple metrics:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><span className="font-medium">Quality Score:</span> Subjective quality rating (1-10)</li>
              <li><span className="font-medium">Routine Score:</span> Consistency with normal sleep routine (1-10)</li>
              <li><span className="font-medium">Biometrics:</span> Optional heart rate, HRV, and breathing metrics</li>
              <li><span className="font-medium">Duration:</span> Total sleep time in minutes</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
