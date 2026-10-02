import { Reveal } from '@/components/motion/Reveal';
import { site } from '@/content/site';
import { skills } from '@/content/skills';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionLabel number="02">About</SectionLabel>
        <div className="about-grid">
          <Reveal as="h2" id="about-title" className="font-display section-title">
            I like knowing <em className="font-serif">why</em> it works.
          </Reveal>
          <div className="about-copy">
            <p>
              Most of what I know, I learned by rebuilding something that already existed. To
              understand compression I wrote a ZIP extractor in C, with the DEFLATE decoder done by
              hand. To understand neural networks I wrote the forward pass in ARM64 assembly.
            </p>
            <p>
              On the web side I worked through The Odin Project, and I’m now building Meld, a
              matchmaking platform for games, with React, Express and Socket.IO. I practise
              algorithms on LeetCode and keep my notes on GitHub.
            </p>
          </div>
        </div>
        <div className="skills-block">
          <div>
            <p className="eyebrow">What I’ve used</p>
            <ul className="skill-list">
              {skills.groups
                .flatMap((group) => group.items)
                .map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
            </ul>
          </div>
          <div className="facts">
            <p>
              <strong>Currently</strong>
              <br />
              Building Meld
            </p>
            <p>
              <strong>Status</strong>
              <br />
              {site.availability}
            </p>
            <p>
              <strong>Code</strong>
              <br />
              <a href={site.socials.github} rel="noopener noreferrer" target="_blank">
                github.com/sarthak0116
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
