
import React from "react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export const RadixAccessibilitySection: React.FC = () => {
  return (
    <Collapsible className="w-full border rounded-md p-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h3 className="text-lg font-medium">Accessibility with Radix UI Primitives</h3>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-open:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-4">
        <p className="text-muted-foreground">
          HabitQuest leverages shadcn/ui components built on Radix UI primitives to ensure high accessibility standards throughout the application:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="font-medium">Focus Management:</span> Radix UI primitives handle proper focus trapping within modals, dropdowns, and other interactive elements. Focus moves logically between elements and is maintained when components mount or unmount.
          </li>
          <li>
            <span className="font-medium">Keyboard Navigation:</span> All interactive components support full keyboard control, including arrow keys, Tab/Shift+Tab for navigation, Escape to dismiss, and Enter/Space to activate.
          </li>
          <li>
            <span className="font-medium">ARIA Attributes:</span> Components automatically apply appropriate ARIA roles, states, and properties to ensure screen reader compatibility.
          </li>
          <li>
            <span className="font-medium">Portal Rendering:</span> Dialogs, popovers, and tooltips are rendered in a portal at the root level to avoid z-index and stacking context issues.
          </li>
          <li>
            <span className="font-medium">Proper Labeling:</span> Form components include proper labeling with explicit associations between inputs and their labels.
          </li>
          <li>
            <span className="font-medium">Screen Reader Announcements:</span> Critical UI changes are announced to screen readers using appropriate ARIA live regions.
          </li>
          <li>
            <span className="font-medium">Responsive Behaviors:</span> Components adapt to different viewport sizes while maintaining accessibility.
          </li>
        </ul>
        
        <h4 className="text-base font-medium mt-2">Example: Dialog Implementation</h4>
        <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono overflow-x-auto">
          <pre>{`
// Dialog component built on Radix UI DialogPrimitive
// This ensures proper focus management and keyboard navigation
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Accessible Dialog</DialogTitle>
      <DialogDescription>
        This dialog is keyboard navigable and screen-reader friendly.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Form content */}
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Alert Dialog with proper ARIA roles and keyboard support
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Item</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
          `}</pre>
        </div>
        
        <h4 className="text-base font-medium mt-4">Accessible Form Elements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="border rounded-md p-3">
            <h5 className="font-medium mb-2">Select Component</h5>
            <ul className="text-sm space-y-1">
              <li>• Proper dropdown semantics</li>
              <li>• Keyboard navigation between options</li>
              <li>• Screen reader announcements</li>
              <li>• Visual focus indicators</li>
            </ul>
          </div>
          <div className="border rounded-md p-3">
            <h5 className="font-medium mb-2">Checkbox & Radio</h5>
            <ul className="text-sm space-y-1">
              <li>• Correctly associated labels</li>
              <li>• Support for indeterminate state</li>
              <li>• Custom styling with proper a11y</li>
              <li>• Keyboard activation</li>
            </ul>
          </div>
          <div className="border rounded-md p-3">
            <h5 className="font-medium mb-2">Slider</h5>
            <ul className="text-sm space-y-1">
              <li>• ARIA slider role</li>
              <li>• Fine and coarse control with keys</li>
              <li>• Value announcements</li>
              <li>• Touch-friendly targets</li>
            </ul>
          </div>
          <div className="border rounded-md p-3">
            <h5 className="font-medium mb-2">Tooltips & Popovers</h5>
            <ul className="text-sm space-y-1">
              <li>• Proper positioning</li>
              <li>• Focus management</li>
              <li>• Hover and focus activation</li>
              <li>• Escape to dismiss</li>
            </ul>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
