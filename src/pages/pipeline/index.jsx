import { useMemo, useState } from "react";
import { FiArrowRight, FiBriefcase, FiCalendar, FiChevronDown, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { dealOwners, dealStages, formatCurrency, formatDate } from "../../data";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const Pipeline = ({ deals, onNewDeal, onEditDeal, onDeleteDeal, onStageChange, onOpenDeal }) => {
  const [owner, setOwner] = useState("All owners");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("closeDate");
  const filtered = useMemo(() => deals.filter((deal) => (owner === "All owners" || deal.owner === owner) && `${deal.name} ${deal.company} ${deal.id}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => sort === "value" ? b.value - a.value : a.closeDate.localeCompare(b.closeDate)), [deals, owner, search, sort]);
  const activeDeals = filtered.filter((deal) => !deal.stage.startsWith("Closed"));
  const total = activeDeals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className={shared.page}>
      <div className={shared.pageHeader}>
        <div><span className={shared.eyebrow}>REVENUE OPERATIONS · {filtered.length} DEALS</span><h1>Sales pipeline</h1><p className={shared.lead}>Keep the next move clear, from first conversation to close.</p></div>
        <button className={shared.primaryButton} type="button" onClick={onNewDeal}><FiPlus /> Add deal</button>
      </div>
      <section className={styles.summary} aria-label="Pipeline summary"><div><span>Open pipeline</span><strong>{formatCurrency(total, true)}</strong></div><div><span>Active deals</span><strong>{activeDeals.length}</strong></div><div><span>Closed won</span><strong>{deals.filter((deal) => deal.stage === "Closed won").length}</strong></div><div className={styles.summaryNote}><FiArrowRight /> Drag the plan forward with a stage update</div></section>
      <section className={styles.filters} aria-label="Pipeline filters">
        <label className={styles.search}><span className={styles.srOnly}>Search deals</span><FiBriefcase /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a deal or account" /></label>
        <label className={styles.selectFilter}><span>Owner</span><select value={owner} onChange={(event) => setOwner(event.target.value)}><option>All owners</option>{dealOwners.map((person) => <option key={person}>{person}</option>)}</select><FiChevronDown /></label>
        <label className={styles.selectFilter}><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="closeDate">Close date</option><option value="value">Deal value</option></select><FiChevronDown /></label>
        <span className={styles.filterCount}>{filtered.length} shown</span>
      </section>
      <div className={styles.board} aria-label="Deal stages">
        {dealStages.map((stage, stageIndex) => {
          const items = filtered.filter((deal) => deal.stage === stage);
          const stageTotal = items.reduce((sum, deal) => sum + deal.value, 0);
          return <section className={`${styles.column} ${styles[`column${stageIndex}`]}`} key={stage} aria-label={`${stage}, ${items.length} deals`}>
            <header className={styles.columnHeader}><div><span className={`${styles.stageDot} ${styles[`dot${stageIndex}`]}`} /><h2>{stage}</h2><span className={styles.count}>{items.length}</span></div><small>{formatCurrency(stageTotal, true)}</small></header>
            <div className={styles.cards}>{items.map((deal) => <article className={styles.dealCard} key={deal.id}>
              <div className={styles.cardMeta}><span>{deal.id}</span><div className={styles.cardActions}><button type="button" aria-label={`Edit ${deal.name}`} onClick={() => onEditDeal(deal)}><FiEdit2 /></button><button type="button" aria-label={`Delete ${deal.name}`} onClick={() => onDeleteDeal(deal)}><FiTrash2 /></button></div></div>
              <button type="button" className={styles.dealTitle} onClick={() => onOpenDeal(deal)}>{deal.name}</button>
              <p className={styles.company}>{deal.company}</p>
              <div className={styles.valueLine}><strong>{formatCurrency(deal.value)}</strong><span>{deal.probability}% likely</span></div>
              <div className={styles.probability}><span style={{ width: `${deal.probability}%` }} /></div>
              <div className={styles.cardBottom}><span className={styles.owner}><i>{deal.owner.split(" ").map((part) => part[0]).join("")}</i>{deal.owner}</span><span className={styles.closeDate}><FiCalendar /> {formatDate(deal.closeDate)}</span></div>
              <div className={styles.nextStep}><span>Next</span><strong>{deal.nextStep}</strong></div>
              <label className={styles.move}><span>Move to</span><select value={deal.stage} onChange={(event) => onStageChange(deal.id, event.target.value)} aria-label={`Move ${deal.name} to another stage`}>{dealStages.map((option) => <option key={option}>{option}</option>)}</select><FiChevronDown /></label>
            </article>)}</div>
            <button type="button" className={styles.addCard} onClick={onNewDeal}><FiPlus /> Add a deal</button>
          </section>;
        })}
      </div>
      {filtered.length === 0 ? <div className={`${shared.panel} ${shared.empty}`}><FiBriefcase /><strong>No deals match this view</strong><p>Try another owner or search term. You can also add a new deal.</p><button className={shared.primaryButton} type="button" onClick={onNewDeal}><FiPlus /> Add deal</button></div> : null}
    </div>
  );
};

export default Pipeline;
