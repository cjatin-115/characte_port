import { ProjectIndex } from '../components/ProjectIndex'
import { getPrimaryRoute } from '../content/routes'

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-meta"><span>PERSONAL ARCHIVE</span><span>AI / ML · SOFTWARE SYSTEMS · CREATIVE TOOLS</span></div>
      <div className="orbit" aria-hidden="true"><span className="orbit-line orbit-line-a" /><span className="orbit-line orbit-line-b" /><span className="orbit-body" /><span className="orbit-caption">FIG. 001&nbsp; / &nbsp;A STUDY IN ORBIT</span></div>
      <div className="hero-copy">
        <p className="eyebrow">JATIN CHOUDHARY <span>— COMPUTER ENGINEERING STUDENT</span></p>
        <h1 id="hero-title">Making sense<br />of <em>possibility.</em></h1>
        <div className="hero-bottom"><p>I build software prototypes across AI-assisted creative workflows and machine-learning applications.</p><a href={getPrimaryRoute('work').path} className="text-link">EXPLORE THE WORK <span aria-hidden="true">↘</span></a></div>
      </div>
      <span className="hero-coordinate">ORBITAL STUDY / 001</span>
    </section>
  )
}

export function HomePage() {
  return <main id="main-content"><Hero /><ProjectIndex /><section className="closing-note"><p className="eyebrow">A PRACTICE IN PROGRESS</p><p>AI-assisted creative workflows and machine-learning applications, explored through prototypes.</p><a href={getPrimaryRoute('about').path} className="text-link">A LITTLE MORE ABOUT ME ↗</a></section></main>
}
