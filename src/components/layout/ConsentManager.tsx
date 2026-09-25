"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/format";
import { persistFirstTouch } from "@/lib/utm";

export interface Consent {
  v: 1;
  analytics: boolean;
  marketing: boolean;
  at: number;
}

const KEY = "nd-consent";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function inject(src: string, id: string, inline?: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  if (inline) s.text = inline;
  else {
    s.src = src;
    s.async = true;
  }
  document.head.appendChild(s);
}

/** Loads tags strictly after consent. Consent Mode v2 signals are kept in sync for GTM. */
function applyConsent(c: Consent) {
  const w = window as Window & { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag requires the arguments object
    w.dataLayer.push(arguments);
  };
  w.gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });

  const { gtmId, ga4Id, metaPixelId } = site.analytics;
  if ((c.analytics || c.marketing) && gtmId) {
    w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    inject(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`, "nd-gtm");
  }
  if (c.analytics && ga4Id && !gtmId) {
    inject(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`, "nd-ga4");
    w.gtag("js", new Date());
    w.gtag("config", ga4Id, { anonymize_ip: true });
  }
  if (c.marketing && metaPixelId && !gtmId) {
    inject(
      "",
      "nd-meta",
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`,
    );
  }
  if (c.analytics) persistFirstTouch();
}

export interface CookieLabels {
  title: string;
  text: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  save: string;
  necessary: string;
  necessaryText: string;
  analytics: string;
  analyticsText: string;
  marketing: string;
  marketingText: string;
  policy: string;
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("nd:cookies"));
}

export function ConsentManager({ labels, policyHref }: { labels: CookieLabels; policyHref: string }) {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      applyConsent(existing);
    } else {
      // Appear after first paint so the banner never competes with LCP
      const t = window.setTimeout(() => setVisible(true), 1400);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? true);
      setMarketing(c?.marketing ?? false);
      setCustom(true);
      setVisible(true);
    };
    window.addEventListener("nd:cookies", onOpen);
    return () => window.removeEventListener("nd:cookies", onOpen);
  }, []);

  const save = (a: boolean, m: boolean) => {
    const c: Consent = { v: 1, analytics: a, marketing: m, at: Date.now() };
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      /* ignore */
    }
    applyConsent(c);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      role="region"
      aria-label={labels.title}
      className="fixed inset-x-2 bottom-[calc(84px+env(safe-area-inset-bottom))] z-[45] animate-[nd-fade-up_420ms_var(--ease-out)] md:inset-x-auto md:bottom-6 md:left-6 md:w-[420px] lg:bottom-6"
    >
      <div className="glass glass--prominent rounded-[26px] p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-soft-fg">
            <Cookie aria-hidden size={20} strokeWidth={1.6} />
          </span>
          <div>
            <h2 className="t-title text-[1.0625rem]">{labels.title}</h2>
            <p className="mt-1 text-[0.875rem] leading-snug text-fg-muted">
              {labels.text}{" "}
              <Link href={policyHref} className="text-fg underline underline-offset-2">
                {labels.policy}
              </Link>
            </p>
          </div>
        </div>

        {custom && (
          <ul className="mt-4 flex flex-col gap-2">
            <ToggleRow label={labels.necessary} text={labels.necessaryText} checked disabled />
            <ToggleRow label={labels.analytics} text={labels.analyticsText} checked={analytics} onChange={setAnalytics} />
            <ToggleRow label={labels.marketing} text={labels.marketingText} checked={marketing} onChange={setMarketing} />
          </ul>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          {custom ? (
            <>
              <Button variant="secondary" onClick={() => save(false, false)}>
                {labels.rejectAll}
              </Button>
              <Button onClick={() => save(analytics, marketing)}>{labels.save}</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => save(false, false)}>
                {labels.rejectAll}
              </Button>
              <Button onClick={() => save(true, true)}>{labels.acceptAll}</Button>
              <Button variant="ghost" size="sm" className="col-span-2" onClick={() => setCustom(true)}>
                {labels.customize}
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ToggleRow({ label, text, checked, disabled, onChange }: { label: string; text: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl bg-fg/[0.04] p-3">
      <span className="flex flex-col">
        <span className="text-[0.9375rem] font-semibold">{label}</span>
        <span className="text-[0.8125rem] leading-snug text-fg-muted">{text}</span>
      </span>
      <Switch checked={checked} disabled={disabled} onChange={onChange} label={label} />
    </li>
  );
}

export function Switch({ checked, disabled, onChange, label }: { checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-[31px] w-[51px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 disabled:opacity-60",
        "before:absolute before:-inset-2 before:content-['']",
        checked ? "bg-success" : "bg-fg/20",
      )}
    >
      <span
        className={cn(
          "block size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgb(0_0_0/0.15),0_1px_1px_rgb(0_0_0/0.16)] transition-transform duration-300 ease-(--ease-out)",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}
