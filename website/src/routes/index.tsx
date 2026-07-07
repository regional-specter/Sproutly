import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Check,
  Star,
  Facebook,
  Linkedin,
  Instagram,
  Send,
} from "lucide-react";

import logo from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
import bgElements from "@/assets/bg-elements.png";
import screenHome from "@/assets/screen-home.png";
import screenDetail from "@/assets/screen-detail.png";
import featureScan from "@/assets/feature-scan.png";
import featureHealth from "@/assets/feature-score.png";
import featureCare from "@/assets/feature-care.png";
import featureReminders from "@/assets/feature-reminder.png";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Preview />
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
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-[220px] z-0 sm:top-[240px] md:top-[260px]">
        <img
          src={bgElements}
          alt=""
          aria-hidden
          className="w-full select-none"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-16 pb-8 text-center md:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[#b8dfc4] bg-[#CEEDD6] px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          <Sparkles className="h-4 w-4" />
          Early access — join the waitlist
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.06em] text-black sm:text-5xl md:text-6xl lg:text-[68px]">
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

function HeroPhoneShowcase() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-3xl">
      <div className="relative flex min-h-[360px] items-end justify-center sm:min-h-[420px] md:min-h-[480px]">
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
      className={`block h-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.22)] ${className}`}
    />
  );
}

function WaitlistForm({
  className = "",
  formId = "waitlist",
}: {
  className?: string;
  formId?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        setStatus("success");
      }}
      className={className}
    >
      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-3.5 text-sm font-medium text-primary-dark">
          <Check className="h-4 w-4" />
          You're on the list — we'll be in touch soon.
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-lg flex-col gap-2 rounded-xl border border-border/70 bg-white p-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:gap-0 sm:pl-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@garden.com"
            className="w-full bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none sm:flex-1 sm:px-0 sm:py-0"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[linear-gradient(180deg,#000000_0%,#4A4A4A_100%)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
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
      title: "Instant plant scans",
      desc: "Point, snap, done. Our AI identifies the species and reads the leaves for stress signals in seconds.",
      image: featureScan,
      bg: "bg-[#4CA76B]",
      textPosition: "top",
    },
    {
      title: "0–100 health score",
      desc: "A clear number that tells you if your plant is thriving, coasting, or asking for help right now.",
      image: featureHealth,
      bg: "bg-[#2F6B45]",
      textPosition: "bottom",
    },
    {
      title: "Personalised care routines",
      desc: "Light, water, soil, feeding, temperature — a schedule that fits your specific plant, not a generic guide.",
      image: featureCare,
      bg: "bg-[#2F6B45]",
      textPosition: "bottom",
    },
    {
      title: "Gentle reminders",
      desc: "Watering, misting and check-in nudges so nothing wilts while you're busy living your life.",
      image: featureReminders,
      bg: "bg-[#2B5E3D]",
      textPosition: "top",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-20 md:py-28">
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
        {items.map(({ title, desc, image, bg, textPosition }) => (
          <div
            key={title}
            className={`relative flex aspect-[450/530] flex-col overflow-hidden rounded-[17px] p-6 text-white ${bg}`}
          >
            {textPosition === "top" && (
              <>
                <p className="text-lg font-semibold tracking-tight">{title}</p>
                <p className="text-sm leading-relaxed text-white/80">{desc}</p>
                <img
                  src={image}
                  alt={title}
                  className="pointer-events-none absolute inset-x-0 bottom-0 w-full select-none"
                />
              </>
            )}

            {textPosition === "bottom" && (
              <>
                <img
                  src={image}
                  alt={title}
                  className="pointer-events-none absolute inset-x-0 top-0 w-full select-none"
                />
                <div className="relative z-10 mt-auto">
                  <p className="text-lg font-semibold tracking-tight">{title}</p>
                  <p className="text-sm leading-tight text-white/80">{desc}</p>
                </div>
              </>
            )}
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
    <section id="how" className="border-y border-border bg-white">
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
            <PhoneShot src={screenDetail} className="w-[300px] md:w-[340px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const companyLinks = [
    { label: "Home", href: "#top" },
    { label: "About us", href: "#features" },
    { label: "Pricing", href: "#waitlist" },
    { label: "Blog", href: "#preview" },
    { label: "Blog Details", href: "#preview" },
  ];

  const productLinks = [
    { label: "Features", href: "#features" },
    { label: "Careers", href: "#waitlist" },
    { label: "How it works", href: "#how" },
    { label: "Contact", href: "#waitlist" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "Cookie", href: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Send, label: "Telegram", href: "#" },
  ];

  return (
    <footer className="bg-[#f7f7f7]">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-12">
        {/* CTA banner */}
        <div className="relative overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white sm:px-12 sm:py-16 md:py-20">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #5cb85c 0%, #3d8b40 35%, #7ec850 65%, #489e4b 100%)",
            }}
          />
          <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#a8e063]/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-8 h-64 w-64 rounded-full bg-[#f7d794]/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-72 rounded-full bg-[#2d6a30]/50 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 right-1/4 h-40 w-56 rounded-full bg-[#b8e994]/35 blur-3xl" />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-[42px] md:leading-[1.1]">
              Let AI take the guesswork out of plant care
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              From species ID and health scores to watering schedules and gentle
              reminders — automate the plant care your home garden shouldn&apos;t
              depend on guesswork for.
            </p>
            <a
              href="#waitlist"
              className="mt-8 inline-flex items-center gap-1 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
            >
              Get early access
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Main footer columns */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#top" className="flex items-center gap-2">
              <img src={logo} alt="Sproutly" className="h-6 w-6" />
              <span className="text-base font-semibold text-foreground">Sproutly</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered plant care designed to help home gardeners identify,
              diagnose, and nurture every plant effortlessly and fast.
            </p>
            <div className="mt-5 flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Newsletter</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Get tips, product updates, and insights on growing smarter with AI.
            </p>
            <WaitlistForm formId="newsletter" className="mt-4 w-full" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sproutly. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legalLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}