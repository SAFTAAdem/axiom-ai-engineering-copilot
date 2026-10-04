"use client";

import { useMemo, useState } from "react";

type View = "overview" | "workspace" | "architecture" | "agents" | "api" | "delivery";

const nav: { id: View; label: string; key: string }[] = [
  { id: "overview", label: "Command center", key: "01" },
  { id: "workspace", label: "Project workspace", key: "02" },
  { id: "architecture", label: "Architecture", key: "03" },
  { id: "agents", label: "Agent studio", key: "04" },
  { id: "api", label: "API & data", key: "05" },
  { id: "delivery", label: "Delivery", key: "06" },
];

const agents = [
  ["BA", "Business Analyst", "Extracts, classifies, and traces requirements", "14 artifacts", "active"],
  ["PO", "Product Owner", "Builds epics, stories, value scores, and backlog", "26 artifacts", "active"],
  ["SA", "Software Architect", "Designs services, APIs, data, and NFR controls", "9 artifacts", "active"],
  ["UM", "UML Architect", "Produces C4, sequence, component, and ER views", "7 artifacts", "review"],
  ["QA", "QA Engineer", "Derives test suites, coverage, and acceptance criteria", "42 artifacts", "active"],
  ["SM", "Scrum Master", "Plans capacity, dependencies, and sprint outcomes", "12 artifacts", "queued"],
  ["RM", "Risk Manager", "Scores delivery, security, and compliance exposure", "8 artifacts", "active"],
  ["DO", "DevOps Engineer", "Generates pipelines, IaC, observability, and SLOs", "11 artifacts", "queued"],
];

const endpoints = [
  ["POST", "/v1/projects", "Create a governed project workspace", "project:write"],
  ["POST", "/v1/projects/{id}/documents", "Create an upload session", "document:write"],
  ["POST", "/v1/documents/{id}/process", "Parse, chunk, embed, and index", "document:process"],
  ["POST", "/v1/projects/{id}/runs", "Start an idempotent agent workflow", "run:execute"],
  ["GET", "/v1/runs/{id}/events", "Stream run events with SSE", "run:read"],
  ["GET", "/v1/projects/{id}/artifacts", "List versioned generated outputs", "artifact:read"],
  ["POST", "/v1/artifacts/{id}/approve", "Record an approval decision", "artifact:approve"],
  ["GET", "/v1/projects/{id}/traceability", "Resolve source-to-delivery lineage", "project:read"],
];

const schema = [
  ["users", "Identity & tenant membership", "id, tenant_id, email, status"],
  ["projects", "Bounded project workspace", "id, tenant_id, key, lifecycle"],
  ["documents", "Encrypted source metadata", "id, project_id, object_key, sha256"],
  ["requirements", "Versioned functional/NFR records", "id, project_id, type, priority"],
  ["epics", "Outcome-level backlog groups", "id, project_id, value_score"],
  ["user_stories", "Testable delivery increments", "id, epic_id, status, points"],
  ["sprints", "Timeboxed delivery plans", "id, project_id, goal, capacity"],
  ["tasks", "Assigned execution units", "id, story_id, sprint_id, assignee_id"],
  ["risks", "Scored mitigations and owners", "id, project_id, probability, impact"],
  ["test_cases", "Requirements-linked verification", "id, story_id, type, status"],
  ["conversations", "Project-scoped interaction threads", "id, project_id, actor_type"],
  ["audit_events", "Immutable security ledger", "id, tenant_id, actor_id, action"],
];

const risks = [
  ["R-014", "Ambiguous SSO boundary", "Critical", "Security", "M. Chen"],
  ["R-021", "Legacy billing dependency", "High", "Delivery", "L. Novak"],
  ["R-008", "PII in uploaded transcripts", "High", "Privacy", "A. Shah"],
  ["R-026", "Search relevance below target", "Medium", "AI quality", "N. Diallo"],
];

function Sparkline({ bars }: { bars: number[] }) {
  return <div className="spark" aria-label={`Trend values ${bars.join(", ")}`}>{bars.map((v, i) => <i key={i} style={{ height: `${v}%` }} />)}</div>;
}

function Header({ view, dark, setDark }: { view: View; dark: boolean; setDark: (v: boolean) => void }) {
  const title = nav.find((item) => item.id === view)?.label;
  return <header className="topbar">
    <div><p className="eyebrow">AI Software Engineering Copilot</p><h1>{title}</h1></div>
    <div className="top-actions">
      <div className="project-switch"><span>AT</span><div><b>Atlas Cloud</b><small>PRJ-2048 · Production</small></div><i>⌄</i></div>
      <button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle color theme">{dark ? "☼" : "◐"}</button>
      <button className="avatar" aria-label="Account menu">AM</button>
    </div>
  </header>;
}

function Overview({ onNavigate }: { onNavigate: (v: View) => void }) {
  return <div className="view-stack">
    <section className="hero-grid">
      <div className="hero-copy">
        <div className="live-pill"><i /> Delivery intelligence · Live</div>
        <h2>From source material<br />to <em>ship-ready systems.</em></h2>
        <p>Orchestrate requirements, architecture, quality, and delivery with an auditable team of specialist AI agents.</p>
        <div className="hero-actions"><button className="primary" onClick={() => onNavigate("workspace")}>Open project workspace <span>→</span></button><button className="secondary" onClick={() => onNavigate("architecture")}>Explore architecture</button></div>
      </div>
      <div className="run-card">
        <div className="run-card-head"><div><span>Latest orchestration</span><b>Discovery → delivery blueprint</b></div><span className="success">On track</span></div>
        <div className="run-progress"><div><b>78%</b><span>42 of 54 artifacts approved</span></div><div className="progress"><i style={{ width: "78%" }} /></div></div>
        <div className="pipeline">
          {[["01","Ingest","Complete"],["02","Analyze","Complete"],["03","Design","Running"],["04","Plan","Queued"]].map((s,i)=><div className={`pipeline-step ${i < 2 ? "done" : i === 2 ? "now" : ""}`} key={s[0]}><span>{s[0]}</span><div><b>{s[1]}</b><small>{s[2]}</small></div></div>)}
        </div>
        <div className="agent-row"><div className="agent-faces"><span>BA</span><span>PO</span><span>SA</span><span>+5</span></div><small>8 agents · last event 12s ago</small></div>
      </div>
    </section>

    <section className="kpi-grid">
      {[
        ["Requirement coverage", "94%", "+8.2%", [32,48,44,63,58,76,91]],
        ["Delivery confidence", "86", "+4.1", [52,60,55,66,64,72,84]],
        ["Open critical risks", "3", "−2 this week", [75,68,66,52,54,41,30]],
        ["Sprint readiness", "91%", "Gate passed", [28,38,52,47,65,78,92]],
      ].map((k) => <article className="kpi" key={k[0] as string}><span>{k[0] as string}</span><div><b>{k[1] as string}</b><Sparkline bars={k[3] as number[]} /></div><small>{k[2] as string}</small></article>)}
    </section>

    <section className="dashboard-grid">
      <article className="panel velocity-panel">
        <div className="panel-head"><div><p className="eyebrow">Delivery forecast</p><h3>Planned vs. completed</h3></div><select aria-label="Chart period"><option>Last 6 sprints</option></select></div>
        <div className="chart-wrap">
          <div className="y-labels"><span>60</span><span>40</span><span>20</span><span>0</span></div>
          <div className="bar-chart">{[[42,36],[47,44],[38,35],[52,46],[49,51],[56,43]].map((v,i)=><div className="bar-group" key={i}><div><i style={{height:`${v[0]*1.6}px`}}/><i style={{height:`${v[1]*1.6}px`}}/></div><span>S{i+7}</span></div>)}</div>
        </div>
        <div className="legend"><span><i className="planned"/>Planned</span><span><i className="complete"/>Completed</span><b>Forecast: 52 pts</b></div>
      </article>
      <article className="panel risk-panel">
        <div className="panel-head"><div><p className="eyebrow">Risk watch</p><h3>Highest exposure</h3></div><button className="text-button" onClick={() => onNavigate("delivery")}>View all →</button></div>
        <div className="risk-list">{risks.slice(0,3).map((r,i)=><div className="risk-item" key={r[0]}><span className={`risk-score r${i}`}>{i===0?"16":i===1?"12":"10"}</span><div><b>{r[1]}</b><small>{r[0]} · {r[3]}</small></div><span className="owner">{r[4].split(" ").map(x=>x[0]).join("")}</span></div>)}</div>
      </article>
      <article className="panel activity-panel">
        <div className="panel-head"><div><p className="eyebrow">Artifact stream</p><h3>Recent decisions</h3></div><span className="live-dot">Live</span></div>
        <div className="timeline">
          {[["SA","API v2 specification generated","2m","purple"],["QA","18 test cases linked to US-042","7m","blue"],["PO","Epic E-07 approved by product owner","18m","green"],["RM","Risk R-014 escalated to critical","31m","red"]].map(x=><div className="event" key={x[1]}><span className={x[3]}>{x[0]}</span><div><b>{x[1]}</b><small>{x[2]} ago</small></div></div>)}
        </div>
      </article>
    </section>
  </div>;
}

function Workspace() {
  const [uploaded, setUploaded] = useState(false);
  const [run, setRun] = useState(false);
  return <div className="view-stack">
    <section className="section-intro"><div><p className="eyebrow">Project PRJ-2048</p><h2>Project workspace</h2><p>Ingest sources, control the generation run, and approve every artifact before it enters the delivery baseline.</p></div><button className="primary" onClick={()=>setRun(true)}>{run ? "Workflow running · 34%" : "Run engineering workflow"}</button></section>
    <section className="workspace-grid">
      <article className="panel upload-panel">
        <div className="panel-head"><div><p className="eyebrow">01 · Sources</p><h3>Knowledge ingestion</h3></div><span className="count">4 files</span></div>
        <label className={`dropzone ${uploaded?"uploaded":""}`}><input type="file" accept=".pdf,.docx,.txt,.md" onChange={()=>setUploaded(true)} /><span className="upload-mark">↑</span><b>{uploaded ? "Source queued securely" : "Drop a specification or browse"}</b><small>PDF, DOCX, TXT, Markdown · encrypted at rest</small></label>
        <div className="file-list">{[["atlas-product-brief.pdf","2.4 MB","Indexed"],["discovery-notes.docx","860 KB","Indexed"],["security-nfrs.md","48 KB","Indexed"],["client-thread.eml","122 KB","Review"]].map((f,i)=><div key={f[0]}><span className="file-icon">{f[0].split(".").pop()?.toUpperCase()}</span><div><b>{f[0]}</b><small>{f[1]} · sha256 verified</small></div><span className={i===3?"review-badge":"indexed"}>{f[2]}</span></div>)}</div>
      </article>
      <article className="panel process-panel">
        <div className="panel-head"><div><p className="eyebrow">02 · Pipeline</p><h3>Retrieval preparation</h3></div><span className="healthy">Healthy</span></div>
        <div className="process-map">{[["Parse","1,248 pages","✓"],["Clean","98.7% quality","✓"],["Chunk","3,816 segments","✓"],["Embed","BGE-M3 / 1024d","✓"],["Index","Qdrant · hybrid","●"]].map((p,i)=><div key={p[0]}><span className={i===4?"pulse":""}>{p[2]}</span><div><b>{p[0]}</b><small>{p[1]}</small></div>{i<4&&<i/>}</div>)}</div>
        <div className="retrieval-note"><span>RAG policy</span><p>Tenant-filtered hybrid retrieval, reranked top-12 context, source citations required for every generated claim.</p></div>
      </article>
    </section>
    <article className="panel artifact-table-panel">
      <div className="panel-head"><div><p className="eyebrow">03 · Outputs</p><h3>Artifact approval queue</h3></div><div className="filter-pills"><button className="selected">All 54</button><button>Needs review 12</button><button>Approved 42</button></div></div>
      <div className="table-scroll"><table><thead><tr><th>Artifact</th><th>Owner agent</th><th>Traceability</th><th>Confidence</th><th>Status</th><th>Version</th></tr></thead><tbody>{[
        ["Functional requirements","Business Analyst","38 sources","96%","Approved","v1.4"],["Product backlog","Product Owner","24 requirements","91%","Review","v1.2"],["System architecture","Software Architect","17 NFRs","89%","Review","v2.0"],["Acceptance test suite","QA Engineer","31 stories","94%","Approved","v1.1"],["Sprint 01 plan","Scrum Master","14 stories","87%","Draft","v0.8"],["Deployment baseline","DevOps Engineer","9 controls","92%","Approved","v1.0"]].map(r=><tr key={r[0]}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td><span className="confidence"><i style={{width:r[3]}}/>{r[3]}</span></td><td><span className={`status ${r[4].toLowerCase()}`}>{r[4]}</span></td><td>{r[5]}</td></tr>)}</tbody></table></div>
    </article>
  </div>;
}

function Architecture() {
  const [focus, setFocus] = useState("Orchestrator");
  return <div className="view-stack">
    <section className="section-intro"><div><p className="eyebrow">Reference architecture</p><h2>Control plane over agent autonomy</h2><p>FastAPI services enforce identity, state, and policy. LangGraph owns deterministic workflow state; CrewAI coordinates specialist collaboration inside approved graph nodes.</p></div><div className="arch-badges"><span>Multi-tenant</span><span>Event driven</span><span>Zero trust</span></div></section>
    <section className="architecture-map panel" aria-label="System architecture diagram">
      <div className="arch-zone experience"><b>Experience</b><button onClick={()=>setFocus("Angular 18")}>Angular 18 PWA<small>Dashboard · SSE · RBAC</small></button><button onClick={()=>setFocus("API Gateway")}>API gateway<small>JWT · quota · policy</small></button></div>
      <div className="flow-arrow">→</div>
      <div className="arch-zone control"><b>Application control plane</b><div><button onClick={()=>setFocus("Core API")}>Core API<small>FastAPI</small></button><button onClick={()=>setFocus("Orchestrator")}>Orchestrator<small>LangGraph + CrewAI</small></button></div><div><button onClick={()=>setFocus("Document service")}>Document service<small>Parse · chunk · embed</small></button><button onClick={()=>setFocus("Artifact service")}>Artifact service<small>Version · approve · export</small></button></div><div><button onClick={()=>setFocus("Event worker")}>Event workers<small>Async jobs · retries</small></button><button onClick={()=>setFocus("Audit service")}>Audit service<small>Append-only evidence</small></button></div></div>
      <div className="flow-arrow">→</div>
      <div className="arch-zone intelligence"><b>AI & retrieval</b><button onClick={()=>setFocus("Groq")}>Groq LLM gateway<small>routing · budgets · fallback</small></button><button onClick={()=>setFocus("Qdrant")}>Qdrant<small>hybrid vectors · ACL filters</small></button><button onClick={()=>setFocus("Prompt registry")}>Prompt registry<small>versioned · evaluated</small></button></div>
      <div className="arch-zone platform"><b>Data & platform</b><div><button onClick={()=>setFocus("PostgreSQL")}>PostgreSQL<small>tenant records · RLS</small></button><button onClick={()=>setFocus("Redis")}>Redis<small>queue · cache · limits</small></button><button onClick={()=>setFocus("Object storage")}>Object storage<small>encrypted documents</small></button><button onClick={()=>setFocus("Observability")}>OpenTelemetry<small>logs · traces · metrics</small></button></div></div>
    </section>
    <div className="focus-strip"><span>Selected component</span><b>{focus}</b><p>{focus === "Orchestrator" ? "Persists checkpoints, validates typed agent outputs, routes human approvals, and resumes safely after failure." : "Selected architecture component with tenant-scoped authorization, audit events, health metrics, and explicit SLO ownership."}</p></div>
    <section className="three-grid">
      <article className="panel"><p className="eyebrow">Deployment</p><h3>Regional cell architecture</h3><p className="body-copy">Global edge routing sends each tenant to a regional Kubernetes cell. Stateless services autoscale independently; PostgreSQL, Redis, Qdrant, and object storage remain private.</p><div className="mini-flow"><span>Edge + WAF</span><i>→</i><span>Kubernetes cell</span><i>→</i><span>Private data plane</span></div></article>
      <article className="panel"><p className="eyebrow">Reliability targets</p><h3>Enterprise SLOs</h3><div className="metric-list"><div><span>API availability</span><b>99.95%</b></div><div><span>Run event durability</span><b>99.99%</b></div><div><span>RPO / RTO</span><b>≤5m / ≤30m</b></div><div><span>p95 read latency</span><b>&lt;300ms</b></div></div></article>
      <article className="panel"><p className="eyebrow">Trust boundary</p><h3>Defense in depth</h3><div className="chip-cloud"><span>OIDC + MFA</span><span>RBAC + ABAC</span><span>Envelope encryption</span><span>Malware scanning</span><span>Prompt isolation</span><span>DLP redaction</span><span>Signed artifacts</span><span>Audit export</span></div></article>
    </section>
  </div>;
}

function Agents() {
  const [selected, setSelected] = useState(0);
  const detail = agents[selected];
  return <div className="view-stack">
    <section className="section-intro"><div><p className="eyebrow">Agent operations</p><h2>Eight specialists. One governed workflow.</h2><p>Every agent is bounded by typed contracts, least-privilege tools, project memory, and evidence requirements.</p></div><span className="healthy">7 healthy · 1 waiting</span></section>
    <section className="agent-layout">
      <div className="agent-grid">{agents.map((a,i)=><button onClick={()=>setSelected(i)} className={`agent-card ${selected===i?"selected":""}`} key={a[0]}><span>{a[0]}</span><div><b>{a[1]}</b><small>{a[2]}</small></div><i className={a[4]}>{a[4]}</i></button>)}</div>
      <aside className="agent-detail panel"><div className="detail-title"><span>{detail[0]}</span><div><p className="eyebrow">Selected specialist</p><h3>{detail[1]}</h3></div></div><p>{detail[2]}. Produces schema-validated, versioned artifacts with explicit citations and confidence.</p>
        <div className="definition"><span>Inputs</span><p>Project brief, approved upstream artifacts, retrieved evidence, policies</p><span>Outputs</span><p>Typed JSON + Markdown artifact, trace links, assumptions, open questions</p><span>Tools</span><p>Scoped retrieval, artifact registry, validation, diagram renderer</p><span>Memory</span><p>Run checkpoint + project semantic memory; no cross-tenant context</p></div>
        <div className="prompt-box"><span>System prompt excerpt</span><p>“Act only within your role. Cite every material claim. Mark assumptions. Reject conflicting sources. Return the requested schema and request human review below confidence threshold.”</p></div>
      </aside>
    </section>
    <article className="panel workflow-panel"><div className="panel-head"><div><p className="eyebrow">LangGraph state machine</p><h3>Workflow with quality gates</h3></div><span className="version">workflow@2.3.1</span></div><div className="workflow-line">{["Ingest","BA analysis","PO shaping","Architecture","UML","QA","Risk","Sprint plan","DevOps","Baseline"].map((x,i)=><div key={x}><span className={i<6?"complete":i===6?"current":""}>{i<6?"✓":String(i+1).padStart(2,"0")}</span><b>{x}</b>{i<9&&<i/>}</div>)}</div></article>
  </div>;
}

function ApiData() {
  const [tab, setTab] = useState<"api"|"data">("api");
  return <div className="view-stack">
    <section className="section-intro"><div><p className="eyebrow">Platform contracts</p><h2>API and relational model</h2><p>Versioned REST resources, SSE events, idempotent commands, and tenant-safe relational records.</p></div><div className="segmented"><button className={tab==="api"?"active":""} onClick={()=>setTab("api")}>REST API</button><button className={tab==="data"?"active":""} onClick={()=>setTab("data")}>Data model</button></div></section>
    {tab === "api" ? <>
      <div className="api-summary"><div><span>Base URL</span><code>https://api.copilot.example.com/v1</code></div><div><span>Authentication</span><b>OIDC → 15 min JWT + rotating refresh token</b></div><div><span>Contract</span><b>OpenAPI 3.1 · RFC 9457 errors</b></div></div>
      <article className="panel endpoint-panel"><div className="panel-head"><div><p className="eyebrow">Core surface</p><h3>Endpoint catalog</h3></div><span className="count">42 endpoints</span></div><div className="endpoint-list">{endpoints.map(e=><div key={e[1]}><span className={`method ${e[0].toLowerCase()}`}>{e[0]}</span><code>{e[1]}</code><p>{e[2]}</p><small>{e[3]}</small></div>)}</div></article>
      <section className="two-grid"><article className="panel code-panel"><p className="eyebrow">Request model</p><h3>StartWorkflowRequest</h3><pre>{`{\n  "workflow_version": "2.3.1",\n  "baseline_id": "bln_01J...",\n  "objectives": ["requirements", "architecture"],\n  "quality_gate": { "min_confidence": 0.85 },\n  "idempotency_key": "run-atlas-2026-10-03"\n}`}</pre></article><article className="panel code-panel"><p className="eyebrow">Response model</p><h3>WorkflowRun</h3><pre>{`{\n  "id": "run_01J...",\n  "status": "queued",\n  "links": { "events": "/v1/runs/run_01J/events" },\n  "created_at": "2026-10-03T20:14:00Z",\n  "trace_id": "7f4c..."\n}`}</pre></article></section>
    </> : <>
      <article className="panel schema-panel"><div className="panel-head"><div><p className="eyebrow">PostgreSQL 16</p><h3>Core schema</h3></div><span className="count">RLS enforced</span></div><div className="schema-grid">{schema.map(s=><div key={s[0]}><div><span>▦</span><b>{s[0]}</b></div><p>{s[1]}</p><code>{s[2]}</code></div>)}</div></article>
      <section className="two-grid"><article className="panel"><p className="eyebrow">Relationship spine</p><h3>Tenant → project → evidence</h3><div className="relation-flow"><span>tenant</span><i>1:N</i><span>project</span><i>1:N</i><span>artifacts</span><i>N:M</i><span>sources</span></div><p className="body-copy">Every business row carries tenant_id. Composite unique keys, row-level security, soft deletion, and append-only versions preserve isolation and history.</p></article><article className="panel"><p className="eyebrow">Index strategy</p><h3>Built for traceability</h3><div className="metric-list"><div><span>Tenant + project filters</span><b>B-tree</b></div><div><span>Artifact metadata</span><b>GIN JSONB</b></div><div><span>Audit chronology</span><b>BRIN</b></div><div><span>Semantic retrieval</span><b>Qdrant HNSW</b></div></div></article></section>
    </>}
  </div>;
}

function Delivery() {
  return <div className="view-stack">
    <section className="section-intro"><div><p className="eyebrow">Production readiness</p><h2>Delivery command center</h2><p>A 16-week roadmap with security, operability, and customer validation built into every release gate.</p></div><button className="primary">Export delivery baseline</button></section>
    <section className="roadmap panel"><div className="panel-head"><div><p className="eyebrow">Development roadmap</p><h3>Four releases to enterprise GA</h3></div><span className="version">16 weeks</span></div><div className="roadmap-grid">{[
      ["01","Foundation","Weeks 1–4","Identity, tenancy, ingestion, RAG, audit"],["02","Intelligence","Weeks 5–8","8 agents, graph orchestration, artifact review"],["03","Delivery","Weeks 9–12","Backlog, sprints, tests, export, integrations"],["04","Enterprise GA","Weeks 13–16","Scale, DR, security validation, pilot rollout"]
    ].map((x,i)=><div key={x[0]}><span>{x[0]}</span><i className={`phase p${i}`}/><b>{x[1]}</b><small>{x[2]}</small><p>{x[3]}</p></div>)}</div></section>
    <section className="delivery-grid">
      <article className="panel sprint-board"><div className="panel-head"><div><p className="eyebrow">Sprint 01 · 32 points</p><h3>Foundation backlog</h3></div><span className="healthy">Ready</span></div>{[["IAM-01","OIDC login and token rotation","5","Done"],["TEN-03","Tenant context + PostgreSQL RLS","8","In progress"],["DOC-02","Presigned upload + malware scan","8","Ready"],["RAG-04","Hybrid retrieval with citations","8","Ready"],["OBS-01","Trace propagation + audit events","3","Ready"]].map(x=><div className="sprint-item" key={x[0]}><code>{x[0]}</code><b>{x[1]}</b><span>{x[2]} pts</span><small>{x[3]}</small></div>)}</article>
      <article className="panel"><div className="panel-head"><div><p className="eyebrow">Risk register</p><h3>Mitigation priority</h3></div><span className="count">12 open</span></div><div className="risk-table">{risks.map((r,i)=><div key={r[0]}><code>{r[0]}</code><div><b>{r[1]}</b><small>{r[3]} · Owner {r[4]}</small></div><span className={`severity s${i}`}>{r[2]}</span></div>)}</div></article>
    </section>
    <section className="three-grid"><article className="panel"><p className="eyebrow">CI/CD</p><h3>Supply-chain secured</h3><div className="vertical-flow"><span>PR checks + tests</span><i>↓</i><span>SAST + dependency scan</span><i>↓</i><span>SBOM + signed image</span><i>↓</i><span>Progressive deployment</span><i>↓</i><span>Automated rollback</span></div></article><article className="panel"><p className="eyebrow">Observability</p><h3>Golden signals + AI quality</h3><div className="chip-cloud"><span>Latency</span><span>Traffic</span><span>Errors</span><span>Saturation</span><span>Token cost</span><span>Groundedness</span><span>Run success</span><span>Approval time</span></div></article><article className="panel"><p className="eyebrow">Launch gates</p><h3>Definition of production-ready</h3><div className="check-list"><span>✓ Threat model approved</span><span>✓ Restore drill completed</span><span>✓ Load target sustained</span><span>✓ Accessibility WCAG 2.2 AA</span><span>○ Pilot sign-off pending</span></div></article></section>
  </div>;
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [dark, setDark] = useState(true);
  const content = useMemo(() => ({ overview:<Overview onNavigate={setView}/>, workspace:<Workspace/>, architecture:<Architecture/>, agents:<Agents/>, api:<ApiData/>, delivery:<Delivery/> })[view], [view]);
  return <main className={dark ? "app dark" : "app light"}>
    <aside className="sidebar"><div className="brand"><span>Æ</span><div><b>Axiom</b><small>Engineering OS</small></div></div><nav>{nav.map(n=><button key={n.id} onClick={()=>setView(n.id)} className={view===n.id?"active":""}><span>{n.key}</span>{n.label}</button>)}</nav><div className="sidebar-foot"><div className="usage"><span>AI execution budget</span><b>68% remaining</b><i><em/></i><small>Resets in 12 days</small></div><button><span>?</span> Help & governance</button></div></aside>
    <div className="shell"><Header view={view} dark={dark} setDark={setDark}/><div className="content">{content}</div><footer><span>Axiom AI Engineering OS</span><span>System healthy · EU West</span><span>SOC 2 controls enabled</span></footer></div>
  </main>;
}
