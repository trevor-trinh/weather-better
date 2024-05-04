import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";

export default function SupportDialog() {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Support</DialogTitle>
      </DialogHeader>
      <div className="text-center py-8 flex flex-col gap-4">
        <h1 className="text-xl font-semibold">How it works:</h1>
        <ol className="list-decimal list-inside">
          <li>view bets</li>
          <li>make bets</li>
          <li>bet bets</li>
          <li>yays</li>
        </ol>
      </div>
      <DialogFooter>
        <Button variant="outline">
          <Link
            href="https://t.me/trevortrinh"
            rel="noopener noreferrer"
            target="_blank"
          >
            Telegram
          </Link>
        </Button>
        <DialogClose asChild>
          <Button className="bg-green-500 hover:bg-green-400">BET</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
