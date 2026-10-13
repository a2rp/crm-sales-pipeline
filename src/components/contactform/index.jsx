import { useState } from "react";
import { dealOwners } from "../../data";
import styles from "./styles.module.css";

const ContactForm = ({ initialContact, onSubmit, onCancel }) => {
  const [form, setForm] = useState(() => ({ name: "", title: "", company: "", email: "", phone: "", owner: dealOwners[0], status: "New lead", ...initialContact }));
  const [errors, setErrors] = useState({});
  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Enter the contact's name.";
    if (!form.company.trim()) nextErrors.company = "Enter the account name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({ ...form, name: form.name.trim(), title: form.title.trim(), company: form.company.trim(), email: form.email.trim(), phone: form.phone.trim() });
  };
  const field = (name, label, control, wide = false) => <label className={`${styles.field} ${wide ? styles.wide : ""}`} htmlFor={`contact-${name}`} key={name}><span>{label}</span>{control}{errors[name] ? <small className={styles.error}>{errors[name]}</small> : null}</label>;
  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.grid}>
        {field("name", "Full name *", <input id="contact-name" name="name" value={form.name} onChange={update} placeholder="e.g. Priya Nair" aria-invalid={Boolean(errors.name)} />)}
        {field("title", "Job title", <input id="contact-title" name="title" value={form.title} onChange={update} placeholder="e.g. VP, Operations" />)}
        {field("company", "Account *", <input id="contact-company" name="company" value={form.company} onChange={update} placeholder="Company name" aria-invalid={Boolean(errors.company)} />)}
        {field("email", "Email *", <input id="contact-email" name="email" type="email" value={form.email} onChange={update} placeholder="name@company.com" aria-invalid={Boolean(errors.email)} />)}
        {field("phone", "Phone", <input id="contact-phone" name="phone" type="tel" value={form.phone} onChange={update} placeholder="+1 (555) 123-4567" />)}
        {field("owner", "Relationship owner", <select id="contact-owner" name="owner" value={form.owner} onChange={update}>{dealOwners.map((owner) => <option key={owner}>{owner}</option>)}</select>)}
        {field("status", "Relationship", <select id="contact-status" name="status" value={form.status} onChange={update}>{["New lead", "Active", "Customer"].map((status) => <option key={status}>{status}</option>)}</select>, true)}
      </div>
      <div className={styles.actions}><button className={styles.cancel} type="button" onClick={onCancel}>Cancel</button><button className={styles.submit} type="submit">{initialContact ? "Save contact" : "Add contact"}</button></div>
    </form>
  );
};

export default ContactForm;
