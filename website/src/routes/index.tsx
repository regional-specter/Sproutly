import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Leaf,
  ScanLine,
  HeartPulse,
  Bell,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Sprout,
} from "lucide-react";

import logo from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
import screenHome from "@/assets/screen-home.png";
import screenDetail from "@/assets/screen-detail.png";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Preview />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-4 z-40 px-4">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 rounded-full border border-white/10 bg-foreground/95 px-3 py-2 pl-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <a href="#top" className="flex items-center gap-2">
          <img src={logoWhite} alt="Sproutly" className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-tight text-background">Sproutly</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-background/70 md:flex">
          <a href="#features" className="transition-colors hover:text-background">Features</a>
          <a href="#how" className="transition-colors hover:text-background">How it works</a>
          <a href="#preview" className="transition-colors hover:text-background">Preview</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#waitlist"
            className="hidden rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-background/90 transition-colors hover:bg-white/10 sm:inline-flex"
          >
            Contact
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1.5 rounded-full bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.02]"
          >
            Join waitlist
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft green wash rising from the middle of the hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] bg-[radial-gradient(ellipse_60%_55%_at_50%_60%,color-mix(in_oklab,var(--brand-green)_28%,transparent)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[380px] -z-10 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[color-mix(in_oklab,var(--brand-green)_22%,transparent)] blur-3xl" />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-5 pt-16 pb-8 text-center md:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-secondary-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Early access — join the waitlist
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[68px]">
          The AI plant doctor for your{" "}
          <span className="text-primary">home garden.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Snap a photo of any plant. Sproutly identifies the species, scores its
          health, and gives you a care routine that actually works.
        </p>

        <WaitlistForm className="mt-8 w-full max-w-md" />

        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex -space-x-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
            ))}
          </div>
          <span>Loved by 2,400+ plant parents on the waitlist</span>
        </div>

        <HeroPhoneShowcase />
      </div>
    </section>
  );
}

function HeroDetailCard({
  icon,
  iconBg,
  title,
  subtitle,
  className = "",
  faded = false,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  className?: string;
  faded?: boolean;
}) {
  return (
    <div
      className={`absolute flex max-w-[220px] items-center gap-3 rounded-2xl border border-white/80 bg-card/95 px-3.5 py-2.5 shadow-[0_12px_40px_-12px_rgba(33,33,33,0.18)] backdrop-blur-md sm:max-w-[240px] ${
        faded ? "opacity-55 blur-[0.4px]" : ""
      } ${className}`}
    >
      <div
        className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0 text-left">
        <p className="truncate text-[13px] font-semibold leading-tight text-foreground sm:text-sm">
          {title}
        </p>
        <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function HeroPhoneShowcase() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-3xl">
      <div className="relative flex min-h-[360px] items-end justify-center sm:min-h-[420px] md:min-h-[480px]">
      <HeroDetailCard
        icon={<Droplets className="h-4 w-4 text-sky-600" />}
        iconBg="bg-sky-100"
        title="Snake Plant needs water"
        subtitle="Due today · Health 88%"
        className="left-[-4%] top-[14%] flex max-w-[190px] sm:left-[2%] sm:top-[8%] sm:max-w-[240px] md:left-[-4%] md:top-[10%]"
      />
      <HeroDetailCard
        icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
        iconBg="bg-amber-100"
        title="Low light detected"
        subtitle="Move Peace Lily closer to window"
        className="left-[-2%] top-[42%] hidden md:flex"
        faded
      />
      <HeroDetailCard
        icon={<Bell className="h-4 w-4 text-primary-dark" />}
        iconBg="bg-primary/15"
        title="3 plants need watering"
        subtitle="Monstera, Pothos & Basil this week"
        className="bottom-[18%] left-[0%] hidden lg:flex"
      />

      <HeroDetailCard
        icon={<TrendingUp className="h-4 w-4 text-primary-dark" />}
        iconBg="bg-primary/15"
        title="Monstera health improved"
        subtitle="92% after yesterday's scan"
        className="right-[-4%] top-[12%] flex max-w-[190px] sm:right-[0%] sm:top-[6%] sm:max-w-[240px] md:right-[-2%]"
      />
      <HeroDetailCard
        icon={<ScanLine className="h-4 w-4 text-violet-600" />}
        iconBg="bg-violet-100"
        title="Species identified"
        subtitle="Fiddle Leaf Fig · Dracaena marginata"
        className="right-[-4%] top-[36%] hidden md:flex"
      />
      <HeroDetailCard
        icon={<Sprout className="h-4 w-4 text-primary-dark" />}
        iconBg="bg-primary/15"
        title="Green Thumb unlocked"
        subtitle="Level 6 · 780 / 2,000 XP"
        className="bottom-[14%] right-[2%] hidden sm:flex md:right-[-3%]"
        faded
      />

        <div className="relative z-10 translate-y-2 sm:translate-y-4">
          <PhoneShot
            src={screenHome}
            className="w-[250px] sm:w-[290px] md:w-[330px]"
          />
        </div>
      </div>
    </div>
  );
}

function PhoneShot({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt="Sproutly app screen"
      className={`block h-auto drop-shadow-[0_30px_40px_rgba(33,33,33,0.22)] ${className}`}
    />
  );
}

function WaitlistForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <form
      id="waitlist"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        setStatus("success");
      }}
      className={className}
    >
      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3.5 text-sm font-medium text-primary-dark">
          <Check className="h-4 w-4" />
          You're on the list — we'll be in touch soon.
        </div>
      ) : (
        <div className="mx-auto max-w-md flex flex-col gap-2 rounded-full border border-border bg-card p-1 shadow-sm sm:flex-row sm:items-center sm:gap-0 sm:pl-5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@garden.com"
            className="w-full bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none sm:px-0 sm:py-0"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-foreground px-5 py-1.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
          >
            Get early access
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </form>
  );
}

function Features() {
  const items = [
    {
      icon: ScanLine,
      title: "Instant plant scans",
      desc: "Point, snap, done. Our AI identifies the species and reads the leaves for stress signals in seconds.",
    },
    {
      icon: HeartPulse,
      title: "0–100 health score",
      desc: "A clear number that tells you if your plant is thriving, coasting, or asking for help right now.",
    },
    {
      icon: Leaf,
      title: "Personalised care routines",
      desc: "Light, water, soil, feeding, temperature — a schedule that fits your specific plant, not a generic guide.",
    },
    {
      icon: Bell,
      title: "Gentle reminders",
      desc: "Watering, misting and check-in nudges so nothing wilts while you're busy living your life.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Features
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[44px]">
          Everything your plants wish you knew.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Sproutly turns your camera into a plant doctor, gardener and calendar —
          all in one calm, quiet app.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_40px_-24px_rgba(56,124,77,0.35)]"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Snap a photo",
      desc: "Open Sproutly and take a quick photo of the plant you want to check on.",
    },
    {
      n: "02",
      title: "Get an AI diagnosis",
      desc: "In seconds you'll see the species, a health score, and what's going right or wrong.",
    },
    {
      n: "03",
      title: "Follow the routine",
      desc: "Save the plant to your garden and let gentle reminders keep it thriving over time.",
    },
  ];

  return (
    <section id="how" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[44px]">
            Three taps to a healthier home garden.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl border border-border bg-card p-7">
              <span className="text-sm font-semibold text-primary">{s.n}</span>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Preview() {
  const bullets = [
    "Track every plant in one virtual garden",
    "Species ID with concise, credible facts",
    "Care timeline so you spot patterns fast",
    "Free forever for your first 3 scans",
  ];

  return (
    <section id="preview" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            The app
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[44px]">
            A calmer way to care for what grows.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sproutly keeps every plant's history, care plan and next task in one
            place — so plant care feels like a ritual, not a chore.
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
          <a
            href="#waitlist"
            className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
          >
            Reserve your spot
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
            <PhoneShot src={screenDetail} className="w-[300px] md:w-[340px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div
        className="relative overflow-hidden rounded-[2rem] px-6 py-16 text-center text-white sm:px-12 md:py-20"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-green) 0%, var(--brand-green-dark) 100%)",
        }}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <img src={logoWhite} alt="" className="mx-auto h-14 w-14" />
        <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-[44px]">
          Be the first to grow with Sproutly.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/85">
          Join the waitlist for early access, launch-day perks and a free week of
          premium when we go live.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.querySelector<HTMLInputElement>("input[type=email]");
            if (input?.value) {
              form.reset();
              const status = form.querySelector<HTMLDivElement>("[data-status]");
              if (status) status.textContent = "You're on the list. See you at launch 🌱";
            }
          }}
          className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur sm:flex-row sm:pl-5"
        >
          <input
            type="email"
            required
            placeholder="you@garden.com"
            className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none sm:px-0"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-primary-dark transition-transform hover:scale-[1.02]"
          >
            Join waitlist
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
        <div data-status className="mt-4 text-sm text-white/90" aria-live="polite" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="h-6 w-6" />
          <span className="font-medium text-foreground">Sproutly</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#waitlist" className="hover:text-foreground">Waitlist</a>
        </div>
      </div>
    </footer>
  );
}
