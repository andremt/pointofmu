export default function Pink({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: 'var(--pom-pink)', fontWeight: 600 }}>
      {children}
    </span>
  )
}
