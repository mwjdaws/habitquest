
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { DatabaseTable } from "./DatabaseTable";

type SchemaTable = {
  title: string;
  description: string;
  value: string;
  content: string;
};

type DatabaseSectionProps = {
  title: string;
  description: string;
  tables: SchemaTable[];
};

export const DatabaseSection: React.FC<DatabaseSectionProps> = ({
  title,
  description,
  tables,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {description}
      </p>
      
      <Accordion type="single" collapsible className="w-full mt-3">
        {tables.map((table) => (
          <DatabaseTable
            key={table.value}
            title={table.title}
            description={table.description}
            schemaValue={table.value}
            tableContent={table.content}
          />
        ))}
      </Accordion>
    </div>
  );
};
