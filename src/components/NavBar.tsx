import type { FunctionComponent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import type { NavLink } from "../types";

type NavBarProps = {
  links: NavLink[];
  cta: {
    href: string;
    label: string;
  };
  activePath?: string;
};

const NavBar: FunctionComponent<NavBarProps> = ({ links, cta, activePath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setIsScrolled(current > 10);
      setIsHidden(current > lastScrollY.current && current > 120);
      lastScrollY.current = current;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", isOpen);
    return () => document.body.classList.remove("nav-open");
  }, [isOpen]);

  const navClassName = useMemo(
    () =>
      clsx("nav", {
        "nav--scrolled": isScrolled,
        "nav--hidden": isHidden,
      }),
    [isScrolled, isHidden],
  );

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav aria-label="Hauptnavigation" className={navClassName} id="nav">
      <div className="nav__container">
        <a aria-label="Männerkreis Startseite" className="nav__logo" href="/">
          <span className="nav__logo-text">MÄNNERKREIS</span>
        </a>

        <button
          aria-controls="navMenu"
          aria-expanded={isOpen}
          aria-label="Navigation öffnen"
          className={clsx("nav__toggle", { "is-active": isOpen })}
          type="button"
          onClick={toggleMenu}
        >
          <span className="nav__toggle-line" />
          <span className="nav__toggle-line" />
          <span className="nav__toggle-line" />
        </button>

        <ul
          className={clsx("nav__menu", { "is-active": isOpen })}
          id="navMenu"
        >
          {links.map((link) => {
            const isActive = activePath === link.href;
            return (
              <li key={link.href}>
                <a
                  className={clsx("nav__link", { "is-active": isActive })}
                  href={link.href}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
          <li>
            <a
              className="nav__link nav__link--cta"
              href={cta.href}
              onClick={closeMenu}
            >
              {cta.label}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
