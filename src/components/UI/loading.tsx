import { Loader2, Network } from "lucide-react";

export default function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper text-ink">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-accent/20" />
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <Network className="absolute h-4 w-4 text-accent" />
      </div>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
