import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy"><div className="eyebrow">Structured education for a career</div><h1>
            Build the skills for the career you want.
          </h1>
          <p>
            Free, structured learning pathways organized by job title. Start
            where you are, build what you need.
          </p>
          <div className="hero-actions">
            <Link
              to="/careers"
              className="hero-primary"
            >
              Browse careers
            </Link>
            <Link
              to="/register"
              className="hero-secondary"
            >
              Get started free
            </Link>
          </div></div>
          <aside className="pathway-preview" aria-label="Example career curriculum">
            <p className="preview-label">Curriculum preview</p><h2 className="preview-title">Data Analyst pathway</h2>
            {[['100','Foundations','4 courses'],['200','Core methods','5 courses'],['300','Applied practice','4 courses'],['400','Career mastery','3 courses']].map(([level,title,count]) => <div className="preview-level" key={level}><strong>{level}</strong><span>{title}</span><small>{count}</small></div>)}
          </aside>
        </div>
      </section>

      {/* How it works */}
      <section className="home-section">
        <div className="home-section-inner">
          <div className="section-heading"><div className="eyebrow justify-center text-red-700">A clearer route forward</div><h2 className="text-3xl font-bold">How Careersity works</h2><p>Move from curiosity to career readiness with a curriculum that makes every stage visible.</p></div>
          <div className="steps">
            {[
              {
                step: "1",
                title: "Choose a career",
                desc: "Browse structured pathways organized by job title — from Data Analyst to UX Designer.",
              },
              {
                step: "2",
                title: "Follow the pathway",
                desc: "Each pathway breaks down the skills and courses you need at every level.",
              },
              {
                step: "3",
                title: "Build your skills",
                desc: "Complete lessons, pass assessments, and track your progress to career-ready.",
              },
            ].map(({ step, title, desc }) => (
              <article key={step} className="step-card">
                <div className="step-number">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
