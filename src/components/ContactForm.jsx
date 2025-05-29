import { useState } from "react";
import styles from "./ContactForm.module.css";

const ContactForm = ({ target = "notion" }) => {
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    // Define the correct endpoint based on the target
    const functionPath = {
      notion: "/.netlify/functions/send-feedback",
      sheet: "/.netlify/functions/send-feedback-google-sheet",
    }[target];

    try {
      const response = await fetch(functionPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.container}>
        <h3 className={styles.title}>Send us your feedback</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send"}
          </button>
          {status === "success" && (
            <p className={styles.success}>Thanks for your message!</p>
          )}
          {status === "error" && (
            <p className={styles.error}>Something went wrong. Try again.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
