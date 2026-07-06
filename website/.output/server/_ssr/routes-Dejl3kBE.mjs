import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as Linkedin, c as HeartPulse, d as Check, f as Bell, i as ScanLine, l as Facebook, n as Sparkles, o as Leaf, p as ArrowRight, r as Send, s as Instagram, t as Star, u as ChevronRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dejl3kBE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var logo_default = "/assets/logo-D7hjP5xy.png";
var logo_white_default = "/assets/logo-white-CPvaKe1A.png";
var bg_elements_default = "/assets/bg-elements-CrlOKLQt.png";
var screen_home_default = "/assets/screen-home-FtY_xII_.png";
var screen_detail_default = "/assets/screen-detail-IlZcxWcT.png";
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Nav() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-4 z-40 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-4xl items-center justify-between gap-3 rounded-full border border-white/10 bg-foreground/95 px-3 py-2 pl-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#top",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo_white_default,
						alt: "Sproutly",
						className: "h-6 w-6"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold tracking-tight text-background",
						children: "Sproutly"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-7 text-sm font-medium text-background/70 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#features",
							className: "transition-colors hover:text-background",
							children: "Features"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#how",
							className: "transition-colors hover:text-background",
							children: "How it works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#preview",
							className: "transition-colors hover:text-background",
							children: "Preview"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#waitlist",
						className: "hidden rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-background/90 transition-colors hover:bg-white/10 sm:inline-flex",
						children: "Contact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#waitlist",
						className: "inline-flex items-center gap-1.5 rounded-full bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.02]",
						children: "Join waitlist"
					})]
				})
			]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "top",
		className: "relative overflow-hidden bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-x-0 top-[220px] z-0 sm:top-[240px] md:top-[260px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: bg_elements_default,
				alt: "",
				"aria-hidden": true,
				className: "w-full select-none"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-16 pb-8 text-center md:pt-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 inline-flex items-center gap-2 rounded-lg border border-[#b8dfc4] bg-[#CEEDD6] px-4 py-1.5 text-sm font-medium text-secondary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), "Early access — join the waitlist"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.06em] text-black sm:text-5xl md:text-6xl lg:text-[68px]",
					children: [
						"The AI plant doctor for your",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "home garden."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg",
					children: "Snap a photo of any plant. Sproutly identifies the species, scores its health, and gives you a care routine that actually works."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitlistForm, { className: "mt-8 w-full max-w-md" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex -space-x-0.5",
						children: [
							0,
							1,
							2,
							3,
							4
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-primary text-primary" }, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loved by 2,400+ plant parents on the waitlist" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroPhoneShowcase, {})
			]
		})]
	});
}
function HeroPhoneShowcase() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative mx-auto mt-14 w-full max-w-3xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative flex min-h-[360px] items-end justify-center sm:min-h-[420px] md:min-h-[480px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 translate-y-2 sm:translate-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneShot, {
					src: screen_home_default,
					className: "w-[250px] sm:w-[290px] md:w-[330px]"
				})
			})
		})
	});
}
function PhoneShot({ src, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "Sproutly app screen",
		className: `block h-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.22)] ${className}`
	});
}
function WaitlistForm({ className = "", formId = "waitlist" }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("idle");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
		id: formId,
		onSubmit: (e) => {
			e.preventDefault();
			if (!email) return;
			setStatus("success");
		},
		className,
		children: status === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-3.5 text-sm font-medium text-primary-dark",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "You're on the list — we'll be in touch soon."]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-lg flex-col gap-2 rounded-xl border border-border/70 bg-white p-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:gap-0 sm:pl-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "email",
				required: true,
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: "you@garden.com",
				className: "w-full bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none sm:flex-1 sm:px-0 sm:py-0"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				className: "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[linear-gradient(180deg,#000000_0%,#4A4A4A_100%)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]",
				children: ["Get early access", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
			})]
		})
	});
}
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "features",
		className: "mx-auto max-w-6xl px-5 py-20 md:py-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium uppercase tracking-[0.18em] text-primary",
					children: "Features"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[44px]",
					children: "Everything your plants wish you knew."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground",
					children: "Sproutly turns your camera into a plant doctor, gardener and calendar — all in one calm, quiet app."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				{
					icon: ScanLine,
					title: "Instant plant scans",
					desc: "Point, snap, done. Our AI identifies the species and reads the leaves for stress signals in seconds."
				},
				{
					icon: HeartPulse,
					title: "0–100 health score",
					desc: "A clear number that tells you if your plant is thriving, coasting, or asking for help right now."
				},
				{
					icon: Leaf,
					title: "Personalised care routines",
					desc: "Light, water, soil, feeding, temperature — a schedule that fits your specific plant, not a generic guide."
				},
				{
					icon: Bell,
					title: "Gentle reminders",
					desc: "Watering, misting and check-in nudges so nothing wilts while you're busy living your life."
				}
			].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_40px_-24px_rgba(56,124,77,0.35)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-lg font-semibold tracking-tight",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: desc
					})
				]
			}, title))
		})]
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "how",
		className: "border-y border-border bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-20 md:py-28",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium uppercase tracking-[0.18em] text-primary",
					children: "How it works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[44px]",
					children: "Three taps to a healthier home garden."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-6 md:grid-cols-3",
				children: [
					{
						n: "01",
						title: "Snap a photo",
						desc: "Open Sproutly and take a quick photo of the plant you want to check on."
					},
					{
						n: "02",
						title: "Get an AI diagnosis",
						desc: "In seconds you'll see the species, a health score, and what's going right or wrong."
					},
					{
						n: "03",
						title: "Follow the routine",
						desc: "Save the plant to your garden and let gentle reminders keep it thriving over time."
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-primary",
							children: s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-xl font-semibold tracking-tight",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: s.desc
						})
					]
				}, s.n))
			})]
		})
	});
}
function Preview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "preview",
		className: "mx-auto max-w-6xl px-5 py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-center gap-14 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "order-2 md:order-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium uppercase tracking-[0.18em] text-primary",
						children: "The app"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[44px]",
						children: "A calmer way to care for what grows."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "Sproutly keeps every plant's history, care plan and next task in one place — so plant care feels like a ritual, not a chore."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-3",
						children: [
							"Track every plant in one virtual garden",
							"Species ID with concise, credible facts",
							"Care timeline so you spot patterns fast",
							"Free forever for your first 3 scans"
						].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/15 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground/90",
								children: b
							})]
						}, b))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "#waitlist",
						className: "mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]",
						children: ["Reserve your spot", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "order-1 flex justify-center md:order-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneShot, {
						src: screen_detail_default,
						className: "w-[300px] md:w-[340px]"
					})
				})
			})]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-[#f7f7f7]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 pt-16 pb-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white sm:px-12 sm:py-16 md:py-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0",
							style: { background: "linear-gradient(135deg, #5cb85c 0%, #3d8b40 35%, #7ec850 65%, #489e4b 100%)" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#a8e063]/40 blur-3xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-10 top-8 h-64 w-64 rounded-full bg-[#f7d794]/30 blur-3xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 left-1/3 h-48 w-72 rounded-full bg-[#2d6a30]/50 blur-2xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-10 right-1/4 h-40 w-56 rounded-full bg-[#b8e994]/35 blur-3xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-[42px] md:leading-[1.1]",
									children: "Let AI take the guesswork out of plant care"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg",
									children: "From species ID and health scores to watering schedules and gentle reminders — automate the plant care your home garden shouldn't depend on guesswork for."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#waitlist",
									className: "mt-8 inline-flex items-center gap-1 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]",
									children: ["Get early access", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2 lg:col-span-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#top",
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: logo_default,
										alt: "Sproutly",
										className: "h-6 w-6"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-semibold text-foreground",
										children: "Sproutly"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground",
									children: "AI-powered plant care designed to help home gardeners identify, diagnose, and nurture every plant effortlessly and fast."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 flex items-center gap-4",
									children: [
										{
											icon: Facebook,
											label: "Facebook",
											href: "#"
										},
										{
											icon: Linkedin,
											label: "LinkedIn",
											href: "#"
										},
										{
											icon: Instagram,
											label: "Instagram",
											href: "#"
										},
										{
											icon: Send,
											label: "Telegram",
											href: "#"
										}
									].map(({ icon: Icon, label, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href,
										"aria-label": label,
										className: "text-muted-foreground transition-colors hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
									}, label))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "Company"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3",
							children: [
								{
									label: "Home",
									href: "#top"
								},
								{
									label: "About us",
									href: "#features"
								},
								{
									label: "Pricing",
									href: "#waitlist"
								},
								{
									label: "Blog",
									href: "#preview"
								},
								{
									label: "Blog Details",
									href: "#preview"
								}
							].map(({ label, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href,
								className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
								children: label
							}) }, label))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "Product"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3",
							children: [
								{
									label: "Features",
									href: "#features"
								},
								{
									label: "Careers",
									href: "#waitlist"
								},
								{
									label: "How it works",
									href: "#how"
								},
								{
									label: "Contact",
									href: "#waitlist"
								}
							].map(({ label, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href,
								className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
								children: label
							}) }, label))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: "Newsletter"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-relaxed text-muted-foreground",
								children: "Get tips, product updates, and insights on growing smarter with AI."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitlistForm, {
								formId: "newsletter",
								className: "mt-4 w-full"
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Sproutly. All rights reserved."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center justify-center gap-x-6 gap-y-2",
						children: [
							{
								label: "Privacy Policy",
								href: "#"
							},
							{
								label: "Terms of Service",
								href: "#"
							},
							{
								label: "Security",
								href: "#"
							},
							{
								label: "Cookie",
								href: "#"
							}
						].map(({ label, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href,
							className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
							children: label
						}, label))
					})]
				})
			]
		})
	});
}
//#endregion
export { Landing as component };
