import { useState } from "react";
import styles from "./Contact.module.css";
import { submitContact } from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    // Client validation
    if (!formData.name.trim()) {
      setStatus({ type: "error", message: "Please enter your name." });
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!formData.message.trim()) {
      setStatus({ type: "error", message: "Please enter your message." });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitContact(formData);
      setStatus({
        type: "success",
        message: res.message || "Thank you! Your message has been sent successfully.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Unable to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contact} id="contact">
      <div className="container">
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>Get in Touch</span>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <p className={styles.sectionLead}>
            Have a question, a partnership idea or a donation? We'd love to hear from you.
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Contact Info */}
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📍</div>
              <div>
                <h4>Address</h4>
                <p>
                  <strong>KHUSHI CENTRE FOR REHABILITATION AND RESEARCH</strong><br />
                  65/4/2, Sant Kirandass Ashram,<br />
                  Jaunti, Kanjhawala–Qutubgarh Road,<br />
                  New Delhi – 110081, India
                </p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📞</div>
              <div>
                <h4>Phone</h4>
                <p>
                  <a href="tel:+91-9217396124">+91-9217396124</a>
                </p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>✉️</div>
              <div>
                <h4>Email</h4>
                <p>
                  <a href="mailto:admin@khushicentre.in.in">admin@khushicentre.in.in</a>
                  <br />
                  <a href="mailto:khushicentre@gmail.com">khushicentre@gmail.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className={styles.contactForm} id="contactForm" onSubmit={handleSubmit} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Your Message *"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending Message..." : "Send Message"} <span className={styles.arrow}>→</span>
            </button>

            {status.message && (
              <p
                className={styles.formStatus}
                id="formStatus"
                role="status"
                style={{
                  color: status.type === "success" ? "#15803d" : "#b91c1c",
                  marginTop: "12px",
                  fontWeight: "600",
                }}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>

        {/* Google Map */}
        <div className={styles.map}>
          <iframe
            src="https://maps.google.com/maps?q=65%2F4%2F2%2C+Sant+Kirandass+Ashram%2C+Jaunti%2C+Kanjhawala%E2%80%93Qutubgarh+Road%2C+New+Delhi+%E2%80%93+110081%2C+India&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "12px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Office location map"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;