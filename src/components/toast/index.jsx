import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };

const ToastItem = ({ toast, onDismiss }) => {
  const Icon = icons[toast.type] || icons.info;
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.duration || 4200);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast.duration, toast.id]);
  return (
    <div className={`${styles.toast} ${styles[toast.type] || styles.info}`} role={toast.type === "error" ? "alert" : "status"}>
      <Icon className={styles.icon} aria-hidden="true" />
      <p>{toast.message}</p>
      <button type="button" aria-label="Dismiss notification" onClick={() => onDismiss(toast.id)}><FiX /></button>
    </div>
  );
};

const Toast = ({ items = [], onDismiss }) => (
  <div className={styles.stack} aria-live="polite" aria-relevant="additions removals">
    {items.map((toast) => <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />)}
  </div>
);

export default Toast;
