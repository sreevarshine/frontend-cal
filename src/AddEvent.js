import React, { useState } from "react";

const AddEvent = ({ onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    color: "#2563EB",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
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

    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const newEvent = {
        ...formData,
        id: Date.now(), // Generate unique ID
        completed: false,
      };

      onEventAdded(newEvent);

      // Reset form
      setFormData({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        color: "#2563EB",
      });

      setIsLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      {error && <div className="error-message">{error}</div>}

      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        required
      />

      <input
        type="color"
        name="color"
        value={formData.color}
        onChange={handleChange}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Add Event"}
      </button>
    </form>
  );
};

export default AddEvent;
