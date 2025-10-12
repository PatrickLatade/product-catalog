import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { useState } from "react";

export function Welcome() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center gap-16 pt-16 pb-24">
      {/* Header */}
      <header className="flex flex-col items-center gap-9">
        <div className="w-[500px] max-w-[100vw] p-4">
          <img
            src={logoLight}
            alt="React Router"
            className="block w-full dark:hidden"
          />
          <img
            src={logoDark}
            alt="React Router"
            className="hidden w-full dark:block"
          />
        </div>
      </header>

      {/* ✅ Hero Section */}
      <div className="hero bg-base-200 rounded-2xl shadow-xl w-[90%] max-w-4xl">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Your App!</h1>
            <p className="py-6">
              TailwindCSS v4 + DaisyUI v5 are fully integrated.
              Explore powerful prebuilt components and dark mode support.
            </p>
            <button className="btn btn-primary" onClick={() => setOpenModal(true)}>
              Launch Demo Modal
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Alert */}
      <div className="alert alert-success w-96 shadow-lg">
        <span>Tailwind + DaisyUI are working 🎉</span>
      </div>

      {/* ✅ Card with menu links */}
      <div className="card w-96 bg-base-100 shadow-xl dark:bg-base-200">
        <div className="card-body">
          <h2 className="card-title justify-center">Resources</h2>
          <ul className="menu">
            {resources.map(({ href, text, icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3"
                >
                  {icon}
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ✅ Stats Example */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Users</div>
          <div className="stat-value">31K</div>
          <div className="stat-desc">↗︎ 12% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-title">Downloads</div>
          <div className="stat-value">4,200</div>
          <div className="stat-desc">↘︎ 5% decrease</div>
        </div>

        <div className="stat">
          <div className="stat-title">Revenue</div>
          <div className="stat-value">$120K</div>
          <div className="stat-desc">↗︎ 18% growth</div>
        </div>
      </div>

      {/* ✅ Accordion Example */}
      <div className="collapse collapse-arrow bg-base-200 w-96">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          What is DaisyUI?
        </div>
        <div className="collapse-content">
          <p>
            DaisyUI is a TailwindCSS component library with beautiful themes and
            responsive design built-in. It saves tons of time for UI work!
          </p>
        </div>
      </div>

      {/* ✅ Footer */}
      <footer className="footer p-10 bg-base-200 text-base-content rounded-t-xl mt-12 w-full max-w-4xl">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>

      {/* ✅ Modal */}
      {openModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">DaisyUI Modal</h3>
            <p className="py-4">
              This modal is powered entirely by DaisyUI components!
            </p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
}

const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router Docs",
    icon: "📘",
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
    icon: "💬",
  },
];
