import { motion } from "framer-motion";
import { Mail, Linkedin, GraduationCap } from "lucide-react";
import { profile } from "../data";

export default function Footer() {
  return (
    <section
      id="contact"
      className="py-20 sm:py-28 border-t border-slate-100 bg-slate-900 text-slate-100"
      data-testid="contact-section"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            <span className="text-slate-500">05</span>
            <span className="inline-block h-px w-8 bg-slate-700" />
            Contact
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Let's get in touch.
          </h2>
          <p className="text-base text-slate-400 leading-relaxed max-w-xl">
            Open to research collaborations, talks, and mentoring conversations.
            The fastest way to reach me is email.
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          <div className="space-y-3" data-testid="contact-emails">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Email
            </p>
            {profile.emails.map((e) => (
              <a
                key={e}
                href={`mailto:${e}`}
                className="block text-base text-white hover:text-slate-300 transition-colors break-all"
                data-testid={`footer-email-${e}`}
              >
                {e}
              </a>
            ))}
          </div>

          <div className="space-y-3" data-testid="contact-links">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Elsewhere
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={profile.links.googleScholar}
                target="_blank"
                rel="noreferrer"
                data-testid="footer-scholar-link"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 hover:border-slate-600 transition-colors"
              >
                <GraduationCap size={16} />
                Google Scholar
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                data-testid="footer-linkedin-link"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 hover:border-slate-600 transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a
                href={`mailto:${profile.emails[0]}`}
                data-testid="footer-mail-link"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 hover:border-slate-600 transition-colors"
              >
                <Mail size={16} />
                Email
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p>
            Built by{' '}
            <a
              href="https://miraz235.github.io"
              target="_blank"
              rel="noreferrer"
              title="Asraful Karim's personal website"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <img src="https://miraz235.github.io/favicon.svg" alt="Asraful Karim" className="inline w-5 h-5 hover:scale-110 mr-1 opacity-75 hover:opacity-100 transition-opacity" />
            </a>{' '}&nbsp;
            &bull;&nbsp;{' '}
            <a
              href={profile.links.oldSite}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              My previous site
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}