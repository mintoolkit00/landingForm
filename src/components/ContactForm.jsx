import { useState } from "react";
import styles from "./ContactForm.module.css";

const ContactForm = ({ target = "notion" }) => {
  const [status, setStatus] = useState("idle");
  //Fields included in the form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  //Generic function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    // URL for the function based on the target
    const functionPath = {
      notion: "/.netlify/functions/send-feedback",
      sheet: "/.netlify/functions/send-feedback-google-sheet",
    }[target];

    try {
      // 1.  feedback call
      const feedbackResponse = await fetch(functionPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!feedbackResponse.ok) throw new Error("Feedback failed");

      // 2. Send thank you email answer
      const emailResponse = await fetch(
        "/.netlify/functions/send-thank-you-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name, email: formData.email }),
        }
      );

      if (!emailResponse.ok) throw new Error("Email failed");

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("❌ Submission error:", error);
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
