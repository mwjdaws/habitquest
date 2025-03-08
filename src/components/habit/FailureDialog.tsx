
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { commonFailureReasons } from "@/lib/habitTypes";

type FailureDialogProps = {
  habitId: string;
  habitName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (habitId: string, reason: string) => void;
  onCancel: () => void;
};

export function FailureDialog({
  habitId,
  habitName,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: FailureDialogProps) {
  const [reason, setReason] = useState(commonFailureReasons[0]);
  const [customReason, setCustomReason] = useState("");

  const handleConfirm = () => {
    if (reason === "Other" && customReason.trim()) {
      onConfirm(habitId, customReason.trim());
    } else if (reason !== "Other") {
      onConfirm(habitId, reason);
    }
    resetForm();
  };

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

  const resetForm = () => {
    setReason(commonFailureReasons[0]);
    setCustomReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log missed habit</DialogTitle>
          <DialogDescription>
            Why did you miss your habit "{habitName}"? This helps track patterns and improve habit formation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={reason} onValueChange={setReason} className="grid gap-3">
            {commonFailureReasons.map((r) => (
              <div key={r} className="flex items-center space-x-2">
                <RadioGroupItem value={r} id={`reason-${r}`} />
                <Label htmlFor={`reason-${r}`}>{r}</Label>
              </div>
            ))}
          </RadioGroup>

          {reason === "Other" && (
            <div className="grid gap-2">
              <Label htmlFor="custom-reason">Custom reason</Label>
              <Textarea
                id="custom-reason"
                placeholder="Enter your reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Log Reason</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
