"use client";

//* Components Imports
import Button from "@/components/ui/button";

//* Libraries Imports
import { ChevronLeft, ChevronRight } from "lucide-react";

//* Types Imports
import type { ToolbarProps, View } from "react-big-calendar";
import type { CalendarEvent } from "./types";

//* Utils Imports
import { cn } from "@/lib/utils";

const viewLabels: Record<View, string> = {
  month: "Mês",
  week: "Semana",
  work_week: "Semana útil",
  day: "Dia",
  agenda: "Agenda",
};

export function CalendarToolbar({ label, view, views, onNavigate, onView }: ToolbarProps<CalendarEvent>) {
  const availableViews = (Array.isArray(views) ? views : (Object.keys(views) as View[])).filter(
    (viewKey) => viewKey !== "work_week",
  );

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border bg-card p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onNavigate("PREV")}
            aria-label="Período anterior"
          >
            <ChevronLeft />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="px-3 font-semibold" onClick={() => onNavigate("TODAY")}>
            Hoje
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onNavigate("NEXT")}
            aria-label="Próximo período"
          >
            <ChevronRight />
          </Button>
        </div>
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground capitalize">{label}</h2>
      </div>

      <div className="flex w-fit gap-0.5 rounded-lg border bg-muted/40 p-0.5">
        {availableViews.map((viewKey) => (
          <Button
            key={viewKey}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onView(viewKey)}
            aria-pressed={view === viewKey}
            className={cn(
              "px-3 text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent",
              view === viewKey && "bg-card font-semibold text-foreground shadow-sm hover:bg-card dark:hover:bg-card",
            )}
          >
            {viewLabels[viewKey]}
          </Button>
        ))}
      </div>
    </div>
  );
}
