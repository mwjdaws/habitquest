
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJournalStats } from "@/hooks/useJournalStats";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { addDays, format, startOfMonth, subMonths } from "date-fns";
import { Button } from "../ui/button";

export function JournalingTrend() {
  const { dailyJournalCounts, isLoading } = useJournalStats();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };
  
  // Go to current month
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };
  
  // Function to add months properly
  function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  
  // Get days in current month view
  const monthStart = startOfMonth(currentMonth);
  const monthTitle = format(monthStart, 'MMMM yyyy');
  
  const startDay = monthStart.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the start of the month
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayData = dailyJournalCounts.find(d => d.date === dateStr);
    const count = dayData?.count || 0;
    
    calendarDays.push({
      day,
      count,
      date: dateStr,
    });
  }
  
  // Get color based on entry count
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-green-100";
    if (count === 2) return "bg-green-300";
    return "bg-green-500";
  };
  
  // Is today in current month view
  const isCurrentMonth = currentMonth.getMonth() === new Date().getMonth() && 
                          currentMonth.getFullYear() === new Date().getFullYear();
  const today = new Date().getDate();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Journaling Activity</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pt-2 pb-1 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToPrevMonth}
            className="h-7 w-7 p-0"
          >
            ←
          </Button>
          <span className="text-sm font-medium">{monthTitle}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToNextMonth}
            className="h-7 w-7 p-0"
          >
            →
          </Button>
        </div>
        
        <div className="p-4">
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1 animate-pulse">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-sm" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-xs text-center text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayData, i) => (
                  <div
                    key={i}
                    className={`
                      aspect-square rounded-sm flex items-center justify-center text-xs
                      ${dayData ? getColorClass(dayData.count) : 'bg-transparent'}
                      ${isCurrentMonth && dayData?.day === today ? 'ring-2 ring-primary' : ''}
                      ${dayData ? 'cursor-pointer hover:opacity-80' : ''}
                    `}
                    title={dayData ? `${dayData.date}: ${dayData.count} entries` : ''}
                  >
                    {dayData?.day || ''}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-muted rounded-sm"></div>
            <span className="text-xs text-muted-foreground">0</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
            <span className="text-xs text-muted-foreground">1</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
            <span className="text-xs text-muted-foreground">2</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span className="text-xs text-muted-foreground">3+</span>
          </div>
          
          {!isCurrentMonth && (
            <Button variant="ghost" size="sm" onClick={goToCurrentMonth} className="text-xs h-6">
              Today
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
