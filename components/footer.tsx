export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          <div className="text-sm text-neutral-500">
            Powered by
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Next.js", "Stripe", "Vercel AI SDK", "Tailwind CSS", "Vercel"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400"
                >
                  {tech}
                </span>
              )
            )}
          </div>
          <div className="mt-4 text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Vercel Merch Co. &mdash; A demo store built for the love of shipping.
          </div>
        </div>
      </div>
    </footer>
  );
}
