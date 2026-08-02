import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/effects/LoadingScreen";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { AnimatedBackground } from "@/components/effects/AnimatedBackground";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Experience } from "@/components/sections/Experience";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    let lenis: import("@studio-freight/lenis").default | null = null;

    const initLenis = async () => {
      try {
        const LenisModule = await import("@studio-freight/lenis");
        const Lenis = LenisModule.default;
        lenis = new Lenis({
          duration: 0.7,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          orientation: "vertical",
          smoothWheel: true,
          // Don't intercept scroll inside modals/dialogs
          prevent: (node: Element) =>
            node.closest('[role="dialog"]') !== null ||
            node.closest('[data-lenis-prevent]') !== null,
        } as any);

        function raf(time: number) {
          lenis!.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch {
        // Lenis optional — graceful fallback
      }
    };

    initLenis();

    // Track visitor once per session
    if (typeof window !== "undefined" && !sessionStorage.getItem("tracked_visit")) {
      sessionStorage.setItem("tracked_visit", "true");
      void fetch("/api/track-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: window.location.pathname, referrer: document.referrer }),
      }).catch(() => {});
    }

    // Loading screen duration
    const timer = setTimeout(() => setLoading(false), 2300);

    return () => {
      clearTimeout(timer);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <>
      <LoadingScreen isLoading={loading} />

      {!loading && (
        <>
          <ScrollProgress />
          <MouseGlow />
        </>
      )}

      <div
        className="relative min-h-[100dvh]"
        style={{ background: "hsl(var(--background))" }}
      >
        {/* Persistent animated background */}
        <AnimatedBackground />

        {/* Main content */}
        <div className="relative" style={{ zIndex: 2 }}>
          <Navbar />

          <main>
            <Hero />

            {/* Section divider */}
            <div className="section-divider mx-6 md:mx-12" />

            <About />

            <div className="section-divider mx-6 md:mx-12" />

            <Skills />

            <div className="section-divider mx-6 md:mx-12" />

            <Projects />

            <div className="section-divider mx-6 md:mx-12" />

            <Services />

            <div className="section-divider mx-6 md:mx-12" />

            <Experience />

            <div className="section-divider mx-6 md:mx-12" />

            <Stats />

            <div className="section-divider mx-6 md:mx-12" />

            <Testimonials />

            <div className="section-divider mx-6 md:mx-12" />

            <Contact />
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
