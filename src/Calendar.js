import React, { useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import TimeGridView from "./TimeGridView";
import "./Calendar.css";

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const Calendar = ({
  events,
  setEditEvent,
  deleteEvent,
  markCompleted,
  view,
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(null);

  const getCalendarRange = () => {
    let start, end;
    if (view === "month") {
      start = currentDate.startOf("month").startOf("week");
      end = currentDate.endOf("month").endOf("week");
    } else if (view === "week") {
      start = currentDate.startOf("week");
      end = currentDate.endOf("week");
    } else {
      start = currentDate.startOf("day");
      end = currentDate.endOf("day");
    }

    const days = [];
    let date = start.clone();
    while (date.isSameOrBefore(end, "day")) {
      days.push(date.clone());
      date = date.add(1, "day");
    }
    return days;
  };

  const calendar = getCalendarRange();
  const today = dayjs().format("YYYY-MM-DD");

  const groupedEvents = events.reduce((acc, ev) => {
    const eventDate = dayjs(ev.date).format("YYYY-MM-DD");
    (acc[eventDate] = acc[eventDate] || []).push(ev);
    return acc;
  }, {});

  const handleDateChange = (offset) => {
    setCurrentDate(currentDate.add(offset, view));
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  const handleBackToMonth = () => {
    setSelectedDay(null);
  };

  const renderEvent = (e) => {
    const isMissed =
      dayjs().isAfter(dayjs(`${e.date} ${e.endTime}`)) && !e.completed;

    return (
      <div
        key={e.id}
        className="event"
        style={{
          backgroundColor: isMissed ? "#f44336" : e.color,
          textDecoration: e.completed ? "line-through" : "none",
        }}
      >
        <div>
          <strong>{e.title}</strong>
        </div>
        <small>
          {e.startTime} - {e.endTime}
        </small>
        <div className="event-actions">
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              setEditEvent(e);
            }}
          >
            ✏
          </button>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              deleteEvent(e.id);
            }}
          >
            🗑
          </button>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              markCompleted(e.id);
            }}
          >
            ✅
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-nav">
        <button onClick={() => handleDateChange(-1)}>⬅</button>
        <h2>
          {currentDate.format(
            view === "day"
              ? "DD MMM YYYY"
              : view === "week"
              ? "'Week of' MMM D"
              : "MMMM YYYY"
          )}
        </h2>
        <button onClick={() => handleDateChange(1)}>➡</button>
      </div>

      {view === "day" || view === "week" ? (
        <TimeGridView
          view={view}
          currentDate={currentDate}
          events={events.filter((e) => {
            const eventDate = dayjs(e.date);
            if (view === "day") {
              return eventDate.isSame(currentDate, "day");
            } else {
              const start = currentDate.startOf("week");
              const end = currentDate.endOf("week");
              return eventDate.isBetween(start, end, "day", "[]");
            }
          })}
        />
      ) : selectedDay ? (
        <>
          <button onClick={handleBackToMonth}>🔙 Back</button>
          <h3>Events on {selectedDay}</h3>
          <div className="event-list">
            {groupedEvents[selectedDay]?.map(renderEvent)}
            {!groupedEvents[selectedDay]?.length && (
              <p>No events for this day.</p>
            )}
          </div>
        </>
      ) : (
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="day-header">
              {d}
            </div>
          ))}

          {calendar.map((day) => {
            const formatted = day.format("YYYY-MM-DD");
            const isToday = formatted === today;

            return (
              <div
                key={formatted}
                className={`day-cell ${isToday ? "today" : ""}`}
                onClick={() => handleDayClick(formatted)}
              >
                <div className="day-number">{day.date()}</div>
                {groupedEvents[formatted]?.slice(0, 3).map((e, idx) => (
                  <div key={idx} onClick={(ev) => ev.stopPropagation()}>
                    {renderEvent(e)}
                  </div>
                ))}
                {groupedEvents[formatted]?.length > 3 && (
                  <div className="more-events">
                    +{groupedEvents[formatted].length - 3} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;