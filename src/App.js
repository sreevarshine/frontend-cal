import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import EventForm from "./EventForm";
import Calendar from "./Calendar";
import data from "./data.json";
import "./App.css";

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

  if (!user) {
    return (
      <div className="auth-container">
        {mode === "login" ? (
          <Login setUser={setUser} switchToSignup={() => setMode("signup")} />
        ) : (
          <Signup setUser={setUser} switchToLogin={() => setMode("login")} />
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="flex justify-between items-center">
          <span className="user-welcome">
            👋 Welcome, <strong>{user.email}</strong>
          </span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="view-toggle text-center">
        <label htmlFor="view-select">View: </label>
        <select
          id="view-select"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="form-input"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      <main>
        <h1 className="text-center mb-4">📅 Calendar App</h1>

        {error && <div className="error-message mb-4">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;