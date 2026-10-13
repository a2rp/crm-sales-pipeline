import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiBriefcase, FiMail, FiSearch, FiUsers } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { formatCurrency, formatDate } from "../../data";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const Search = ({ deals, contacts, onOpenDeal, onOpenContact }) => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [value, setValue] = useState(query);
  useEffect(() => setValue(query), [query]);
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return { deals: [], contacts: [] };
    return {
      deals: deals.filter((deal) => `${deal.id} ${deal.name} ${deal.company} ${deal.owner} ${deal.stage} ${deal.nextStep}`.toLowerCase().includes(term)),
      contacts: contacts.filter((contact) => `${contact.name} ${contact.title} ${contact.company} ${contact.email} ${contact.owner} ${contact.status}`.toLowerCase().includes(term)),
    };
  }, [contacts, deals, query]);
  const total = matches.deals.length + matches.contacts.length;
  const submit = (event) => { event.preventDefault(); setParams(value.trim() ? { q: value.trim() } : {}); };

  return (
    <div className={shared.page}>
      <div className={shared.pageHeader}><div><span className={shared.eyebrow}>WORKSPACE SEARCH</span><h1>Find your next move.</h1><p className={shared.lead}>Search across deals, accounts, people, and follow-up notes.</p></div></div>
      <form className={styles.searchBox} role="search" onSubmit={submit}><FiSearch aria-hidden="true" /><label className={styles.srOnly} htmlFor="workspace-search">Search your workspace</label><input id="workspace-search" autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder="Try a person, company, deal, or next step" /><button type="submit">Search</button></form>
      {query ? <div className={styles.resultLabel}><strong>{total}</strong> result{total === 1 ? "" : "s"} for <b>“{query}”</b></div> : <div className={styles.hint}><span>Try searching for</span>{["Harborline", "proposal", "Maya Chen"].map((suggestion) => <button key={suggestion} type="button" onClick={() => { setValue(suggestion); setParams({ q: suggestion }); }}>{suggestion}</button>)}</div>}
      {query && total === 0 ? <div className={`${shared.panel} ${shared.empty}`}><FiSearch /><strong>No results found</strong><p>Try another name, account, stage, or next-step phrase.</p></div> : null}
      {matches.deals.length ? <section className={`${shared.panel} ${styles.resultsPanel}`}><div className={shared.panelHeader}><div><span className={shared.kicker}>REVENUE WORK</span><h2>Deals <span>{matches.deals.length}</span></h2></div><FiBriefcase className={styles.panelIcon} /></div><div className={styles.resultsList}>{matches.deals.map((deal) => <button className={styles.result} type="button" key={deal.id} onClick={() => onOpenDeal(deal)}><span className={styles.resultIcon}><FiBriefcase /></span><span className={styles.resultMain}><strong>{deal.name}</strong><small>{deal.company} · {deal.id}</small></span><span className={styles.resultMeta}><b>{formatCurrency(deal.value, true)}</b><small>{deal.stage} · closes {formatDate(deal.closeDate)}</small></span><FiArrowRight className={styles.arrow} /></button>)}</div></section> : null}
      {matches.contacts.length ? <section className={`${shared.panel} ${styles.resultsPanel}`}><div className={shared.panelHeader}><div><span className={shared.kicker}>PEOPLE & ACCOUNTS</span><h2>Contacts <span>{matches.contacts.length}</span></h2></div><FiUsers className={styles.panelIcon} /></div><div className={styles.resultsList}>{matches.contacts.map((contact) => <button className={styles.result} type="button" key={contact.id} onClick={() => onOpenContact(contact)}><span className={`${styles.resultIcon} ${styles.personIcon}`}>{contact.name.split(" ").map((part) => part[0]).join("")}</span><span className={styles.resultMain}><strong>{contact.name}</strong><small>{contact.title} · {contact.company}</small></span><span className={styles.resultMeta}><b>{contact.status}</b><small><FiMail /> {contact.email}</small></span><FiArrowRight className={styles.arrow} /></button>)}</div></section> : null}
    </div>
  );
};

export default Search;
