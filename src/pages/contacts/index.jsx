import { useMemo, useState } from "react";
import { FiArrowRight, FiEdit2, FiMail, FiPhone, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { dealOwners } from "../../data";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const Contacts = ({ contacts, onNewContact, onEditContact, onDeleteContact, onOpenContact }) => {
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("All owners");
  const [status, setStatus] = useState("All relationships");
  const visible = useMemo(() => contacts.filter((contact) => {
    const matchesQuery = `${contact.name} ${contact.company} ${contact.email} ${contact.title}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (owner === "All owners" || contact.owner === owner) && (status === "All relationships" || contact.status === status);
  }).sort((a, b) => a.name.localeCompare(b.name)), [contacts, owner, query, status]);
  const active = contacts.filter((contact) => contact.status === "Active").length;
  const leads = contacts.filter((contact) => contact.status === "New lead").length;
  const customers = contacts.filter((contact) => contact.status === "Customer").length;

  return (
    <div className={shared.page}>
      <div className={shared.pageHeader}>
        <div><span className={shared.eyebrow}>RELATIONSHIP MANAGEMENT · {contacts.length} PEOPLE</span><h1>People & accounts</h1><p className={shared.lead}>Good sales starts with thoughtful relationships.</p></div>
        <button className={shared.primaryButton} type="button" onClick={onNewContact}><FiPlus /> Add contact</button>
      </div>
      <section className={styles.stats} aria-label="Relationship summary"><div><span>Total relationships</span><strong>{contacts.length}</strong></div><div><span>Active conversations</span><strong>{active}</strong></div><div><span>New leads</span><strong>{leads}</strong></div><div><span>Customers</span><strong>{customers}</strong></div></section>
      <section className={shared.panel}>
        <div className={styles.toolbar}>
          <label className={styles.search}><FiSearch /><span className={styles.srOnly}>Search people and accounts</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, accounts, emails" /></label>
          <label className={styles.filter}><span>Owner</span><select value={owner} onChange={(event) => setOwner(event.target.value)}><option>All owners</option>{dealOwners.map((person) => <option key={person}>{person}</option>)}</select></label>
          <label className={styles.filter}><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{["All relationships", "New lead", "Active", "Customer"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <span className={styles.results}>{visible.length} results</span>
        </div>
        {visible.length ? <>
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Contact</th><th>Account</th><th>Owner</th><th>Status</th><th>Last touch</th><th><span className={styles.srOnly}>Actions</span></th></tr></thead><tbody>{visible.map((contact, index) => <tr key={contact.id}>
            <td><button type="button" className={styles.person} onClick={() => onOpenContact(contact)}><span className={`${styles.avatar} ${styles[`avatar${index % 4}`]}`}>{contact.name.split(" ").map((part) => part[0]).join("")}</span><span><strong>{contact.name}</strong><small>{contact.title}</small></span></button></td>
            <td><strong className={styles.account}>{contact.company}</strong><small className={styles.email}>{contact.email}</small></td>
            <td><span className={styles.owner}><i>{contact.owner.split(" ").map((part) => part[0]).join("")}</i>{contact.owner}</span></td>
            <td><span className={`${styles.status} ${styles[contact.status.toLowerCase().replace(" ", "")]}`}>{contact.status}</span></td>
            <td className={styles.lastTouch}>{contact.lastContact}</td>
            <td><div className={styles.actions}><a href={`mailto:${contact.email}`} aria-label={`Email ${contact.name}`}><FiMail /></a>{contact.phone ? <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} aria-label={`Call ${contact.name}`}><FiPhone /></a> : null}<button type="button" onClick={() => onEditContact(contact)} aria-label={`Edit ${contact.name}`}><FiEdit2 /></button><button type="button" onClick={() => onDeleteContact(contact)} aria-label={`Delete ${contact.name}`}><FiTrash2 /></button></div></td>
          </tr>)}</tbody></table></div>
          <div className={styles.mobileList}>{visible.map((contact, index) => <article className={styles.personCard} key={contact.id}><div className={styles.personCardTop}><button type="button" className={styles.person} onClick={() => onOpenContact(contact)}><span className={`${styles.avatar} ${styles[`avatar${index % 4}`]}`}>{contact.name.split(" ").map((part) => part[0]).join("")}</span><span><strong>{contact.name}</strong><small>{contact.title}</small></span></button><span className={`${styles.status} ${styles[contact.status.toLowerCase().replace(" ", "")]}`}>{contact.status}</span></div><p>{contact.company}</p><a href={`mailto:${contact.email}`}><FiMail /> {contact.email}</a><div className={styles.cardActions}><button type="button" onClick={() => onEditContact(contact)}><FiEdit2 /> Edit</button><button type="button" onClick={() => onDeleteContact(contact)}><FiTrash2 /> Remove</button><button type="button" onClick={() => onOpenContact(contact)}>Details <FiArrowRight /></button></div></article>)}</div>
        </> : <div className={shared.empty}><FiUsers /><strong>No people match these filters</strong><p>Try another name or relationship status.</p>{contacts.length === 0 ? <button type="button" className={shared.primaryButton} onClick={onNewContact}><FiPlus /> Add your first contact</button> : null}</div>}
      </section>
    </div>
  );
};

export default Contacts;
