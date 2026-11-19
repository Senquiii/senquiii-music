/*
  SENQUIII Music Lab: site settings. Every placeholder lives here (plus the literal text in index.html).
  To go live, find-and-replace across the project:
    xsenquiiix@gmail.com          -> the real contact email
    PAYPAL_LINK -> the PayPal donation link
*/
window.SENQ_CONFIG = {
  // Contact (Contact tab + footer). Messages arrive with the subject "[SENQUIII Contact] <visitor's subject>".
  CONTACT_EMAIL: "xsenquiiix@gmail.com",
  CONTACT_SUBJECT_PREFIX: "[SENQUIII Contact] ",
  // Optional form service so visitors don't need an email app. Create a free form at https://formspree.io
  // pointed at the contact email and paste its URL. Leave the placeholder to use the email (mailto:) fallback.
  CONTACT_ENDPOINT: "https://formspree.io/f/YOUR_CONTACT_FORM_ID", // PLACEHOLDER

  // Music submissions (Work With Senquiii).
  FORM_ENDPOINT: "https://formspree.io/f/YOUR_FORM_ID", // PLACEHOLDER

  // Donations (optional). While this is still the placeholder, clicks show a friendly
  // "not set up yet" note instead of opening a broken link.
  PAYPAL_LINK: "https://www.paypal.me/AyoneliDastan"
};
