import { useState } from "react";
import { dealOwners, dealStages, toLocalISODate } from "../../data";
import styles from "./styles.module.css";

const DealForm = ({ initialDeal, onSubmit, onCancel }) => {
  const [form, setForm] = useState(() => ({ name: "", company: "", stage: dealStages[0], closeDate: toLocalISODate(), owner: dealOwners[0], source: "", nextStep: "", ...initialDeal, value: initialDeal?.value ?? "", probability: String(initialDeal?.probability ?? 20) }));
  const [errors, setErrors] = useState({});
  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Add a clear deal name.";
    if (!form.company.trim()) nextErrors.company = "Enter the account name.";
    if (!Number.isFinite(Number(form.value)) || Number(form.value) <= 0) nextErrors.value = "Deal value must be greater than $0.";
    if (!form.closeDate) nextErrors.closeDate = "Choose an expected close date.";
    if (!form.nextStep.trim()) nextErrors.nextStep = "Add the next action for this deal.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({ ...form, name: form.name.trim(), company: form.company.trim(), value: Number(form.value), probability: Number(form.probability), source: form.source.trim(), nextStep: form.nextStep.trim() });
  };
  const field = (name, label, control, wide = false) => <label className={`${styles.field} ${wide ? styles.wide : ""}`} htmlFor={`deal-${name}`} key={name}><span>{label}</span>{control}{errors[name] ? <small className={styles.error}>{errors[name]}</small> : null}</label>;
  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.grid}>
        {field("name", "Deal name *", <input id="deal-name" name="name" value={form.name} onChange={update} placeholder="e.g. Regional data platform" aria-invalid={Boolean(errors.name)} />)}
        {field("company", "Account *", <input id="deal-company" name="company" value={form.company} onChange={update} placeholder="Company name" aria-invalid={Boolean(errors.company)} />)}
        {field("value", "Deal value (USD) *", <input id="deal-value" name="value" type="number" min="1" step="100" value={form.value} onChange={update} placeholder="25000" aria-invalid={Boolean(errors.value)} />)}
        {field("stage", "Pipeline stage", <select id="deal-stage" name="stage" value={form.stage} onChange={update}>{dealStages.map((stage) => <option key={stage}>{stage}</option>)}</select>)}
        {field("probability", "Win probability", <div className={styles.probability}><input id="deal-probability" name="probability" type="range" min="0" max="100" step="5" value={form.probability} onChange={update} /><strong>{form.probability}%</strong></div>)}
        {field("closeDate", "Expected close *", <input id="deal-closeDate" name="closeDate" type="date" value={form.closeDate} onChange={update} aria-invalid={Boolean(errors.closeDate)} />)}
        {field("owner", "Deal owner", <select id="deal-owner" name="owner" value={form.owner} onChange={update}>{dealOwners.map((owner) => <option key={owner}>{owner}</option>)}</select>)}
        {field("source", "Lead source", <input id="deal-source" name="source" value={form.source} onChange={update} placeholder="e.g. Partner referral" />)}
        {field("nextStep", "Next step *", <input id="deal-nextStep" name="nextStep" value={form.nextStep} onChange={update} placeholder="What happens next?" aria-invalid={Boolean(errors.nextStep)} />, true)}
      </div>
      <div className={styles.actions}><button className={styles.cancel} type="button" onClick={onCancel}>Cancel</button><button className={styles.submit} type="submit">{initialDeal ? "Save changes" : "Create deal"}</button></div>
    </form>
  );
};

export default DealForm;
