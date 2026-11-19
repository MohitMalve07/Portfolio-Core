import { type FormEvent, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Lock,
  Mail,
  Send,
  X,
} from 'lucide-react';
import { CONTACT_CONTENT } from '../../data/contact';

interface ContactLetterProps {
  visible: boolean;
  onClose: () => void;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/**
 * Physical warm-ivory parchment letter displayed after the mailbox reveal,
 * featuring dark brown handwritten typography, wax seal accent, verified
 * contact links, and a Formspree-backed Quick Note form.
 */
export function ContactLetter({ visible, onClose }: ContactLetterProps) {
  const letterRef = useRef<HTMLDivElement>(null);

  const formspreeEndpoint =
    import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim() ?? '';
  const isFormConfigured =
    Boolean(formspreeEndpoint) && !formspreeEndpoint.includes('YOUR_FORM_ID');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !letterRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letterRef.current,
        { opacity: 0, scale: 0.92, y: 18, rotation: 2.8 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: 1.1,
          duration: 0.42,
          ease: 'power3.out',
        },
      );
    }, letterRef);

    return () => ctx.revert();
  }, [visible]);

  if (!visible) return null;

  const isSubmitting = status === 'submitting';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isFormConfigured) {
      setStatus('error');
      setErrorMsg('Contact form is not configured yet.');
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setStatus('error');
      setErrorMsg('Please fill in your name, email, subject, and message.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMsg(null);

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          _replyto: trimmedEmail,
          subject: trimmedSubject,
          _subject: trimmedSubject,
          message: trimmedMessage,
          _gotcha: honeypot,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        errors?: { message?: string }[];
        error?: string;
      } | null;

      if (!response.ok) {
        const apiError =
          payload?.errors?.map((err) => err.message).filter(Boolean).join(', ') ||
          payload?.error ||
          `Unable to send message right now (status ${response.status}).`;
        throw new Error(apiError);
      }

      // Clear fields only after Formspree confirms delivery
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setHoneypot('');
      setStatus('success');
      setErrorMsg(null);
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not reach the mail service. Please check your connection and try again.',
      );
    }
  };

  return (
    <aside
      role="dialog"
      aria-label="Contact letter from Mohit"
      className="fixed bottom-3 left-3 right-3 z-30 md:bottom-4 md:left-auto md:right-6 md:top-auto md:w-[410px] xl:bottom-auto xl:right-8 xl:top-[calc(50%+18px)] xl:w-[450px] xl:-translate-y-1/2"
    >
      <div
        ref={letterRef}
        className="relative drop-shadow-[0_18px_28px_rgba(12,5,2,0.72)]"
      >
        {/* Small crimson wax seal overlapping top-left corner */}
        <div
          aria-hidden="true"
          className="absolute -left-2.5 -top-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#5b1510] bg-gradient-to-br from-[#c93e33] via-[#9e271e] to-[#6b1712] shadow-[0_3px_6px_rgba(18,6,2,0.55),inset_0_1px_2px_rgba(255,196,184,0.45)]"
        >
          <span className="font-handwritten text-sm font-bold text-[#f9d79b]">
            M
          </span>
        </div>

        {/* Aged parchment sheet */}
        <div className="paper-note-surface font-handwritten relative max-h-[calc(100dvh-4.75rem)] overflow-y-auto px-4.5 pb-4 pt-4 text-[#2b1a0e] shadow-[inset_0_0_28px_rgba(139,98,52,0.24),inset_0_1px_0_rgba(255,255,255,0.65)] sm:px-5.5">
          {/* Minimal golden inner hairline accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 border border-[#b38644]/35"
          />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-3 border-b border-[#9e7442]/35 pb-2">
            <div className="pl-3">
              <h2 className="text-[26px] font-bold leading-none text-[#241207]">
                {CONTACT_CONTENT.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close contact letter"
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#8e6435]/60 bg-[#e6d2ad]/80 text-[#3c2312] transition hover:bg-[#d8be8f] active:translate-y-px"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Letter Body */}
          <div className="relative mt-2.5 space-y-1.5 text-[16.5px] leading-[1.32] text-[#2f1d10] md:text-[15.5px] md:leading-[1.28]">
            <p className="font-bold text-[#241207]">
              {CONTACT_CONTENT.greeting}
            </p>
            {CONTACT_CONTENT.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="pt-0.5 text-right text-[18px] font-bold text-[#241207] md:text-[17px]">
              {CONTACT_CONTENT.signature}
            </p>
          </div>

          {/* Contact Actions */}
          <div className="relative mt-2.5 flex flex-wrap items-center gap-2 border-t border-[#9e7442]/35 pt-2.5">
            {CONTACT_CONTENT.channels.map((ch) => {
              const Icon =
                ch.id === 'email'
                  ? Mail
                  : ch.id === 'linkedin'
                    ? LinkedInMark
                    : GitHubMark;

              return (
                <a
                  key={ch.id}
                  href={ch.href}
                  target={ch.external ? '_blank' : undefined}
                  rel={ch.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#8a5724] bg-[#4b2d18] px-3 py-1.5 font-sans text-xs font-bold text-[#ffefc6] shadow-sm transition hover:bg-[#613b20]"
                >
                  <Icon className="h-3.5 w-3.5 text-[#f5be58]" />
                  <span>{ch.label}</span>
                  {ch.external && <ExternalLink className="h-3 w-3 opacity-80" />}
                </a>
              );
            })}
          </div>

          {/* Compact Parchment Quick Note Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative mt-3 space-y-2 rounded-lg border border-[#a37d4b]/45 bg-[#ead8b4]/55 p-3 font-sans"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[#5a3b20]">
              <span>Quick Note</span>
              {!isFormConfigured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7c3f1d]">
                  <Lock className="h-3 w-3" />
                  Contact form is not configured yet
                </span>
              )}
            </div>

            {status === 'success' ? (
              <div
                role="status"
                className="space-y-2 rounded-lg border border-[#5d7a36]/50 bg-[#e4ecd2]/80 p-3 text-xs text-[#2b3f14]"
              >
                <div className="flex items-start gap-2 font-semibold">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4e7323]" />
                  <span>
                    Your message has been delivered! Thanks for reaching out.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="cursor-pointer text-[11px] font-bold text-[#4a3019] underline underline-offset-2 hover:text-[#2a1709]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                {/* Hidden Formspree honeypot field */}
                <input
                  type="text"
                  name="_gotcha"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={!isFormConfigured || isSubmitting}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    aria-label="Name"
                    className="w-full rounded border border-[#a88352]/75 bg-[#fbf4e4]/90 px-3 py-1.5 text-base text-[#2d1a0b] placeholder:text-[#7c5c3e]/80 focus:border-[#8a5724] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f1e5cb]/65 disabled:text-[#6b4d31] md:px-2.5 md:py-1 md:text-xs"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={!isFormConfigured || isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    aria-label="Email"
                    className="w-full rounded border border-[#a88352]/75 bg-[#fbf4e4]/90 px-3 py-1.5 text-base text-[#2d1a0b] placeholder:text-[#7c5c3e]/80 focus:border-[#8a5724] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f1e5cb]/65 disabled:text-[#6b4d31] md:px-2.5 md:py-1 md:text-xs"
                  />
                </div>

                <input
                  type="text"
                  name="subject"
                  required
                  disabled={!isFormConfigured || isSubmitting}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  aria-label="Subject"
                  className="w-full rounded border border-[#a88352]/75 bg-[#fbf4e4]/90 px-3 py-1.5 text-base text-[#2d1a0b] placeholder:text-[#7c5c3e]/80 focus:border-[#8a5724] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f1e5cb]/65 disabled:text-[#6b4d31] md:px-2.5 md:py-1 md:text-xs"
                />

                <textarea
                  rows={2}
                  name="message"
                  required
                  disabled={!isFormConfigured || isSubmitting}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message..."
                  aria-label="Message"
                  className="w-full resize-none rounded border border-[#a88352]/75 bg-[#fbf4e4]/90 px-3 py-1.5 text-base text-[#2d1a0b] placeholder:text-[#7c5c3e]/80 focus:border-[#8a5724] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f1e5cb]/65 disabled:text-[#6b4d31] md:px-2.5 md:py-1 md:text-xs"
                />

                {status === 'error' && errorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-1.5 rounded border border-[#9e271e]/45 bg-[#f7dcd6]/85 px-2.5 py-1.5 text-[11px] font-semibold text-[#6e1a13]"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!isFormConfigured || isSubmitting}
                    aria-busy={isSubmitting}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#8a5724] bg-[#4b2d18] px-3.5 py-1.5 text-xs font-bold text-[#ffefc6] shadow-sm transition hover:bg-[#613b20] active:translate-y-px disabled:cursor-not-allowed disabled:border-[#8e6739]/60 disabled:bg-[#cbb186] disabled:text-[#5a3d22] disabled:opacity-85"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#f5be58]" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-[#f5be58]" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </aside>
  );
}
