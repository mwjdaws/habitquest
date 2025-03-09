
import React from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { DateField } from "./form-fields/DateField";
import { TimeFields } from "./form-fields/TimeFields";
import { QualityScoreField } from "./form-fields/QualityScoreField";
import { RoutineScoreField } from "./form-fields/RoutineScoreField";
import { BiometricsFields } from "./form-fields/BiometricsFields";
import { BreathRateFields } from "./form-fields/BreathRateFields";
import { SleepLatencyField } from "./form-fields/SleepLatencyField";

interface SleepFormContainerProps {
  form: UseFormReturn<SleepFormData>;
  onSubmit: (data: SleepFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const SleepFormContainer: React.FC<SleepFormContainerProps> = ({
  form,
  onSubmit,
  isSubmitting,
  submitLabel,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateField form={form} />
          <TimeFields form={form} />
        </div>

        <QualityScoreField form={form} />
        <RoutineScoreField form={form} />
        
        <BiometricsFields form={form} />
        <BreathRateFields form={form} />
        <SleepLatencyField form={form} />

        <CardFooter className="px-0 pb-0 pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
