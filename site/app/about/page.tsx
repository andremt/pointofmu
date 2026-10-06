import TopNav from '@/components/nav/TopNav'
import Footer from '@/components/ui/Footer'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pom-paper)' }}>
      <TopNav />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 36px 60px' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 20 }}>
          μ · About
        </div>
        <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px,6vw,64px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.05, color: 'var(--pom-ink)', marginBottom: 32 }}>
          I collect data on things that matter to regular people.
        </h1>
        <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--pom-ink-soft)', marginBottom: 20 }}>
          pointofμ is an independent data journalism project. I analyse publicly available data, then turn the results into short stories and 42-second videos.
        </p>
        <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--pom-ink-soft)', marginBottom: 20 }}>
          Every claim is sourced. Every dataset is documented. Every chart can be reproduced from the raw data, which I publish for free.
        </p>
        <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--pom-ink-soft)', marginBottom: 48 }}>
          The μ is the symbol for the mean, the most basic measure of central tendency. The point of this project is data that captures typical experiences, not outliers, not edge cases, the numbers that describe how ordinary life actually works.
        </p>

        {/* Founder bio */}
        <div style={{ padding: '48px 0', borderBottom: '1px solid var(--pom-rule)', marginBottom: 48 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pom-pink)', marginBottom: 20 }}>
            Who&apos;s behind this
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--pom-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: 28, fontStyle: 'italic', color: 'var(--pom-pink)' }}>A</span>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, fontWeight: 400, color: 'var(--pom-ink)', marginBottom: 4 }}>
                André
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--pom-ink-soft)', letterSpacing: '0.05em', marginBottom: 16 }}>
                Data scientist · Big tech · Recreational quant
              </div>
              <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 15, lineHeight: 1.75, color: 'var(--pom-ink-soft)', marginBottom: 12 }}>
                By day I work as a data scientist in big tech, specialising in measurement, specifically ads measurement and ML-based causal inference. The job is about knowing what actually moved the needle, and being honest when you can&apos;t tell.
              </p>
              <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 15, lineHeight: 1.75, color: 'var(--pom-ink-soft)', marginBottom: 12 }}>
                The rest of the time I build systematic macro strategies, the carry, trend, value, and low-beta kind, a hobby that started in a university economics class and never quite stopped. pointofμ is where the measurement instinct meets the macro curiosity: rigorous method, stories anyone can read.
              </p>
              <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 15, lineHeight: 1.75, color: 'var(--pom-ink-soft)', marginBottom: 12 }}>
                I also have a habit of putting actual numbers behind the hot takes swirling around the internet. Not to win arguments, but to find out which ones hold up.
              </p>
              <p style={{ fontFamily: '"Geist", sans-serif', fontSize: 15, lineHeight: 1.75, color: 'var(--pom-ink-soft)' }}>
                I publish all the code and data because the whole point of showing your work is that someone else can show you where you got it wrong.
              </p>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
