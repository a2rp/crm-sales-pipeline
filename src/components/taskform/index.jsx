import { useState } from "react";
import { dealOwners, toLocalISODate } from "../../data";
import styles from "./styles.module.css";

const TaskForm = ({ initialTask, deals = [], onSubmit, onCancel }) => {
  const [form, setForm] = useState(() => ({ title: "", kind: "Follow-up", dueDate: toLocalISODate(), owner: dealOwners[0], dealId: "", ...initialTask }));
  const [errors, setErrors] = useState({});
  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Describe the follow-up.";
    if (!form.dueDate) nextErrors.dueDate = "Choose when this task is due.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({ ...form, title: form.title.trim() });
  };
  const field = (name, label, control, wide = false) => <label className={`${styles.field} ${wide ? styles.wide : ""}`} htmlFor={`task-${name}`} key={name}><span>{label}</span>{control}{errors[name] ? <small className={styles.error}>{errors[name]}</small> : null}</label>;
  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.grid}>
        {field("title", "Task *", <input id="task-title" name="title" value={form.title} onChange={update} placeholder="What needs to happen?" aria-invalid={Boolean(errors.title)} />, true)}
        {field("kind", "Activity type", <select id="task-kind" name="kind" value={form.kind} onChange={update}>{["Follow-up", "Call", "Email", "Meeting", "Demo"].map((kind) => <option key={kind}>{kind}</option>)}</select>)}
        {field("dueDate", "Due date *", <input id="task-dueDate" name="dueDate" type="date" value={form.dueDate} onChange={update} aria-invalid={Boolean(errors.dueDate)} />)}
        {field("owner", "Assigned to", <select id="task-owner" name="owner" value={form.owner} onChange={update}>{dealOwners.map((owner) => <option key={owner}>{owner}</option>)}</select>)}
        {field("dealId", "Related deal", <select id="task-dealId" name="dealId" value={form.dealId} onChange={update}><option value="">No linked deal</option>{deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.name} · {deal.company}</option>)}</select>, true)}
      </div>
      <div className={styles.actions}><button className={styles.cancel} type="button" onClick={onCancel}>Cancel</button><button className={styles.submit} type="submit">{initialTask ? "Save task" : "Add task"}</button></div>
    </form>
  );
};

export default TaskForm;
