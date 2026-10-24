export function ScreenPlaceholder({ name, legacy }: { name: string; legacy: string }) {
  return (
    <main style={{ padding: 'var(--margin)' }}>
      <h1>{name}</h1>
      <p>Skeleton route. Prototype view: <code>{legacy}</code></p>
    </main>
  );
}
