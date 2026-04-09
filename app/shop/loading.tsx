export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-9 w-40 animate-pulse rounded bg-neutral-900" />
      <div className="mt-2 h-5 w-64 animate-pulse rounded bg-neutral-900" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10">
            <div className="aspect-square animate-pulse rounded-t-xl bg-neutral-900" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-900" />
              <div className="h-4 w-16 animate-pulse rounded bg-neutral-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
