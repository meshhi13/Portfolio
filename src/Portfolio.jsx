import React, { useState } from 'react';

const MathPhysicsAnimation = () => (
  <div style={{ width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <style>
        {`
          .accretion-disk { animation: spin 15s linear infinite; transform-origin: 50% 50%; }
          .accretion-disk-fast { animation: spin 7s linear infinite reverse; transform-origin: 50% 50%; }
          .photon-ring { animation: pulse 2s ease-in-out infinite; transform-origin: 50% 50%; filter: drop-shadow(0px 0px 4px var(--primary)); }
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes pulse { 50% { stroke-width: 1.5; opacity: 0.8; } }
        `}
      </style>

      {/* Gravitational Lensing / Outer field */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="var(--border)" strokeWidth="0.2" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" strokeWidth="0.3" strokeDasharray="2 6" />

      {/* Outer Accretion Disk - Complex overlapping rotating ellipses */}
      <g className="accretion-disk">
        {[...Array(18)].map((_, i) => (
          <ellipse
            key={`disk1-${i}`}
            cx="50" cy="50" rx="46" ry="14"
            fill="none" stroke="var(--secondary)" strokeWidth="0.4"
            transform={`rotate(${i * 10} 50 50)`}
          />
        ))}
      </g>

      {/* Inner Accretion Disk - Hotter/Faster */}
      <g className="accretion-disk-fast">
        {[...Array(12)].map((_, i) => (
          <ellipse
            key={`disk2-${i}`}
            cx="50" cy="50" rx="30" ry="8"
            fill="none" stroke="var(--primary)" strokeWidth="0.6"
            transform={`rotate(${i * 15} 50 50)`}
          />
        ))}
      </g>

      {/* Shooting Stars Infall */}
      <g transform="translate(50, 50)">
        {[...Array(24)].map((_, i) => (
          <circle
            key={`star-${i}`}
            r="0.8"
            fill="var(--primary)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from={`${Math.cos(i * 15 * Math.PI / 180) * 48} ${Math.sin(i * 15 * Math.PI / 180) * 48}`}
              to="0 0"
              dur={`${1.5 + Math.random() * 2}s`}
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0;1;0" dur={`${1.5 + Math.random() * 2}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      {/* The Photon Sphere / Event Horizon (Pure Black Hole masking everything behind it) */}
      <circle cx="50" cy="50" r="14" fill="var(--bg)" stroke="var(--primary)" strokeWidth="1" className="photon-ring" />
      <circle cx="50" cy="50" r="13.5" fill="var(--bg)" />
    </svg>
  </div>
);

const nodeTree = [
  {
    id: "ML",
    name: "Machine Learning & AI",
    children: [
      { name: "Generative AI", items: ["LangChain", "RAG Systems", "Prompt Engineering"] },
      { name: "Deep Learning", items: ["TensorFlow", "PyTorch", "OpenCV", "Machine Learning"] },
      { name: "Core ML Data", items: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Data Visualization"] }
    ]
  },
  {
    id: "Web",
    name: "Web Development",
    children: [
      { name: "Frontend", items: ["React.js", "JavaScript", "TypeScript", "Dart", "HTML", "CSS"] },
      { name: "Backend", items: ["Node.js", "FastAPI", "Flask", "Django", "REST/GraphQL APIs"] },
      { name: "Databases", items: ["SQL", "PostgreSQL", "Supabase", "MySQL", "MongoDB", "SQLite", "Firebase"] }
    ]
  },
  {
    id: "Systems",
    name: "Systems & Robotics",
    children: [
      { name: "Languages", items: ["C/C++", "Java", "x86-64 Assembly", "OOP"] },
      { name: "Robotics", items: ["ROS2", "Foxglove"] },
      { name: "AppSec", items: ["lldb/gdb", "Ghidra"] }
    ]
  },
  {
    id: "DevOps",
    name: "DevOps & Workflow",
    children: [
      { name: "Cloud & CI/CD", items: ["AWS", "Docker", "CI/CD", "Cloud Computing"] },
      { name: "VCS", items: ["Git", "GitHub", "BitBucket", "Agile/Scrum"] },
      { name: "Environment", items: ["SSH", "Vim", "tmux", "grep"] }
    ]
  }
];

const Skills = () => {
  const [expanded, setExpanded] = useState(new Set());

  const toggle = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="content-section">
      <div className="section-header" style={{ alignItems: 'flex-end', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Skills</h2>
      </div>

      <div className="tree-container">
        {nodeTree.map(cat => (
          <div key={cat.id} className="tree-column" onClick={() => { if (!expanded.has(cat.id)) toggle(cat.id) }}>
            <div className="tree-heading" onClick={() => { if (expanded.has(cat.id)) toggle(cat.id) }}>
              <span>{cat.name}</span>
              <span>{expanded.has(cat.id) ? '-' : '+'}</span>
            </div>
            {expanded.has(cat.id) && (
              <div style={{ marginTop: '10px' }}>
                {cat.children.map((sub, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '4px' }}>{sub.name}</div>
                    <div>
                      {sub.items.map((item, j) => (
                        <span key={j} className="skill-pill">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const MinimalStack = ({ title, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayItems = isExpanded ? items : items.slice(0, 1);

  return (
    <section className="content-section">
      <div className="section-header">
        <h2 style={{ margin: 0, border: 'none', padding: 0 }}>{title}</h2>
        {items.length > 1 && (
          <button className="btn-toggle" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}></div>

      <div>
        {displayItems.map((item, i) => (
          <div key={i} className="stack-card">
            <div className="card-top">
              <div>
                <div className="card-title">{item.title}</div>
                <div className="card-subtitle">{item.subtitle}</div>
              </div>
              {item.date && <div className="card-date">{item.date}</div>}
            </div>
            <div className="card-content">
              <ul>
                {item.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Portfolio = () => {
  const education = [
    {
      title: "University of Virginia",
      subtitle: "Computer Science and Mathematics | GPA: 3.82 / 4.00",
      date: "Aug 2025 – May 2028",
      bullets: [
        "Echols and College Science Scholar, Virginia Poker Club, Climbing Club",
        "Advanced Data Structures, Computer Architecture, ODEs, Intermediate Macroeconomics"
      ]
    },
    {
      title: "Chantilly High School",
      subtitle: "Advanced Diploma | GPA: 4.59 / 4.00",
      date: "Aug 2021 - May 2025",
      bullets: [
        "Computer Science Honor Society (President), FIRST Technology Challenge (Captain), VSSEF",
        "Multivariable Calculus, Linear Algebra, Statistics, OOP, Discrete Mathematics"
      ]
    }
  ];

  const experiences = [
    {
      title: "AI/ML Software Engineer Intern",
      subtitle: "Noblis",
      date: "Jan 2026 – Present",
      bullets: [
        "Automated data triage and search pipeline via Python and VectorDB.",
        "Built TypeScript API middleware for vLLM server integration.",
        "Deployed RAG tools on NVIDIA B200 hardware."
      ]
    },
    {
      title: "Software Developer",
      subtitle: "theCourseForum",
      date: "Sept 2025 – Present",
      bullets: [
        "Scaling analytics platform for 20,000+ university students.",
        "Optimized deployment cycle by 45% using Docker and AWS ECS.",
        "Developed high-traffic review functionality for course data."
      ]
    },
    {
      title: "Research Assistant",
      subtitle: "Chandra Robot Autonomy Lab",
      date: "Aug 2025 – Present",
      bullets: [
        "Awarded Ingrassia Research Grant for robotics innovation.",
        "Optimized ROS2 path planners, increasing navigation accuracy by 25%.",
        "Processed LiDAR point clouds for autonomous vehicle navigation."
      ]
    },
    {
      title: "Software Engineer Intern",
      subtitle: "NT Concepts",
      date: "May 2024 – Aug 2024",
      bullets: [
        "Built 10+ GIS features utilizing React and Electron.",
        "Automated component testing to reduce QA cycles by 30%."
      ]
    }
  ];

  const projects = [
    {
      title: "A8THER - Autonomous AI RE Agent",
      subtitle: "Python • FastAPI • Ghidra • Docker",
      bullets: [
        "Built a sandboxed autonomous agent utilizing a ReAct orchestration loop to decompile binary executables and recover source code.",
        "Integrated headless Ghidra structural analysis with an isolated Docker environment for safe payload translation.",
        "Developed and presented at HooHacks 2026."
      ]
    },
    {
      title: "EcoAlert - Environmental Risk Management",
      subtitle: "Python • Flask • Leaflet • OpenAI API",
      bullets: [
        "Engineered a full-stack web app processing real-time weather data to deliver predictive climate risk analytics for 500+ map locations.",
        "Implemented interactive mapping via Leaflet.js and integrated OpenAI for intelligent risk assessment.",
        "Won 1st place among 200+ participants at HackTheNest 2025."
      ]
    },
    {
      title: "EyeDragon - Medical AI Diagnosis System",
      subtitle: "Python • TensorFlow • YoloV8 • Pandas",
      bullets: [
        "Developed a machine-learning classification model aimed at diagnosing retinal fundus diseases.",
        "Trained on over 20,000 fundus images, achieving an overall accuracy of 92.3% for 6 unique retinopathies.",
        "Won 2nd place in Biomedical Sciences at the Virginia State Science and Engineering Fair (VSSEF)."
      ]
    },
    {
      title: "Rubik’s Cube 3D Emulator",
      subtitle: "Java • JavaFX • OpenJFX",
      bullets: [
        "Developed a fully interactive 3D simulator featuring real-time animations, face rotations, and camera controls.",
        "Implemented core functionality including scrambling, advanced rotations, and view zoom/reset."
      ]
    },
    {
      title: "AI Minesweeper Clone",
      subtitle: "Python • Pygame",
      bullets: [
        "Built an interactive clone featuring dynamic board sizing and customizable mine density.",
        "Engineered a recursive solver that successfully auto-completes the board."
      ]
    },
    {
      title: "CorporateHistory RAG Engine",
      subtitle: "LangChain • Supabase • Next.js",
      bullets: [
        "Semantic search engine processing 10,000+ unstructured records.",
        "Enabled sub-second retrieval for complex corporate history queries."
      ]
    },
    {
      title: "Energy Analytics Dashboard",
      subtitle: "Python • Streamlit • scikit-learn",
      bullets: [
        "Real-time anomaly detection on 200,000+ energy data points.",
        "Visualized consumption trends via interactive clusters."
      ]
    }
  ];

  return (
    <div className="app-container">
      <header style={{ marginBottom: '60px' }}>
        <div className="header-layout">
          <div>
            <h1>Himesh Ahuja</h1>
            <p className="subtitle" style={{ lineHeight: '1.4' }}>
              :: COMPUTER SCIENCE & MATHEMATICS<br />
              :: UNIVERSITY OF VIRGINIA
            </p>
            <div className="header-links">
              <a href="mailto:himesh.d.ahuja@gmail.com" className="meta-item">EMAIL</a>
              <a href="https://linkedin.com/in/himesh-ahuja" target="_blank" rel="noreferrer" className="meta-item">LINKEDIN</a>
              <a href="https://github.com/meshhi13" target="_blank" rel="noreferrer" className="meta-item">GITHUB</a>
              <a href="/HimeshAhujaResume.pdf" target="_blank" className="meta-item">RESUME</a>
            </div>
          </div>
          <div className="header-avatar">
            <MathPhysicsAnimation />
          </div>
        </div>
      </header>

      <MinimalStack
        title="Experience"
        items={experiences}
      />

      <MinimalStack
        title="Education"
        items={education}
      />

      <MinimalStack
        title="Projects"
        items={projects}
      />

      <Skills />

      <footer className="footer-layout">
        <p>INIT &copy; {new Date().getFullYear()}</p>
        <p>HIMESH AHUJA</p>
      </footer>
    </div>
  );
};

export default Portfolio;
