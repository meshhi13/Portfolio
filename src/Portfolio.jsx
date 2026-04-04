import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Mail, ExternalLink, Briefcase, Code, Map, GraduationCap } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ForceGraph2D from 'react-force-graph-2d';
import './index.css';

const rawGraphData = {
  id: "Root",
  name: "Core Competencies",
  val: 6,
  color: "#0f172a",
  children: [
    {
      id: "Languages",
      name: "Languages (Click me)",
      val: 5,
      color: "#3b82f6",
      children: [
        { id: "Python", name: "Python", val: 3, color: "#64748b" },
        { id: "CPP", name: "C++", val: 3, color: "#64748b" },
        { id: "Java", name: "Java", val: 3, color: "#64748b" },
        { id: "TS", name: "TypeScript / JS", val: 3, color: "#64748b" },
        { id: "SQL", name: "SQL", val: 3, color: "#64748b" }
      ]
    },
    {
      id: "AIML",
      name: "AI & Machine Learning",
      val: 5,
      color: "#10b981",
      children: [
        { id: "RAG", name: "RAG", val: 4, color: "#059669", children: [
            { id: "LangChain", name: "LangChain", val: 3, color: "#64748b" },
            { id: "VectorDB", name: "VectorDB (Pinecone, Supabase)", val: 3, color: "#64748b" }
        ]},
        { id: "ML", name: "Machine Learning Concepts", val: 4, color: "#059669", children: [
            { id: "TF", name: "TensorFlow", val: 3, color: "#64748b" },
            { id: "PT", name: "PyTorch", val: 3, color: "#64748b" },
            { id: "SKL", name: "Scikit-Learn", val: 3, color: "#64748b" }
        ]}
      ]
    },
    {
      id: "Robotics",
      name: "Robotics & Autonomy",
      val: 5,
      color: "#f59e0b",
      children: [
        { id: "ROS2", name: "ROS2", val: 3, color: "#64748b" },
        { id: "Sensors", name: "Sensor Fusion (LiDAR, IMU)", val: 3, color: "#64748b" },
        { id: "PathPlanning", name: "Nav2 Path Planning", val: 3, color: "#64748b" },
        { id: "Foxglove", name: "Foxglove / Visualization", val: 3, color: "#64748b" }
      ]
    },
    {
      id: "Web Infrastructure",
      name: "Web & Infrastructure",
      val: 5,
      color: "#8b5cf6",
      children: [
        { id: "Frontend", name: "Frontend", val: 4, color: "#7c3aed", children: [
            { id: "React", name: "React.js / Next.js", val: 3, color: "#64748b" }
        ]},
        { id: "Backend", name: "Backend APIs", val: 4, color: "#7c3aed", children: [
            { id: "Node", name: "Node.js", val: 3, color: "#64748b" },
            { id: "FastAPI", name: "FastAPI", val: 3, color: "#64748b" }
        ]},
        { id: "DevOps", name: "Cloud & Containerization", val: 4, color: "#7c3aed", children: [
            { id: "AWS", name: "AWS", val: 3, color: "#64748b" },
            { id: "Docker", name: "Docker", val: 3, color: "#64748b" },
            { id: "K8s", name: "Kubernetes Context", val: 3, color: "#64748b" }
        ]}
      ]
    }
  ]
};

const SkillKnowledgeGraph = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(["Root", "Languages"]));
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const graphRef = useRef();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 600
        });
      }
    };
    window.addEventListener('resize', updateDimensions);
    // slight delay for layout calc
    setTimeout(updateDimensions, 0); 
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { nodes, links } = useMemo(() => {
    const visibleNodes = [];
    const visibleLinks = [];

    const traverse = (node) => {
      visibleNodes.push({ 
        id: node.id, 
        name: node.name, 
        val: node.val, 
        color: node.color 
      });

      if (expandedNodes.has(node.id) && node.children) {
        node.children.forEach(child => {
          visibleLinks.push({ source: node.id, target: child.id });
          traverse(child);
        });
      }
    };

    traverse(rawGraphData);
    return { nodes: visibleNodes, links: visibleLinks };
  }, [expandedNodes]);

  const handleNodeClick = useCallback(node => {
    // Determine if it actually has children we can expand
    const hasChildren = (searchNode, targetId) => {
      if (searchNode.id === targetId) return !!searchNode.children;
      if (searchNode.children) {
        return searchNode.children.some(child => hasChildren(child, targetId));
      }
      return false;
    };

    if (hasChildren(rawGraphData, node.id)) {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
    }

    // Center node on click
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(1.5, 1000);
    }
  }, []);

  const drawNode = useCallback((node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 14 / globalScale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    
    // Draw the circle representation
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val * 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color;
    ctx.fill();

    // Prepare text box drawing
    const textWidth = ctx.measureText(label).width;
    const bDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(
      node.x - bDimensions[0] / 2, 
      node.y + node.val * 2 + 1, 
      bDimensions[0], 
      bDimensions[1]
    );

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1e293b'; 
    ctx.fillText(label, node.x, node.y + node.val * 2 + 1 + bDimensions[1] / 2);
  }, []);

  return (
    <section>
      <div style={{ marginBottom: '20px' }}>
        <h2><Map size={24} style={{ marginRight: '10px' }} /> Knowledge Graph</h2>
        <p style={{ color: '#64748b' }}>
          An expansive representation of my technical skills. Click on a central competency node to expand it and reveal its specific sub-skills.
        </p>
      </div>

      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '600px', 
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
        }}
      >
        <ForceGraph2D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={{ nodes, links }}
          nodeCanvasObject={drawNode}
          onNodeClick={handleNodeClick}
          dagMode="radialout"
          dagLevelDistance={80}
          linkHoverPrecision={10}
          linkColor={() => '#cbd5e1'}
          linkWidth={1.5}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkDirectionalParticleColor={() => '#94a3b8'}
          warmupTicks={100}
          cooldownTicks={0}
        />
      </div>
    </section>
  );
};

const MinimalStack = ({ title, items, icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [frontIndex, setFrontIndex] = useState(0);

  // When expanded, show in original order. When collapsed, show cycled order.
  const displayItems = isExpanded 
    ? items 
    : [...items.slice(frontIndex), ...items.slice(0, frontIndex)];

  return (
    <section style={{ margin: '60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon} {title}
        </h2>
        <button
          className="btn-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ background: isExpanded ? '#334155' : '#0f172a' }}
        >
          {isExpanded ? (
            <><ChevronUp size={18} /> Minimal View</>
          ) : (
            <><ChevronDown size={18} /> Expand Stack</>
          )}
        </button>
      </div>

      <div style={{ position: 'relative', minHeight: isExpanded ? 'auto' : '200px' }}>
        {displayItems.map((item, i) => (
          <motion.div
            key={item.title}
            layout
            onClick={() => {
              if (!isExpanded) {
                setFrontIndex((prev) => (prev + 1) % items.length);
              }
            }}
            className="stack-card"
            animate={{
              y: isExpanded ? 0 : i * 15,
              scale: isExpanded ? 1 : 1 - i * 0.05,
              opacity: isExpanded ? 1 : 1 - i * 0.2,
              zIndex: displayItems.length - i
            }}
            style={{
              position: isExpanded ? 'relative' : 'absolute',
              width: '100%',
              top: 0,
              background: '#ffffff',
              marginBottom: isExpanded ? '20px' : '0',
              cursor: isExpanded ? 'default' : 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0f172a' }}>{item.title}</span>
                <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.95rem', marginTop: '4px' }}>
                  {item.subtitle}
                </div>
              </div>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{item.date}</span>
            </div>
            <div className="card-content">
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#475569' }}>
                {item.bullets.map((b, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', lineHeight: '1.5' }}>{b}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Portfolio = () => {
  const education = [
    {
      title: "University of Virginia",
      subtitle: "B.S. in Computer Science & Mathematics",
      date: "Expected May 2027",
      bullets: [
        "GPA: 3.95/4.00",
        "Awards: Ingrassia Family Research Grant",
        "Relevant Coursework: Data Structures, Algorithms, Machine Learning, Artificial Intelligence, Systems Programming."
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
      title: "CorporateHistory RAG Engine",
      subtitle: "LangChain • Supabase • Next.js",
      date: "2025",
      bullets: [
        "Semantic search engine processing 10,000+ unstructured records.",
        "Enabled sub-second retrieval for complex corporate history queries."
      ]
    },
    {
      title: "Energy Analytics Dashboard",
      subtitle: "Python • Streamlit • scikit-learn",
      date: "2024",
      bullets: [
        "Real-time anomaly detection on 200,000+ energy data points.",
        "Visualized consumption trends via interactive clusters."
      ]
    },
    {
      title: "Autonomous Robotics System",
      subtitle: "FIRST Tech Challenge",
      date: "2021-2023",
      bullets: [
        "PID-tuned autonomous routines for high-precision robotics.",
        "Integrated sensor fusion (IMU, Encoders) for 95% scoring success."
      ]
    }
  ];

  return (
    <div className="app-container">
      <header className="fade-in" style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '3rem', margin: 0, color: '#0f172a' }}>Himesh Ahuja</h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginTop: '10px', marginBottom: '25px' }}>
              Computer Science & Mathematics @ University of Virginia
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="mailto:himesh.d.ahuja@gmail.com" className="meta-item hover:text-blue-500" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
                <Mail size={18} /> Email
              </a>
              <a href="https://linkedin.com/in/himesh-ahuja" target="_blank" rel="noreferrer" className="meta-item hover:text-blue-500" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
                <FaLinkedin size={18} /> LinkedIn
              </a>
              <a href="https://github.com/meshhi13" target="_blank" rel="noreferrer" className="meta-item hover:text-blue-500" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
                <FaGithub size={18} /> GitHub
              </a>
              <a href="/resume.pdf" target="_blank" className="meta-item hover:text-blue-500" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
                <ExternalLink size={18} /> Resume
              </a>
            </div>
          </div>
          <div>
            <img 
              src="/profile.png" 
              alt="Himesh Ahuja" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            />
          </div>
        </div>
      </header>

      <SkillKnowledgeGraph />
      
      <MinimalStack 
        title="Education" 
        items={education} 
        icon={<GraduationCap size={24} color="#f59e0b" />} 
      />

      <MinimalStack 
        title="Professional Experience" 
        items={experiences} 
        icon={<Briefcase size={24} color="#3b82f6" />} 
      />

      <MinimalStack 
        title="Technical Projects" 
        items={projects} 
        icon={<Code size={24} color="#10b981" />} 
      />

      <footer style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Himesh Ahuja
      </footer>
    </div>
  );
};

export default Portfolio;
