import { skills } from '@/content/skills';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionLabel number="02">Context</SectionLabel>
        <div className="about-grid">
          <h2 id="about-title" className="font-display section-title">
            Making the <em className="font-serif">complex</em> feel clear.
          </h2>
          <div className="about-copy">
            <p>
              TODO: Replace this with a short, specific bio. Share the problems you like to solve,
              the teams you work best with, and the detail that makes your practice different.
            </p>
            <p>
              My work sits between product thinking, visual systems, and the browser. I care about
              the last 10%: the rhythm of an interaction, the performance of a page, and the
              confidence it gives someone using it.
            </p>
          </div>
        </div>
        <div className="skills-block">
          <div>
            <p className="eyebrow">A working toolkit</p>
            <ul className="skill-list">
              {skills.groups
                .flatMap((group) => group.items)
                .map((skill) => (
                  <li key={skill.name}>{skill.name}</li>
                ))}
            </ul>
          </div>
          <div className="facts">
            <p>
              <strong>Based in</strong>
              <br />
              TODO: City / timezone
            </p>
            <p>
              <strong>Currently</strong>
              <br />
              Making useful things
            </p>
            <p>
              <strong>Approach</strong>
              <br />
              Curious, precise, kind
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
