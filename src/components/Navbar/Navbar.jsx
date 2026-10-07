import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

// Logo from public folder (Vercel-compatible)
const logo = "/logo.png";

// Touch device detect karne ke liye
const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches;
};

const Navbar = () => {
  const location = useLocation();

  // Mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dropdown
  const [openDropdown, setOpenDropdown] = useState(null);

  // Auto-close menu and reset dropdowns on route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Dark / Light Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Current language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("websiteLanguage") || "en";
  });

  // Apply Dark / Light Mode
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("websiteLanguage", newLanguage);
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: newLanguage },
      })
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  // ====== HOVER HANDLERS (desktop) ======
  const handleMouseEnter = (name) => {
    if (isTouchDevice()) return;
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice()) return;
    setOpenDropdown(null);
  };

  // ====== CLICK HANDLER (mobile) ======
  const toggleDropdown = (name) => {
    if (!isTouchDevice()) return;
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Dropdown items
  const dropdowns = {
    initiative: [
      { name: "Government", path: "/initiative/government" },
      { name: "NGO", path: "/initiative/ngo" },
      { name: "CBO", path: "/initiative/cbo" },
    ],
    consultation: [
      { name: "Policies", path: "/consultation/policies" },
      { name: "Project Protection", path: "/consultation/project-protection" },
      { name: "Products", path: "/consultation/products" },
    ],
    gallery: [
      { name: "News", path: "/gallery/news" },
      { name: "Images", path: "/gallery/images" },
      { name: "Videos", path: "/gallery/videos" },
    ],
  };

  return (
    <nav
      className={styles.navbar}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.navbarContainer}>
        {/* LOGO */}
        <div className={styles.logo}>
          <NavLink to="/" onClick={closeMenu}>
            <img
              src={logo}
              alt="Panchgavya Se Panchparivartan"
              className={styles.logoImage}
            />
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoText}>Panchgavya</span>
              <span className={styles.logoSub}>Se Panchparivartan</span>
            </div>
          </NavLink>
        </div>

        {/* HAMBURGER */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {/* NAVIGATION LINKS */}
        <ul
          className={`${styles.navLinks} ${
            isMenuOpen ? styles.active : ""
          }`}
        >
          {/* HOME */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.activeLink : ""
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>

          {/* ABOUT */}
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? styles.activeLink : ""
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
          </li>

          {/* INITIATIVE */}
          <li
            className={styles.dropdown}
            onMouseEnter={() => handleMouseEnter("initiative")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={styles.dropdownToggle}
              onClick={() => toggleDropdown("initiative")}
              aria-expanded={openDropdown === "initiative"}
            >
              Initiative
              <span className={styles.arrow}>▼</span>
            </button>
            <ul
              className={`${styles.dropdownMenu} ${
                openDropdown === "initiative" ? styles.open : ""
              }`}
            >
              {dropdowns.initiative.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      closeMenu();
                      setOpenDropdown(null);
                    }}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* CONSULTATION */}
          <li
            className={styles.dropdown}
            onMouseEnter={() => handleMouseEnter("consultation")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={styles.dropdownToggle}
              onClick={() => toggleDropdown("consultation")}
              aria-expanded={openDropdown === "consultation"}
            >
              Consultation
              <span className={styles.arrow}>▼</span>
            </button>
            <ul
              className={`${styles.dropdownMenu} ${
                openDropdown === "consultation" ? styles.open : ""
              }`}
            >
              {dropdowns.consultation.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      closeMenu();
                      setOpenDropdown(null);
                    }}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* GALLERY */}
          <li
            className={styles.dropdown}
            onMouseEnter={() => handleMouseEnter("gallery")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={styles.dropdownToggle}
              onClick={() => toggleDropdown("gallery")}
              aria-expanded={openDropdown === "gallery"}
            >
              Gallery
              <span className={styles.arrow}>▼</span>
            </button>
            <ul
              className={`${styles.dropdownMenu} ${
                openDropdown === "gallery" ? styles.open : ""
              }`}
            >
              {dropdowns.gallery.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      closeMenu();
                      setOpenDropdown(null);
                    }}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* COW RESCUE — Direct Link */}
          <li className={styles.cowRescueItem}>
            <NavLink
              to="/cow-rescue"
              className={({ isActive }) =>
                `${styles.cowRescueToggle} ${isActive ? styles.activeLink : ""}`
              }
              onClick={closeMenu}
            >
              🚨 Cow Rescue
            </NavLink>
          </li>

          {/* CONTACT */}
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? styles.activeLink : ""
              }
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </li>

          {/* DONATION */}
          <li>
            <NavLink to="/donation" onClick={closeMenu}>
              <span className={styles.donationBtn}>Support Us</span>
            </NavLink>
          </li>

          {/* LANGUAGE SELECTOR */}
          <li className={styles.languageItem}>
            <select
              className={styles.languageSelect}
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label="Select language"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
            </select>
          </li>

          {/* DARK / LIGHT MODE */}
          <li className={styles.themeToggleItem}>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className={styles.themeIcon}>
                {darkMode ? "☀️" : "🌙"}
              </span>
            </button>
          </li>
        </ul>
      </div>

      {/* MOBILE MENU BACKDROP OVERLAY */}
      {isMenuOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navbar;