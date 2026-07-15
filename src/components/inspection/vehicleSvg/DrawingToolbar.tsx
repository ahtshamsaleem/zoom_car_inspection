"use client";

import { Pencil, Undo2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#000000"];

interface DrawingToolbarProps {
  drawMode: boolean;
  onToggleDrawMode: () => void;
  color: string;
  onColorChange: (c: string) => void;
  width: number;
  onWidthChange: (w: number) => void;
  onUndo: () => void;
  onClear: () => void;
  canUndo: boolean;
}

export function DrawingToolbar({
  drawMode,
  onToggleDrawMode,
  color,
  onColorChange,
  width,
  onWidthChange,
  onUndo,
  onClear,
  canUndo,
}: DrawingToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-white p-2">
      <Button
        type="button"
        size="sm"
        variant={drawMode ? "default" : "outline"}
        onClick={onToggleDrawMode}
      >
        <Pencil className="h-4 w-4 me-1" />
        {drawMode ? "Drawing" : "Draw"}
      </Button>

      <div className="flex items-center gap-1.5">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onColorChange(c)}
            className={cn(
              "h-5 w-5 rounded-full border-2 transition-transform",
              color === c ? "scale-110 border-slate-900" : "border-slate-300"
            )}
            style={{ backgroundColor: c }}
            aria-label={`Pick color ${c}`}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
          aria-label="Custom color"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Width</span>
        <input
          type="range"
          min={1}
          max={12}
          value={width}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          className="w-24 accent-slate-900"
        />
      </div>

      <Button type="button" size="sm" variant="outline" onClick={onUndo} disabled={!canUndo}>
        <Undo2 className="h-4 w-4 me-1" />
        Undo
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onClear} disabled={!canUndo}>
        <Trash2 className="h-4 w-4 me-1" />
        Clear
      </Button>
    </div>
  );
}