import TimelineReports from "@/components/demo";
import { Waves } from "@/components/ui/wave-background";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24">
      {/* Background layer */}
      <div className="fixed inset-0 -z-10 bg-transparent">
        <Waves className="w-full h-full" />
      </div>

      {/* Content layer */}
      <div className="w-full max-w-4xl relative z-10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Timeline &amp; Reports
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            A journey of bringing accessible Bible study methods to those who
            need it most.
          </p>
        </div>
        <TimelineReports />
      </div>
    </main>
  );
}
