import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import EventForm from "./EventForm";
import Calendar from "./Calendar";
import data from "./data.json";

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [events, setEvents] = useState(data.events);
  const [editEvent, setEditEvent] = useState(null);
  const [view, setView] = useState("month");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const addEvent = (eventData) => {
    setLoading(true);
    setTimeout(() => {
      if (editEvent) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === editEvent.id ? { ...eventData, id: editEvent.id } : ev
          )
        );
      } else {
        setEvents((prev) => [...prev, { ...eventData, id: Date.now() }]);
      }
      setEditEvent(null);
      setLoading(false);
    }, 500);
  };

  const deleteEvent = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setLoading(true);
    setTimeout(() => {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setLoading(false);
    }, 300);
  };

  const markCompleted = (id) => {
    setLoading(true);
    setTimeout(() => {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === id ? { ...ev, completed: !ev.completed } : ev
        )
      );
      setLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMode("login");
  };

  // Render login or signup page
  if (!user) {
    return (
      <>
        {mode === "login" ? (
          <Login setUser={setUser} switchToSignup={() => setMode("signup")} />
        ) : (
          <Signup setUser={setUser} switchToLogin={() => setMode("login")} />
        )}
        {error && (
          <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {error}
          </div>
        )}
      </>
    );
  }

  // Main App content
  return (
    <div
      className="app"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <span>
          👋 Welcome, <strong>{user.email}</strong>
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h1 style={{ textAlign: "center" }}>📅 Calendar App</h1>

      <div
        className="view-toggle"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        <label>View:</label>
        <select value={view} onChange={(e) => setView(e.target.value)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {error && (
        <div style={{ color: "red", padding: "10px", margin: "10px 0" }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      )}

      <EventForm
        onAddEvent={addEvent}
        editEvent={editEvent}
        setError={setError}
        loading={loading}
      />

      <Calendar
        events={events}
        setEditEvent={setEditEvent}
        deleteEvent={deleteEvent}
        markCompleted={markCompleted}
        view={view}
        loading={loading}
      />
    </div>
  );
}

export default App;
