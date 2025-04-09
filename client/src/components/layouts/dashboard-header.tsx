import { useState } from "react";
import { RefreshCw, Download, Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  description: string;
  onTimeRangeChange?: (timeRange: string) => void;
  onCustomDateChange?: (startDate: Date, endDate: Date) => void;
  timeRange?: string;
  onRefresh?: () => void;
  showExport?: boolean;
  onExport?: () => void;
}

export default function DashboardHeader({ 
  title, 
  description, 
  onTimeRangeChange,
  onCustomDateChange,
  timeRange = "last-24h",
  onRefresh,
  showExport = true,
  onExport
}: DashboardHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      // Simulate refresh completion after 1 second
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (onCustomDateChange) {
        const endDate = new Date(selectedDate);
        // The end date is today (if selected date is in the past)
        // or the selected date (if it's today or in the future)
        const today = new Date();
        const startDate = selectedDate < today ? selectedDate : today;
        onCustomDateChange(startDate, endDate);
      }
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-auto mb-2 sm:mb-0">
          <Select 
            value={timeRange} 
            onValueChange={(value) => onTimeRangeChange && onTimeRangeChange(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-24h">Last 24 hours</SelectItem>
              <SelectItem value="last-7d">Last 7 days</SelectItem>
              <SelectItem value="last-30d">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {timeRange === "custom" && (
          <div className="w-full sm:w-auto mb-2 sm:mb-0">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[180px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          {showExport && (
            <Button onClick={onExport} className="whitespace-nowrap">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
