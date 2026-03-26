import { useState, useEffect } from 'react'

const App = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <>
      <div className="container">
        <header>
          <a href="#" className="logo">VIRTUS</a>
          <nav>
            <ul className="nav-links">
              <li><a href="#work">Work</a></li>
              <li><a href="#about">About</a></li>
              <li><button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                {theme === 'light' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button></li>
            </ul>
          </nav>
        </header>

        <section className="hero">
          <div className="hero-content">
            <h1>Elevating experiences through design.</h1>
            <p className="subtitle">
              A minimalist workspace dedicated to building premium digital products with focus on typography and interaction.
            </p>
            <div className="cta-group">
              <a href="#work" className="btn btn-primary">View Project</a>
              <a href="#contact" className="btn btn-secondary">Get in touch</a>
            </div>
          </div>
        </section>

        <div className="grid">
          <div className="card">
            <h3>Strategic Planning</h3>
            <p>We help businesses identify their core values and translate them into a coherent brand strategy.</p>
          </div>
          <div className="card">
            <h3>Visual Design</h3>
            <p>Creating beautiful, functional interfaces that stand out and provide exceptional user experiences.</p>
          </div>
          <div className="card">
            <h3>Development</h3>
            <p>Turning designs into high-performance, accessible, and scalable web applications.</p>
          </div>
        </div>

        <footer>
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Virtus Studio. Handcrafted with React & Vite.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
