import { useState, useMemo, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useTheme } from "../contexts/ThemeContext";
import { Calendar as CalendarIcon, Plus, Eye, Edit, Trash2, MapPin, Clock, User } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./EventCalendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface EventCalendarProps {
  events: any[];
  onAddEvent: () => void;
  onEditEvent: (event: any) => void;
  onDeleteEvent: (event: any) => void;
}

export default function EventCalendar({ events, onAddEvent, onEditEvent, onDeleteEvent }: EventCalendarProps) {
  const { isDark } = useTheme();
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Transform events for calendar
  const calendarEvents = useMemo(() => {
    return events.map((event) => {
      const eventDate = new Date(event.event_date);
      const [hours, minutes] = (event.event_time || "10:00").split(":");
      eventDate.setHours(parseInt(hours), parseInt(minutes));

      return {
        id: event.id,
        title: event.deceased_name,
        start: eventDate,
        end: new Date(eventDate.getTime() + 3 * 60 * 60 * 1000), // 3 hours duration
        resource: event,
      };
    });
  }, [events]);

  const handleSelectEvent = useCallback((event: any) => {
    setSelectedEvent(event.resource);
  }, []);

  const handleSelectSlot = useCallback(() => {
    onAddEvent();
  }, [onAddEvent]);

  const eventStyleGetter = (event: any) => {
    const resource = event.resource;
    let backgroundColor = "#C9A961"; // Default gold

    switch (resource.status) {
      case "scheduled":
        backgroundColor = "#eab308"; // Yellow
        break;
      case "in_progress":
        backgroundColor = "#3b82f6"; // Blue
        break;
      case "completed":
        backgroundColor = "#22c55e"; // Green
        break;
      case "cancelled":
        backgroundColor = "#ef4444"; // Red
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "0.875rem",
        fontWeight: "500",
      },
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-khambi-accent" />
          <div>
            <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Event Calendar</h3>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {calendarEvents.length} event{calendarEvents.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
        </div>
        <button
          onClick={onAddEvent}
          className="flex items-center gap-2 px-4 py-2 bg-khambi-accent text-black rounded-lg hover:bg-khambi-gold font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Cancelled</span>
        </div>
      </div>

      {/* Calendar */}
      <div
        style={{ borderColor: "#B8935E", borderWidth: "1px" }}
        className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm calendar-container ${isDark ? "dark-calendar" : ""}`}
      >
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          popup
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl max-w-2xl w-full p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{selectedEvent.deceased_name}</h3>
                <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Event #{selectedEvent.event_number}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Eye className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Status</label>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1).replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Date</label>
                  <div className={`flex items-center gap-2 mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(selectedEvent.event_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Time</label>
                  <div className={`flex items-center gap-2 mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <Clock className="w-4 h-4" />
                    <span>{selectedEvent.event_time}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Location</label>
                <div className={`flex items-center gap-2 mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              {/* Manager */}
              {selectedEvent.staff && (
                <div>
                  <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Event Manager</label>
                  <div className={`flex items-center gap-2 mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <User className="w-4 h-4" />
                    <span>{selectedEvent.staff.employee_number}</span>
                  </div>
                </div>
              )}

              {/* Progress */}
              <div>
                <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Progress</label>
                <div className="mt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-khambi-accent transition-all" style={{ width: `${selectedEvent.progress}%` }}></div>
                    </div>
                    <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{selectedEvent.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedEvent.notes && (
                <div>
                  <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Notes</label>
                  <p className={`mt-1 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{selectedEvent.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  onEditEvent(selectedEvent);
                  setSelectedEvent(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-khambi-accent text-black rounded-lg hover:bg-khambi-gold font-semibold"
              >
                <Edit className="w-4 h-4" />
                Edit Event
              </button>
              <button
                onClick={() => {
                  onDeleteEvent(selectedEvent);
                  setSelectedEvent(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                Delete Event
              </button>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
