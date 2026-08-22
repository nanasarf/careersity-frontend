import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <section className="auth-story">
        <Link to="/" className="brand text-white"><span className="brand-mark" aria-hidden="true" /> Careersity</Link>
        <div><p className="eyebrow">Your academic path to practice</p><h1>Build a career through structured learning.</h1><p>University-inspired pathways make the next course, skill, and milestone clear.</p></div>
        <small>Learn with direction. Progress with confidence.</small>
      </section>
      <main className="auth-panel"><div className="auth-card"><Outlet /></div></main>
    </div>
  );
}
