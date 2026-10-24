export function ScreenPlaceholder({ name, legacy }: { name: string; legacy: string }) {
  return (
    <main style={{ padding: 'var(--margin)', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ font: '500 36px/1.1 var(--font-read)', letterSpacing: '-.02em' }}>{name}</h1>
      <p style={{ color: 'var(--mute)' }}>Skeleton route. Prototype view: <code>{legacy}</code></p>
    </main>
  );
}
