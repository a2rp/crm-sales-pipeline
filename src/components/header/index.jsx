import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiBriefcase, FiCheckSquare, FiGithub, FiGrid, FiMenu, FiPlus, FiSearch, FiTarget, FiUsers, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const links = [
  { to: "/overview", label: "Overview", Icon: FiGrid },
  { to: "/pipeline", label: "Pipeline", Icon: FiBriefcase },
  { to: "/contacts", label: "People", Icon: FiUsers },
  { to: "/activities", label: "Tasks", Icon: FiCheckSquare },
];

const Header = ({ searchValue, onSearchChange, onSearch, onNewDeal, taskCount }) => {
  const lastScroll = useRef(0);
  const searchInput = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        window.setTimeout(() => searchInput.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (menuOpen || current < 24 || current < lastScroll.current - 8) setHidden(false);
      else if (current > lastScroll.current + 8) setHidden(true);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const submitSearch = (event) => {
    event.preventDefault();
    onSearch(searchValue.trim());
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <header className={`${styles.header} ${hidden && !menuOpen ? styles.hidden : ""} ${menuOpen ? styles.menuOpen : ""}`}>
      <div className={styles.inner}>
        <NavLink to="/overview" className={styles.brand} aria-label="Northstar sales workspace">
          <span className={styles.mark}><FiTarget aria-hidden="true" /></span>
          <span className={styles.brandCopy}><strong>northstar</strong><small>REVENUE TEAM</small></span>
        </NavLink>

        <nav className={styles.nav} aria-label="Main navigation">
          {links.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {label === "Tasks" && taskCount > 0 ? <span className={styles.taskBadge}>{taskCount}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <form className={`${styles.search} ${searchOpen ? styles.searchOpen : ""}`} onSubmit={submitSearch} role="search">
            <FiSearch aria-hidden="true" />
            <input ref={searchInput} aria-label="Search deals and contacts" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search deals, contacts" />
            <kbd>Ctrl K</kbd>
            <button className={styles.searchToggle} type="button" aria-label="Open global search" onClick={() => { setSearchOpen(true); window.setTimeout(() => searchInput.current?.focus(), 0); }}><FiSearch /></button>
          </form>
          <a className={styles.repoLink} href="https://github.com/a2rp/crm-sales-pipeline" target="_blank" rel="noreferrer" aria-label="Open the crm-sales-pipeline GitHub repository"><FiGithub aria-hidden="true" /><span>Repository</span></a>
          <button className={styles.newDeal} type="button" onClick={onNewDeal}><FiPlus aria-hidden="true" /><span>New deal</span></button>
          <div className={styles.profile} aria-label="Signed in as Maya Chen"><span>MC</span><small>Maya Chen</small></div>
          <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <FiX /> : <FiMenu />}</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
