import React, { useState, useEffect } from "react";
import "./EventForm.css";

const EventForm = ({ onAddEvent, editEvent, setError, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    color: "#2563EB",
  });

  useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title,
        date: editEvent.date,
        startTime: editEvent.startTime,
        endTime: editEvent.endTime,
        color: editEvent.color || "#2563EB",
      });
    } else {
      setFormData({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        color: "#2563EB",
      });
    }
  }, [editEvent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
      return;
    }

    onAddEvent(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>{editEvent ? "Edit Event" : "Add New Event"}</h2>

      <div className="form-group">
        <label>Event Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter event title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="time-inputs">
        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Color</label>
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={loading} className="form-button">
        {loading ? "Saving..." : editEvent ? "Update Event" : "Add Event"}
      </button>
    </form>
  );
};

export default EventForm;