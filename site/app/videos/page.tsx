import { VIDEOS } from "@/lib/videos"

export default function VideosPage() {
  return (
    <div className="max-w-3xl mx-auto px-9 py-16">
      <div className="kicker mb-3">μ · Short films</div>
      <h1 className="font-serif italic text-5xl mb-12">Data stories under two minutes.</h1>
      <div className="space-y-4">
        {VIDEOS.slice()
          .reverse()
          .map((v) => (
            <div key={v.slug} className="border border-rule rounded p-5 flex justify-between items-start">
              <div>
                <div className="kicker mb-1">μ · {v.kicker}</div>
                <div className="font-medium">{v.title}</div>
              </div>
              <div className="text-ink-soft text-sm shrink-0 ml-4">{v.duration}</div>
            </div>
          ))}
      </div>
    </div>
  )
}
