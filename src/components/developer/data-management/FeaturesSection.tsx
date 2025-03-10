
import React from "react";

export const FeaturesSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Product Features</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Core functionality implemented in the application:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li><span className="font-medium">Habit Tracking:</span> Create, complete, and track habits with streak counting</li>
        <li><span className="font-medium">Goal Management:</span> Set and track goals using the OKR (Objectives and Key Results) framework</li>
        <li><span className="font-medium">Journaling:</span> Daily journaling with sentiment analysis and prompts</li>
        <li><span className="font-medium">Sleep Tracking:</span> Log and analyze sleep patterns and quality</li>
        <li><span className="font-medium">Dashboard:</span> Customizable, drag-and-drop dashboard with analytics widgets</li>
        <li><span className="font-medium">Routines:</span> Group habits into routines for batch completion</li>
        <li><span className="font-medium">Task Management:</span> To-do list functionality that can be linked to habits</li>
        <li><span className="font-medium">Theming:</span> Customizable UI themes with persistent preferences</li>
      </ul>
    </div>
  );
};
