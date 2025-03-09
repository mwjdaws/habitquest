
import { useState } from "react";
import { SleepEntry } from "@/lib/sleepTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SleepEntryCard } from "./SleepEntryCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface SleepEntryListProps {
  entries: SleepEntry[];
  onEdit: (entry: SleepEntry) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function SleepEntryList({ entries, onEdit, onDelete, onAddNew }: SleepEntryListProps) {
  const [view, setView] = useState<"list" | "calendar">("list");

  if (entries.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">No sleep entries yet</h3>
            <p className="text-muted-foreground">
              Start tracking your sleep to improve your health and wellness.
            </p>
          </div>
          <Button onClick={onAddNew} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add Sleep Entry</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Sleep Entries</CardTitle>
        <Button onClick={onAddNew} size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Entry</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list" onClick={() => setView("list")}>List View</TabsTrigger>
            <TabsTrigger value="calendar" onClick={() => setView("calendar")}>
              Calendar View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            {entries.map((entry) => (
              <SleepEntryCard 
                key={entry.id} 
                entry={entry} 
                onEdit={() => onEdit(entry)}
                onDelete={() => onDelete(entry.id)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="p-4 text-center text-muted-foreground">
              Calendar view feature coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
