import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";
import { Trash2 } from "lucide-react";

export function DeleteDialog({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete this record from our servers.",
  onConfirm,
  children,
}: {
  title?: string;
  description?: string;
  onConfirm: () => void;
  children?: ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <button className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
