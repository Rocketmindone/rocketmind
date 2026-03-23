"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body className="bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-[760px] flex-col justify-center gap-6 px-6 py-16">
          <div className="space-y-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
              Rocketmind
            </p>
            <h1 className="font-heading text-[40px] font-bold uppercase leading-none tracking-[-0.02em] text-foreground">
              Локальная ошибка рендера
            </h1>
            <p className="text-[16px] leading-[1.4] text-muted-foreground">
              {error.message || "Что-то пошло не так при загрузке страницы."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-12 w-fit items-center justify-center rounded-sm border border-border bg-[var(--rm-gray-1)] px-6 font-mono text-[14px] uppercase tracking-[0.04em] text-foreground transition-[background-color,border-color,opacity] duration-150 hover:bg-[var(--rm-gray-2)]"
          >
            Перезагрузить страницу
          </button>
        </main>
      </body>
    </html>
  );
}
