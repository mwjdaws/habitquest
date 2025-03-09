
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskStatsFilterProps {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  availableTags: string[];
}

export function TaskStatsFilter({ selectedTag, setSelectedTag, availableTags }: TaskStatsFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="tagFilter">Filter by Tag</Label>
      </div>
      <Select
        value={selectedTag || "all_tags"}
        onValueChange={(value) => setSelectedTag(value === "all_tags" ? null : value)}
      >
        <SelectTrigger id="tagFilter">
          <SelectValue placeholder="All Tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all_tags">All Tags</SelectItem>
          {availableTags.map((tag) => (
            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
