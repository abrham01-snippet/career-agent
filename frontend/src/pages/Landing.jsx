import React from 'react';
import { Link } from 'react-router-dom';

import ThemeToggle from '../components/ThemeToggle.jsx';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Calendar,
  HelpCircle,
} from 'lucide-react';

export default function Landing() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Top Navigation Bar - Compact with no dead space */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              CareerPath
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("trust")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Why trust us
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/app"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Try it now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Container - Tightened top padding so content is right below nav */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-16">
        {/* 2. Hero Section - Centered with Clearer Copy */}
        <section className="max-w-3xl mx-auto text-center pt-8 pb-4 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Guide · 100% Free & Private</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Turn your resume into a{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              7-day action plan
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            See which opportunities fit your current skills, identify your exact
            gaps, and get a structured day-by-day schedule to close them.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/app"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span>Analyze my CV</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm px-5 py-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
            >
              See how it works
            </button>
          </div>
        </section>

        {/* 3. Three Feature Cards */}
        <section id="features" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Built for complete student transparency
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Interactive tools designed to empower university students with
              real skill insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Chat with your AI adviser
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tell your adviser to remove SQL, add Figma at working level, or
                make your plan lighter. The assistant computes and updates your
                profile instantly.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Edit your profile
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Inspect quoted evidence directly from your resume text, verify
                weak evidence warnings, adjust proficiency levels, or restore
                removed skills with one click.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Live job matching
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Opportunity cards visibly re-rank with animated delta points
                (+8, -12, new #1) whenever any skill level is adjusted in real
                time.
              </p>
            </div>
          </div>
        </section>

        {/* 4. How It Works in 5 Numbered Steps */}
        <section
          id="how-it-works"
          className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-8 transition-colors"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Five Simple Steps
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              How CareerPath works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              From raw resume text to a personalized, day-by-day learning
              schedule in under two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                num: "01",
                title: "Upload CV",
                desc: "Upload your CV document or paste your resume text directly.",
              },
              {
                num: "02",
                title: "Review Skills",
                desc: "Audit verified skills and inspect quoted evidence.",
              },
              {
                num: "03",
                title: "See Matches",
                desc: "Examine live ranked scores and why specific roles fit.",
              },
              {
                num: "04",
                title: "Get 7-Day Plan",
                desc: "Receive daily bite-sized exercises targeting your exact gaps.",
              },
              {
                num: "05",
                title: "Save & Return",
                desc: "Keep your plan ID to track progress across sessions.",
              },
            ].map((st) => (
              <div
                key={st.num}
                className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-xl space-y-2"
              >
                <span className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {st.num}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-xs transition-colors"
            >
              <span>Start with Step 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 5. Why You Can Trust the Results */}
        <section
          id="trust"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Why you can trust the results
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We reject black-box career advice. Every score, recommendation,
              and task is grounded in transparent logic you can verify yourself.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-2">
              <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase font-mono">
                01. Open Code
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Transparent Code
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Scores come from transparent formulas, with required skills
                weighted 2x and clear proficiency tiers.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase font-mono">
                02. Direct Quotes
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Quotes Your CV
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every explanation pairs direct quotes from your CV with the
                opportunity specs for honest alignment.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-2">
              <div className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase font-mono">
                03. Catalog Proof
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Curated Catalog
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Plans strictly recommend verified exercises in our catalog, and
                honestly flag when a skill has no resource.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Student FAQ */}
        <section id="faq" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto pt-2">
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Is my CV stored or shared?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No. CareerPath operates completely in your web browser. No
                resume data or personal information is transmitted to any
                external server or employer.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Does CareerPath apply to jobs for me?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Never. CareerPath is 100% guidance only. We do not feature
                "Apply" buttons or send resumes to recruiters. Our goal is
                student preparation.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                How is my match score calculated?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We compute weighted credit based on required criteria (weight 2)
                and preferred criteria (weight 1), scoring your proficiency from
                0% to 100%.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Can I modify my skills manually?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes. You can tune your levels, remove or restore skills, add new
                skills, or use the interactive AI chat assistant to adjust your
                profile.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-1.5 md:col-span-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                What do I get at the end?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You receive a saved 7-day action syllabus (with an ID like
                PLAN-1001) that you can reopen anytime from "/plans" to check
                off daily study tasks.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Final Call to Action Band */}
        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to see where you stand?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Start by uploading your resume or testing our live demo profile in
              seconds.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/app"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>Try CareerPath now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      {/* Footer */}
      <footer className="bg-white dark:bg-[#0b1120] border-t border-slate-200 dark:border-slate-800/80 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand & Mission */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                  CareerPath
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Empowering students to analyze CVs, identify real skill gaps,
                and follow transparent study roadmaps. 100% guidance only, runs
                privately in your browser.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    How it works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("trust")}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Why trust us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Tool & Quick Start */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Get Started
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    to="/app"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-indigo-600 dark:text-indigo-400"
                  >
                    Analyze CV Now →
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400">No account required</span>
                </li>
                <li>
                  <span className="text-slate-400">In-browser simulation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>
              © {new Date().getFullYear()} CareerPath. Built for university
              student guidance.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              No personal data or resume records are sent to external servers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
