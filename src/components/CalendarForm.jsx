import { useState, useEffect } from "react";
import styles from "./CalendarForm.module.css";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { availability } from "../calendar/availability"; //Weekly availability configuration
import { HOURS_CONFIG } from "../calendar/availability";

//Configuration for opening hours, closing hours, slot intervals, and time zone
// This configuration can be adjusted as needed
const { openingHour, closingHour, slotInterval, timeZone } = HOURS_CONFIG;

const CalendarForm = () => {
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ name: "", comment: "" });

  // Fetch booked slots from the server when the component mounts
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("/.netlify/functions/get-reservations");
        const data = await res.json();
        setBookedSlots(data.reservations || []);
      } catch (error) {
        console.error("❌ Failed to fetch reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  // Calculate the start of the week based on the current date and week offset
  const weekStart = addDays(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    weekOffset * 7
  );
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hours = Array.from(
    { length: Math.ceil((closingHour - openingHour) / slotInterval) },
    (_, i) => openingHour + i * slotInterval
  );

  // Create a mapping of availability for each day
  const handleSlotClick = (day, hour) => {
    setSelectedSlot({ day, hour });
  };

  // handle the input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert("Please select a time slot before submitting.");
      return;
    }
    const formattedDay = selectedSlot.day.toLocaleDateString("en-CA", {
      timeZone,
    });

    // Prepare the reservation data to be sent to the server
    const reservationData = {
      date: formattedDay,
      hour: formatSlotLabel(selectedSlot.hour),
      name: formData.name,
      comment: formData.comment,
    };

    // Send the reservation data to the server
    try {
      const res = await fetch("/.netlify/functions/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (res.ok) {
        const newSlot = {
          date: formattedDay, // igual que en el fetch de bookings
          time: formatSlotLabel(selectedSlot.hour),
        };
        console.log("All bookings saved successfully:", bookedSlots);
        console.log("Booking saved successfully:", newSlot);

        setBookedSlots((prev) => [...prev, newSlot]);
        setFormData({ name: "", comment: "" });
        setSuccess(true);
        setSelectedSlot(null);
      } else {
        throw new Error("Request failed");
      }
    } catch (err) {
      console.error("Error submitting reservation:", err);
      setSuccess(false);
      alert("There was an error submitting your reservation.");
    }
  };
  // Format the time slot label for display
  const formatSlotLabel = (hour) => {
    const pad = (n) => (n < 10 ? `0${n}` : n);
    return `${pad(hour)}:00 - ${pad(hour + slotInterval)}:00`;
  };

  return (
    <section className={styles.container} id="booking">
      <div className={styles.calendar}>
        <div className={styles.navButtons}>
          <button onClick={() => setWeekOffset(weekOffset - 1)}>{"<"}</button>
          <span>{`Week of ${format(weekStart, "MMMM d")}`}</span>
          <button onClick={() => setWeekOffset(weekOffset + 1)}>{">"}</button>
        </div>
        {/* Render the calendar table */}
        <table>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day, i) => (
                <th key={i}>{format(day, "EEE d")}</th>
              ))}
            </tr>
          </thead>
          {/* Render the time slots for each day */}
          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td>{formatSlotLabel(hour)}</td>
                {days.map((day, i) => {
                  const dayName = format(day, "EEEE").toLowerCase();
                  const hourStr = `${hour < 10 ? `0${hour}` : hour}:00`;
                  const available = availability[dayName]?.includes(hourStr);
                  const isBooked = bookedSlots.some(
                    (r) =>
                      r.date === format(day, "yyyy-MM-dd") &&
                      r.time === formatSlotLabel(hour)
                  );
                  const selected =
                    selectedSlot &&
                    isSameDay(day, selectedSlot.day) &&
                    selectedSlot.hour === hour;
                  return (
                    <td
                      key={i}
                      className={`${
                        available
                          ? styles["slot-available"]
                          : styles["slot-unavailable"]
                      } ${isBooked ? styles["slot-booked"] : ""} ${
                        selected ? styles["slot-selected"] : ""
                      }`}
                      onClick={() =>
                        available && !isBooked && handleSlotClick(day, hour)
                      }
                    ></td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render the form for booking a slot */}
      <div className={styles.form}>
        <h3>Request a Meeting</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={
              selectedSlot
                ? format(selectedSlot.day, "EEEE, MMMM d yyyy")
                : "No date selected"
            }
            disabled
          />
          <input
            type="text"
            value={
              selectedSlot
                ? formatSlotLabel(selectedSlot.hour)
                : "No hour selected"
            }
            disabled
          />
          <input
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="comment"
            placeholder="Comment"
            value={formData.comment}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit">Send request</button>
          {success && (
            <p className={styles.successMessage}>
              Your booking was successfully submitted!
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default CalendarForm;
