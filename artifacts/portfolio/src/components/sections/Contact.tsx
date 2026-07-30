import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, MessageCircle, Send, CheckCircle } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";
import { cn } from "@workspace/fel7o-ds/lib/utils";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";
  if (!form.subject.trim()) errors.subject = "Subject is required";
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length < 20) errors.message = "Message must be at least 20 characters";
  return errors;
}

function FloatingInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  multiline,
  testId,
}: {
  label: string;
  name: keyof FormState;
  type?: string;
  value: string;
  onChange: (name: keyof FormState, value: string) => void;
  error?: string;
  multiline?: boolean;
  testId: string;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="floating-label-wrapper">
      <Tag
        id={name}
        type={!multiline ? type : undefined}
        name={name}
        value={value}
        placeholder=" "
        onChange={(e) => onChange(name, e.target.value)}
        rows={multiline ? 5 : undefined}
        className={cn(
          "w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none resize-none",
          multiline ? "pt-6" : "",
          error
            ? "border border-destructive bg-transparent text-foreground"
            : "border bg-transparent text-foreground focus:border-primary"
        )}
        style={{ background: "hsl(var(--card))" }}
        data-testid={testId}
      />
      <label htmlFor={name} className="floating-label text-sm">
        {label}
      </label>
      {error && (
        <p className="mt-1 text-xs text-destructive" data-testid={`error-${name}`}>
          {error}
        </p>
      )}
    </div>
  );
}

// Map-inspired decorative visual
function MapVisual() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative flex items-center justify-center"
      style={{
        height: "200px",
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapGrid)" />
      </svg>

      {/* "Roads" */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100" x2="400" y2="100" stroke="hsl(190, 100%, 50%)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="200" y1="0" x2="200" y2="200" stroke="hsl(262, 83%, 57%)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="60" x2="150" y2="100" stroke="hsl(190, 100%, 50%)" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="250" y1="100" x2="400" y2="140" stroke="hsl(262, 83%, 57%)" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>

      {/* Location pin */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
          style={{
            background: "hsl(var(--primary) / 0.2)",
            border: "2px solid hsl(var(--primary))",
            boxShadow: "0 0 20px hsl(var(--primary) / 0.4)",
            animation: "pulse-glow 2s ease infinite",
          }}
        >
          <MapPin size={16} style={{ color: "hsl(var(--primary))" }} />
        </div>
        <span className="text-sm font-medium text-foreground">Port Said, Egypt</span>
        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Available Worldwide</span>
      </div>

      {/* Ripple rings */}
      <div className="absolute rounded-full" style={{
        width: "60px", height: "60px",
        border: "1px solid hsl(var(--primary) / 0.2)",
        left: "calc(50% - 30px)",
        top: "calc(50% - 30px)",
        animation: "pulse 2s ease-out infinite",
      }} />
      <div className="absolute rounded-full" style={{
        width: "90px", height: "90px",
        border: "1px solid hsl(var(--primary) / 0.1)",
        left: "calc(50% - 45px)",
        top: "calc(50% - 45px)",
        animation: "pulse 2s ease-out 0.5s infinite",
      }} />
    </div>
  );
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "ahmed.khaled.elfalah@gmail.com",
    href: "mailto:ahmed.khaled.elfalah@gmail.com",
    accent: "primary",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+20 120 526 2412",
    href: "https://wa.me/201205262412",
    accent: "accent",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Port Said, Egypt — Remote Worldwide",
    href: "#",
    accent: "primary",
  },
];

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      // Save to database (fire-and-forget — don't block on failure)
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => {});

      const botToken = "8790393178:AAEJKEMwituS7Exp9xmcDrLESF1_fUYqc8c";
      const chatId = "8275645729";
      const escapeHtml = (str: string) =>
        str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const text = `🔔 <b>New Portfolio Message!</b>\n\n👤 <b>Name:</b> ${escapeHtml(form.name)}\n📧 <b>Email:</b> ${escapeHtml(form.email)}\n📌 <b>Subject:</b> ${escapeHtml(form.subject)}\n\n📝 <b>Message:</b>\n${escapeHtml(form.message)}`;

      await Promise.allSettled([
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "HTML",
          }),
        }),
        fetch("https://formsubmit.co/ajax/ahmed.khaled.elfalah@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            _subject: `New Portfolio Message: ${form.subject}`,
            message: form.message,
            _captcha: "false"
          }),
        })
      ]);
    } catch {
      // Ignore network errors
    }
    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    toast({
      title: "Message sent successfully",
      description: "Thank you for reaching out. I will get back to you within 24 hours.",
    });
  };

  return (
    <section id="contact" className="relative py-24 md:py-32" data-testid="contact-section">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
            <span className="text-sm font-mono uppercase tracking-widest" style={{ color: "hsl(var(--primary))" }}>
              08. Contact
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Let's Build Something
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Have a project in mind? Looking for a developer to join your team?
            I would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {submitted ? (
              <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: "hsl(var(--primary) / 0.1)",
                    border: "2px solid hsl(var(--primary) / 0.3)",
                  }}
                >
                  <CheckCircle size={36} style={{ color: "hsl(var(--primary))" }} />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Message Received</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. I will review your message and get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
                <FloatingInput
                  label="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  testId="input-name"
                />
                <FloatingInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  testId="input-email"
                />
                <FloatingInput
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  testId="input-subject"
                />
                <FloatingInput
                  label="Your Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  error={errors.message}
                  multiline
                  testId="input-message"
                />
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                  data-testid="button-submit-contact"
                  style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.3)" }}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "currentColor", borderTopColor: "transparent" }} />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Contact info + map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            {/* Contact cards */}
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              const isPrimary = info.accent === "primary";
              return (
                <motion.a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300 no-underline"
                  style={{ borderColor: isPrimary ? "hsl(var(--primary) / 0.2)" : "hsl(var(--accent) / 0.2)" }}
                  data-testid={`contact-info-${info.label.toLowerCase()}`}
                  data-hover
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isPrimary ? "hsl(var(--primary) / 0.1)" : "hsl(var(--accent) / 0.1)",
                      color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {info.label}
                    </div>
                    <div className="text-sm font-medium text-foreground">{info.value}</div>
                  </div>
                </motion.a>
              );
            })}

            {/* Map visual */}
            <MapVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
