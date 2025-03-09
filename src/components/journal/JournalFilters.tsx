
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X, Tag } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface JournalFiltersProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export function JournalFilters({ tags, selectedTag, onTagSelect }: JournalFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (tags.length === 0) {
    return null;
  }
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
              {selectedTag && <Badge variant="secondary" className="ml-1">{1}</Badge>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-4" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Filter by Tag</h4>
              <Separator />
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      onTagSelect(selectedTag === tag ? null : tag);
                      setIsOpen(false);
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {selectedTag && (
          <div className="flex items-center gap-2">
            <Badge className="gap-1">
              <Tag className="h-3 w-3" />
              {selectedTag}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => onTagSelect(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
