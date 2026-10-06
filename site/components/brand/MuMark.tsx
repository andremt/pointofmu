export default function MuMark({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }} aria-hidden>
      <path d="M7 8 V22 Q7 26 11 26 Q15 26 17 22 V8 M17 8 V28"
        stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
