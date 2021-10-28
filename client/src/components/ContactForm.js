import React from "react";

const ContactForm = () => {
  return (
    <div className="wrapper-contact">
      {/* Form */}
      <div className="form-container">
        <div className="blur"></div>
        <form>
          <label>
            <h5>Name</h5>
            <input type="text" name="name" />
          </label>

          <label>
            <h5>E-Mail </h5>
            <input type="email" name="email" />
          </label>

          <label>
            <h5>Tel</h5>
            <input type="tel" name="phone" />
          </label>

          <label>
            <h5>Nachricht</h5>
            <textarea name="message"></textarea>
          </label>

          <input className="form-btn" type="submit" value="Send" />
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
