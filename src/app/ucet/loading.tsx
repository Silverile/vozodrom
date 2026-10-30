// Shown at once while an account page (Můj účet, Zprávy, a listing) loads from the database.
export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-4" aria-busy="true" aria-label="Načítám">
      <div className="card h-20 animate-pulse" />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-3">
          <div className="card h-24 animate-pulse" />
          <div className="card h-24 animate-pulse" />
        </div>
        <div className="card h-48 animate-pulse" />
      </div>
    </div>
  );
}
