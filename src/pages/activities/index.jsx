import { useMemo, useState } from "react";
import { FiCalendar, FiCheck, FiCheckCircle, FiClock, FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { formatDate, toLocalISODate } from "../../data";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const Activities = ({ tasks, deals, onNewTask, onEditTask, onDeleteTask, onToggleTask }) => {
  const [filter, setFilter] = useState("Open");
  const [query, setQuery] = useState("");
  const today = toLocalISODate();
  const pending = tasks.filter((task) => !task.completed).length;
  const overdue = tasks.filter((task) => !task.completed && task.dueDate < today).length;
  const complete = tasks.filter((task) => task.completed).length;
  const visible = useMemo(() => tasks.filter((task) => (filter === "All" || (filter === "Open" ? !task.completed : task.completed)) && `${task.title} ${task.kind} ${task.owner}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => Number(a.completed) - Number(b.completed) || a.dueDate.localeCompare(b.dueDate)), [filter, query, tasks]);
  const dealName = (id) => deals.find((deal) => deal.id === id)?.name || "No linked deal";

  return (
    <div className={shared.page}>
      <div className={shared.pageHeader}>
        <div><span className={shared.eyebrow}>SELLING WITH INTENTION · {pending} OPEN TASKS</span><h1>Activities & next steps</h1><p className={shared.lead}>A clear place for every call, note, and follow-up.</p></div>
        <button className={shared.primaryButton} type="button" onClick={onNewTask}><FiPlus /> Add task</button>
      </div>
      <section className={styles.summary} aria-label="Task summary"><div className={styles.summaryIcon}><FiCalendar /></div><div><small>Open tasks</small><strong>{pending}</strong></div><div className={styles.divider} /><div><small>Past due</small><strong className={overdue ? styles.lateNumber : ""}>{overdue}</strong></div><div className={styles.divider} /><div><small>Completed</small><strong>{complete}</strong></div><p>{overdue ? `${overdue} follow-up${overdue > 1 ? "s" : ""} need attention.` : "Your follow-ups are on track."}</p></section>
      <section className={shared.panel}>
        <div className={styles.toolbar}><div className={styles.tabs} role="tablist" aria-label="Filter tasks">{["Open", "All", "Completed"].map((item) => <button type="button" role="tab" aria-selected={filter === item} className={filter === item ? styles.activeTab : ""} key={item} onClick={() => setFilter(item)}>{item}<span>{item === "All" ? tasks.length : item === "Open" ? pending : complete}</span></button>)}</div><label className={styles.search}><FiSearch /><span className={styles.srOnly}>Search activities</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activities" /></label></div>
        {visible.length ? <div className={styles.taskList}>{visible.map((task) => {
          const isLate = !task.completed && task.dueDate < today;
          return <article className={`${styles.task} ${task.completed ? styles.completed : ""}`} key={task.id}>
            <button type="button" className={styles.completeButton} aria-label={task.completed ? `Reopen ${task.title}` : `Mark ${task.title} complete`} onClick={() => onToggleTask(task.id)}>{task.completed ? <FiCheck /> : <FiCheckCircle />}</button>
            <div className={styles.taskMain}><div className={styles.taskTitleRow}><h2>{task.title}</h2><span className={`${styles.kind} ${styles[`kind${task.kind.replace("-", "")}`]}`}>{task.kind}</span></div><p>{dealName(task.dealId)} <i>·</i> {task.owner}</p><div className={styles.taskMeta}><span><FiCalendar /> {formatDate(task.dueDate, { weekday: "short", month: "short", day: "numeric" })}</span><span className={isLate ? styles.late : ""}>{isLate ? <FiClock /> : null}{isLate ? "Past due" : task.completed ? "Done" : "Scheduled"}</span></div></div>
            <div className={styles.taskActions}><button type="button" onClick={() => onEditTask(task)} aria-label={`Edit ${task.title}`}><FiEdit2 /></button><button type="button" onClick={() => onDeleteTask(task)} aria-label={`Delete ${task.title}`}><FiTrash2 /></button></div>
          </article>;
        })}</div> : <div className={shared.empty}><FiCheckCircle /><strong>{query ? "No activities match that search" : filter === "Completed" ? "No completed tasks yet" : "Nothing on the list"}</strong><p>{query ? "Try a different title, owner, or activity type." : "Add a follow-up to keep your next move visible."}</p>{!query && filter !== "Completed" ? <button className={shared.primaryButton} type="button" onClick={onNewTask}><FiPlus /> Add task</button> : null}</div>}
      </section>
    </div>
  );
};

export default Activities;
