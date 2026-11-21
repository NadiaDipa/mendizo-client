"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Please enter your name.";
    if (!formData.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.subject.trim()) errs.subject = "Please enter a subject.";
    if (!formData.message.trim()) {
      errs.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters long.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }

      toast.success(data.message || "Thank you! We have received your message.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error(
        err instanceof Error ? err.message : "Unable to send message right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-navy pt-32 pb-16 text-on-dark sm:pt-40 sm:pb-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky">
                <Sparkles className="h-3.5 w-3.5" />
                We&apos;re Here to Help
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-on-dark sm:text-5xl">
                Get in Touch with Mendizo
              </h1>
              <p className="mt-4 text-base text-on-dark/75 sm:text-lg">
                Have questions about our repair services, booking procedures, or becoming a verified technician?
                Our support team is ready to assist you.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Contact Information & Support Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-sky">
                  Contact Information
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-3xl">
                  Talk with Our Team
                </h2>
                <p className="mt-2 text-sm text-foreground/60 dark:text-on-dark/60 leading-relaxed">
                  Reach out directly via phone or email, or visit our office. We respond to all inquiries
                  promptly.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Email card */}
                <div className="flex items-start gap-4 rounded-2xl border border-foreground/10 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-surface/30">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-sky/10 dark:text-sky">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-navy dark:text-on-dark">
                      Email Us
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground/60 dark:text-on-dark/60">
                      Our friendly support team is here to help.
                    </p>
                    <a
                      href="mailto:support@mendizo.com"
                      className="mt-2 inline-block text-xs font-bold text-primary hover:underline dark:text-sky"
                    >
                      support@mendizo.com
                    </a>
                  </div>
                </div>

                {/* Phone card */}
                <div className="flex items-start gap-4 rounded-2xl border border-foreground/10 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-surface/30">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-sky/10 dark:text-sky">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-navy dark:text-on-dark">
                      Call Us Directly
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground/60 dark:text-on-dark/60">
                      Mon-Sat from 9:00 AM to 8:00 PM.
                    </p>
                    <a
                      href="tel:+8801700000000"
                      className="mt-2 inline-block text-xs font-bold text-primary hover:underline dark:text-sky"
                    >
                      +880 1700 000000
                    </a>
                  </div>
                </div>

                {/* Office card */}
                <div className="flex items-start gap-4 rounded-2xl border border-foreground/10 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-surface/30">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-sky/10 dark:text-sky">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-navy dark:text-on-dark">
                      Headquarters
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground/60 dark:text-on-dark/60">
                      Gulshan-2, Dhaka 1212, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Hours card */}
                <div className="flex items-start gap-4 rounded-2xl border border-foreground/10 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-surface/30">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-sky/10 dark:text-sky">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-navy dark:text-on-dark">
                      Service Hours
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground/60 dark:text-on-dark/60">
                      Sunday – Friday: 8:00 AM – 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-foreground/10 bg-white p-7 shadow-lg dark:border-white/10 dark:bg-surface/40 sm:p-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-sky/10 dark:text-sky">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-navy dark:text-on-dark">
                      Send Us a Message
                    </h3>
                    <p className="text-xs text-foreground/60 dark:text-on-dark/60">
                      Fill out the form below and we will respond as soon as possible.
                    </p>
                  </div>
                </div>

                <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/70"
                      >
                        Your Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. John Doe"
                        className={`mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary dark:text-on-dark dark:placeholder:text-on-dark/30 ${
                          errors.name
                            ? "border-red-500"
                            : "border-foreground/15 dark:border-white/15"
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/70"
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className={`mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary dark:text-on-dark dark:placeholder:text-on-dark/30 ${
                          errors.email
                            ? "border-red-500"
                            : "border-foreground/15 dark:border-white/15"
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/70"
                    >
                      Subject *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="e.g. Question about AC repair booking"
                      className={`mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary dark:text-on-dark dark:placeholder:text-on-dark/30 ${
                        errors.subject
                          ? "border-red-500"
                          : "border-foreground/15 dark:border-white/15"
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/70"
                    >
                      Message (Min 10 characters) *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Please describe how we can assist you..."
                      className={`mt-2 w-full rounded-xl border bg-background p-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary dark:text-on-dark dark:placeholder:text-on-dark/30 ${
                        errors.message
                          ? "border-red-500"
                          : "border-foreground/15 dark:border-white/15"
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
