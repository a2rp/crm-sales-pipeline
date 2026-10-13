import styles from "./styles.module.css";

const Loading = ({ label = "Loading workspace" }) => (
  <div className={styles.loading} role="status" aria-label={label}>
    <span className={styles.spinner} aria-hidden="true" />
    <span className={styles.text}>{label}</span>
  </div>
);

export default Loading;
