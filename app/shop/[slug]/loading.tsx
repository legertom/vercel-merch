export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-neutral-900" />
        <div className="flex flex-col justify-center space-y-4">
          <div className="h-4 w-20 animate-pulse rounded bg-neutral-900" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-900" />
          <div className="h-8 w-24 animate-pulse rounded bg-neutral-900" />
          <div className="h-20 w-full animate-pulse rounded bg-neutral-900" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-full bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}
