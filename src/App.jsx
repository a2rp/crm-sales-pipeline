import { useCallback, useMemo, useState } from "react";
import { FiBriefcase, FiCalendar, FiEdit2, FiMail, FiPhone, FiTrash2, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import ContactForm from "./components/contactform";
import Footer from "./components/footer";
import Header from "./components/header";
import DealForm from "./components/dealform";
import Modal from "./components/modal";
import ScrollToTop from "./components/scrollToTop";
import TaskForm from "./components/taskform";
import Toast from "./components/toast";
import { formatCurrency, formatDate, initialContacts, initialDeals, initialTasks } from "./data";
import styles from "./App.module.css";

const makeId = (items, prefix) => {
  const largest = items.reduce((max, item) => Math.max(max, Number(item.id.replace(`${prefix}-`, "")) || 0), 0);
  return `${prefix}-${largest + 1}`;
};

const InfoRow = ({ icon: Icon, label, children }) => <div className={styles.infoRow}><span className={styles.infoIcon}><Icon aria-hidden="true" /></span><span><small>{label}</small><strong>{children}</strong></span></div>;

const App = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState(() => initialDeals.map((deal) => ({ ...deal })));
  const [contacts, setContacts] = useState(() => initialContacts.map((contact) => ({ ...contact })));
  const [tasks, setTasks] = useState(() => initialTasks.map((task) => ({ ...task })));
  const [dialog, setDialog] = useState(null);
  const [notices, setNotices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const closeDialog = useCallback(() => setDialog(null), []);
  const dismissToast = useCallback((id) => setNotices((current) => current.filter((item) => item.id !== id)), []);
  const notify = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotices((current) => [...current.slice(-3), { id, message, type }]);
  }, []);
  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const search = useCallback((query) => navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`), [navigate]);
  const open = useCallback((type, record = null) => setDialog({ type, record }), []);

  const saveDeal = (values) => {
    if (dialog.record) {
      setDeals((current) => current.map((deal) => deal.id === dialog.record.id ? { ...deal, ...values, lastActivity: "Just updated" } : deal));
      notify("Deal details saved.");
    } else {
      setDeals((current) => [{ ...values, id: makeId(current, "NS"), lastActivity: "Just added" }, ...current]);
      notify("Deal added to the pipeline.");
    }
    closeDialog();
  };
  const saveContact = (values) => {
    if (dialog.record) {
      setContacts((current) => current.map((contact) => contact.id === dialog.record.id ? { ...contact, ...values } : contact));
      notify("Contact details saved.");
    } else {
      setContacts((current) => [{ ...values, id: makeId(current, "C"), lastContact: "Just added" }, ...current]);
      notify("Contact added to your relationships.");
    }
    closeDialog();
  };
  const saveTask = (values) => {
    if (dialog.record) {
      setTasks((current) => current.map((task) => task.id === dialog.record.id ? { ...task, ...values } : task));
      notify("Task details saved.");
    } else {
      setTasks((current) => [{ ...values, id: makeId(current, "T"), completed: false }, ...current]);
      notify("Task added to your activity list.");
    }
    closeDialog();
  };
  const toggleTask = (id) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    setTasks((current) => current.map((item) => item.id === id ? { ...item, completed: !item.completed } : item));
    notify(task.completed ? "Task moved back to open." : "Task marked complete.");
  };
  const moveDeal = (id, stage) => {
    const probabilityByStage = { Qualification: 20, Discovery: 35, Proposal: 55, Negotiation: 80, "Closed won": 100, "Closed lost": 0 };
    const deal = deals.find((item) => item.id === id);
    if (!deal || deal.stage === stage) return;
    setDeals((current) => current.map((item) => item.id === id ? { ...item, stage, probability: probabilityByStage[stage] ?? item.probability, lastActivity: "Stage updated just now" } : item));
    notify(`${deal.name} moved to ${stage}.`);
  };
  const requestDelete = (kind, record) => open("confirmDelete", { kind, record });
  const confirmDelete = () => {
    const { kind, record } = dialog.record;
    if (kind === "deal") {
      setDeals((current) => current.filter((deal) => deal.id !== record.id));
      setTasks((current) => current.map((task) => task.dealId === record.id ? { ...task, dealId: "" } : task));
      notify(`${record.name} was removed from the pipeline.`);
    } else if (kind === "contact") {
      setContacts((current) => current.filter((contact) => contact.id !== record.id));
      notify(`${record.name} was removed from your contacts.`);
    } else {
      setTasks((current) => current.filter((task) => task.id !== record.id));
      notify("Task removed from the activity list.");
    }
    closeDialog();
  };

  const pageProps = {
    deals, contacts, tasks,
    onNewDeal: () => open("dealForm"),
    onEditDeal: (deal) => open("dealForm", deal),
    onDeleteDeal: (deal) => requestDelete("deal", deal),
    onStageChange: moveDeal,
    onOpenDeal: (deal) => open("dealDetails", deal),
    onNewContact: () => open("contactForm"),
    onEditContact: (contact) => open("contactForm", contact),
    onDeleteContact: (contact) => requestDelete("contact", contact),
    onOpenContact: (contact) => open("contactDetails", contact),
    onNewTask: () => open("taskForm"),
    onEditTask: (task) => open("taskForm", task),
    onDeleteTask: (task) => requestDelete("task", task),
    onToggleTask: toggleTask,
    onCompleteTask: toggleTask,
  };

  const renderDialog = () => {
    if (!dialog) return null;
    const { type, record } = dialog;
    if (type === "dealForm") return <Modal title={record ? "Edit deal" : "Create a deal"} description="Keep the value, owner, and next step current." onClose={closeDialog} size="large"><DealForm initialDeal={record} onSubmit={saveDeal} onCancel={closeDialog} /></Modal>;
    if (type === "contactForm") return <Modal title={record ? "Edit contact" : "Add a contact"} description="Give your team the context to build a stronger relationship." onClose={closeDialog}><ContactForm initialContact={record} onSubmit={saveContact} onCancel={closeDialog} /></Modal>;
    if (type === "taskForm") return <Modal title={record ? "Edit task" : "Add an activity"} description="Capture the next useful action and when it is due." onClose={closeDialog}><TaskForm initialTask={record} deals={deals} onSubmit={saveTask} onCancel={closeDialog} /></Modal>;
    if (type === "confirmDelete") {
      const labels = { deal: "deal", contact: "contact", task: "task" };
      const noun = labels[record.kind];
      const name = record.record.title || record.record.name;
      const description = record.kind === "deal" ? `“${name}” will be removed. Related tasks will remain and be unlinked.` : `“${name}” will be removed from this workspace.`;
      return <Modal title={`Remove this ${noun}?`} description={description} onClose={closeDialog} size="small" role="alertdialog"><div className={styles.confirmActions}><button className={styles.cancelButton} type="button" onClick={closeDialog}>Keep it</button><button className={styles.deleteButton} type="button" onClick={confirmDelete}><FiTrash2 /> Remove {noun}</button></div></Modal>;
    }
    if (type === "dealDetails") {
      const linkedTasks = tasks.filter((task) => task.dealId === record.id);
      return <Modal title={record.name} description={`${record.id} · ${record.company}`} onClose={closeDialog}><div className={styles.detailBody}><div className={styles.detailHero}><span className={styles.stagePill}>{record.stage}</span><strong>{formatCurrency(record.value)}</strong><small>{record.probability}% win probability</small></div><div className={styles.detailGrid}><InfoRow icon={FiBriefcase} label="Account">{record.company}</InfoRow><InfoRow icon={FiUsers} label="Deal owner">{record.owner}</InfoRow><InfoRow icon={FiCalendar} label="Expected close">{formatDate(record.closeDate, { month: "long", day: "numeric", year: "numeric" })}</InfoRow><InfoRow icon={FiMail} label="Lead source">{record.source || "Not specified"}</InfoRow></div><div className={styles.nextStepCard}><small>Next step</small><strong>{record.nextStep}</strong></div>{linkedTasks.length ? <div className={styles.linkedTasks}><small>RELATED ACTIVITIES</small>{linkedTasks.map((task) => <p key={task.id}>{task.title} · {formatDate(task.dueDate)}</p>)}</div> : null}<div className={styles.detailActions}><button className={styles.cancelButton} type="button" onClick={closeDialog}>Close</button><button className={styles.editButton} type="button" onClick={() => open("dealForm", record)}><FiEdit2 /> Edit deal</button></div></div></Modal>;
    }
    if (type === "contactDetails") return <Modal title={record.name} description={`${record.title || "Contact"} · ${record.company}`} onClose={closeDialog}><div className={styles.detailBody}><div className={styles.detailGrid}><InfoRow icon={FiBriefcase} label="Account">{record.company}</InfoRow><InfoRow icon={FiUsers} label="Relationship owner">{record.owner}</InfoRow><InfoRow icon={FiMail} label="Email"><a href={`mailto:${record.email}`}>{record.email}</a></InfoRow><InfoRow icon={FiPhone} label="Phone">{record.phone ? <a href={`tel:${record.phone.replace(/[^+\d]/g, "")}`}>{record.phone}</a> : "Not provided"}</InfoRow></div><div className={styles.detailActions}><button className={styles.cancelButton} type="button" onClick={closeDialog}>Close</button><button className={styles.editButton} type="button" onClick={() => open("contactForm", record)}><FiEdit2 /> Edit contact</button></div></div></Modal>;
    return null;
  };

  return <div className={styles.app}><ScrollToTop /><Header searchValue={searchValue} onSearchChange={setSearchValue} onSearch={search} onNewDeal={pageProps.onNewDeal} taskCount={pendingTasks} /><main id="main-content" className={styles.main}><AppRoutes pageProps={pageProps} /></main><Footer /><Toast items={notices} onDismiss={dismissToast} />{renderDialog()}</div>;
};

export default App;
