import { FiArrowDownRight, FiArrowRight, FiArrowUpRight, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiTarget, FiTrendingUp, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { dealStages, formatCurrency, formatDate, toLocalISODate } from "../../data";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const Overview = ({ deals, contacts, tasks, onOpenDeal, onCompleteTask }) => {
  const activeDeals = deals.filter((deal) => !deal.stage.startsWith("Closed"));
  const pipeline = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
  const forecast = activeDeals.reduce((sum, deal) => sum + deal.value * deal.probability / 100, 0);
  const won = deals.filter((deal) => deal.stage === "Closed won");
  const lost = deals.filter((deal) => deal.stage === "Closed lost");
  const closed = won.length + lost.length;
  const winRate = closed ? Math.round(won.length / closed * 100) : 0;
  const overdue = tasks.filter((task) => !task.completed && task.dueDate < toLocalISODate()).length;
  const stages = dealStages.slice(0, 4).map((stage) => ({ stage, total: activeDeals.filter((deal) => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0), count: activeDeals.filter((deal) => deal.stage === stage).length }));
  const maxStage = Math.max(...stages.map((stage) => stage.total), 1);
  const priorities = [...activeDeals].sort((a, b) => new Date(a.closeDate) - new Date(b.closeDate)).slice(0, 4);
  const dueTasks = tasks.filter((task) => !task.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase();

  return (
    <div className={shared.page}>
      <div className={shared.pageHeader}>
        <div><span className={shared.eyebrow}>{today} · TEAM OVERVIEW</span><h1>{greeting}, Maya.</h1><p className={shared.lead}>Here’s the shape of your revenue work this week.</p></div>
        <Link className={shared.primaryButton} to="/pipeline"><FiBriefcase /> View pipeline <FiArrowRight /></Link>
      </div>
      <section className={styles.metrics} aria-label="Sales performance">
        <article className={`${styles.metric} ${styles.featured}`}><div className={styles.metricTop}><span className={styles.metricIcon}><FiBriefcase /></span><span className={styles.trend}><FiArrowUpRight /> 12.8%</span></div><small>Open pipeline</small><strong>{formatCurrency(pipeline, true)}</strong><p>{activeDeals.length} deals moving across the team</p><div className={styles.sparkline} aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
        <article className={styles.metric}><div className={styles.metricTop}><span className={styles.metricIcon}><FiTarget /></span><span className={styles.metricNote}>weighted</span></div><small>Forecast this quarter</small><strong>{formatCurrency(forecast, true)}</strong><p>Based on current deal confidence</p><div className={styles.metricFoot}><span className={styles.dot} /> On track for team target</div></article>
        <article className={styles.metric}><div className={styles.metricTop}><span className={styles.metricIcon}><FiTrendingUp /></span><span className={styles.trend}><FiArrowUpRight /> 8 pts</span></div><small>Win rate</small><strong>{winRate}%</strong><p>{won.length} wins from {closed} closed deals</p><div className={styles.miniProgress}><span style={{ width: `${winRate}%` }} /></div></article>
        <article className={`${styles.metric} ${overdue ? styles.attention : ""}`}><div className={styles.metricTop}><span className={styles.metricIcon}><FiClock /></span>{overdue ? <span className={styles.overdueTag}>{overdue} overdue</span> : <span className={styles.metricNote}>up next</span>}</div><small>Tasks to complete</small><strong>{tasks.filter((task) => !task.completed).length}</strong><p>{overdue ? "A couple of follow-ups need a look" : "Keep your next steps moving"}</p><Link to="/activities" className={styles.inlineLink}>Open task list <FiArrowRight /></Link></article>
      </section>
      <section className={styles.mainGrid}>
        <article className={`${shared.panel} ${styles.forecast}`}>
          <div className={shared.panelHeader}><div><span className={shared.kicker}>PIPELINE HEALTH</span><h2>Deals by stage</h2><p>Where your open revenue sits today</p></div><span className={styles.chartLegend}><i /> Open value</span></div>
          <div className={styles.stageChart}>{stages.map(({ stage, total, count }, index) => <div className={styles.stageRow} key={stage}><span className={styles.stageName}><i className={`${styles.stageDot} ${styles[`stage${index}`]}`} />{stage}</span><div className={styles.barTrack}><span className={`${styles.bar} ${styles[`bar${index}`]}`} style={{ width: `${Math.max(total / maxStage * 100, 3)}%` }} /></div><strong>{formatCurrency(total, true)}</strong><small>{count}</small></div>)}</div>
          <div className={styles.chartBottom}><span><b>{formatCurrency(pipeline, true)}</b> total open</span><Link to="/pipeline">Explore pipeline <FiArrowRight /></Link></div>
        </article>
        <article className={`${shared.panel} ${styles.teamPanel}`}>
          <div className={shared.panelHeader}><div><span className={shared.kicker}>THE PEOPLE</span><h2>Team pulse</h2><p>Relationships in motion</p></div><span className={styles.peopleCount}><FiUsers /> {contacts.length}</span></div>
          <div className={styles.ownerList}>{["Maya Chen", "Jordan Lee", "Alex Morgan", "Sam Rivera"].map((owner, index) => { const ownerDeals = activeDeals.filter((deal) => deal.owner === owner); return <div className={styles.ownerRow} key={owner}><span className={`${styles.avatar} ${styles[`avatar${index}`]}`}>{owner.split(" ").map((part) => part[0]).join("")}</span><span className={styles.ownerInfo}><strong>{owner}</strong><small>{ownerDeals.length} active deals</small></span><b>{formatCurrency(ownerDeals.reduce((sum, deal) => sum + deal.value, 0), true)}</b></div>; })}</div>
          <Link to="/contacts" className={styles.teamLink}>View all relationships <FiArrowRight /></Link>
        </article>
        <article className={`${shared.panel} ${styles.dealsPanel}`}>
          <div className={shared.panelHeader}><div><span className={shared.kicker}>NEEDS ATTENTION</span><h2>Priority deals</h2><p>Upcoming close dates and next steps</p></div><Link className={shared.iconButton} to="/pipeline" aria-label="Open all deals"><FiArrowRight /></Link></div>
          <div className={styles.dealList}>{priorities.map((deal) => <button type="button" className={styles.dealRow} key={deal.id} onClick={() => onOpenDeal(deal)}><span className={styles.dealGlyph}><FiBriefcase /></span><span className={styles.dealInfo}><strong>{deal.name}</strong><small>{deal.company} <i>·</i> {deal.owner}</small></span><span className={styles.dealValue}><b>{formatCurrency(deal.value, true)}</b><small>{formatDate(deal.closeDate)}</small></span><FiArrowRight className={styles.rowArrow} /></button>)}</div>
        </article>
        <article className={`${shared.panel} ${styles.tasksPanel}`}>
          <div className={shared.panelHeader}><div><span className={shared.kicker}>YOUR NEXT MOVES</span><h2>Upcoming tasks</h2><p>Small steps keep good deals moving</p></div><Link className={shared.iconButton} to="/activities" aria-label="Open all tasks"><FiCalendar /></Link></div>
          <div className={styles.taskList}>{dueTasks.map((task) => <div className={styles.taskRow} key={task.id}><button type="button" className={styles.taskCheck} aria-label={`Mark ${task.title} complete`} onClick={() => onCompleteTask(task.id)}><FiCheckCircle /></button><span className={styles.taskInfo}><strong>{task.title}</strong><small>{task.kind} <i>·</i> {task.owner}</small></span><span className={`${styles.dueDate} ${task.dueDate < toLocalISODate() ? styles.late : ""}`}>{formatDate(task.dueDate)}</span></div>)}</div>
          <Link to="/activities" className={styles.teamLink}>Open activity list <FiArrowRight /></Link>
        </article>
      </section>
      <div className={styles.caption}><FiArrowDownRight /> Numbers update as deals and tasks change. This demo keeps changes in memory for this session.</div>
    </div>
  );
};

export default Overview;
