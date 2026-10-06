export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-9 py-16">
      <div className="kicker mb-3">μ · About</div>
      <h1 className="font-serif italic text-4xl leading-tight mb-8">
        I collect data on things that matter to regular people.
      </h1>
      <div className="space-y-5 text-ink-soft leading-relaxed">
        <p>
          pointofμ is an independent data journalism project. I analyse publicly available data, then turn the
          results into short stories and 42-second videos.
        </p>
        <p>
          Every claim is sourced. Every dataset is documented. Every chart can be reproduced from the raw data,
          which I publish for free.
        </p>
        <p>
          The μ is the symbol for the mean, the most basic measure of central tendency. The point of this project
          is data that captures typical experiences, not outliers, not edge cases, the numbers that describe how
          ordinary life actually works.
        </p>
      </div>

      <div className="mt-16 border-t border-rule pt-10">
        <div className="kicker mb-4">Who&apos;s behind this</div>
        <div className="font-medium text-lg mb-1">André</div>
        <div className="text-sm text-ink-soft mb-5">Data scientist · Big tech · Recreational quant</div>
        <div className="space-y-5 text-ink-soft leading-relaxed text-sm">
          <p>
            By day I work as a data scientist in big tech, specialising in measurement, specifically ads measurement
            and ML-based causal inference. The job is about knowing what actually moved the needle, and being honest
            when you can&apos;t tell.
          </p>
          <p>
            The rest of the time I build systematic macro strategies, the carry, trend, value, and low-beta kind, a
            hobby that started in a university economics class and never quite stopped. pointofμ is where the
            measurement instinct meets the macro curiosity: rigorous method, stories anyone can read.
          </p>
          <p>
            I also have a habit of putting actual numbers behind the hot takes swirling around the internet. Not to
            win arguments, but to find out which ones hold up.
          </p>
          <p>
            I publish all the code and data because the whole point of showing your work is that someone else can
            show you where you got it wrong.
          </p>
        </div>
      </div>
    </div>
  )
}
