
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type DatabaseTableProps = {
  title: string;
  description: string;
  schemaValue: string;
  tableContent: string;
};

export const DatabaseTable: React.FC<DatabaseTableProps> = ({
  title,
  description,
  schemaValue,
  tableContent,
}) => {
  return (
    <AccordionItem value={schemaValue}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="space-y-2">
        <div className="p-3 border rounded-md">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
          <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
            <pre>{tableContent}</pre>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
