import { VIDEOS } from "@/lib/videos"

interface Props {
  articleSlug: string
  hasVideo: boolean
  tiktokUrl?: string
}

export default function StickyVideoRail({ articleSlug, hasVideo, tiktokUrl }: Props) {
  if (!hasVideo) return null
  const registryEntry = VIDEOS.find((v) => v.articleSlug === articleSlug)
  const effectiveTiktokUrl = tiktokUrl ?? registryEntry?.tiktokUrl
  const src = registryEntry?.src

  return (
    <div className="border border-rule rounded p-4 bg-cream">
      <div className="kicker mb-2">Watch</div>
      {src ? (
        <video src={src} controls className="w-full rounded" />
      ) : effectiveTiktokUrl ? (
        <a href={effectiveTiktokUrl} target="_blank" rel="noreferrer" className="text-pink text-sm font-medium">
          Watch on TikTok →
        </a>
      ) : null}
      {registryEntry?.duration && <div className="text-xs text-ink-soft mt-2">{registryEntry.duration}</div>}
    </div>
  )
}
