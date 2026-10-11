"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BookOpen, TerminalSquare, MessageSquare } from "lucide-react";

export function PageHelp() {
  const pathname = usePathname();
  if (pathname === "/dashboard") return null;
  const items = [
    { href: "/docs", title: "Find an endpoint", text: "Parameters, examples, and response formats.", icon: BookOpen },
    { href: "/playground", title: "Try a live request", text: "Explore the API without writing any code.", icon: TerminalSquare },
    { href: "https://github.com/fakhrul62/bdapi4all/issues", title: "Suggest a correction", text: "Help improve the API and its data.", icon: MessageSquare },
  ].filter(item => item.href !== pathname);
  return <div className="mx-auto grid max-w-7xl gap-3 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8" aria-label="Helpful next steps">
    {items.map(item => <Link key={item.href} href={item.href} target={item.href.startsWith("https") ? "_blank" : undefined} rel={item.href.startsWith("https") ? "noreferrer" : undefined} className="group flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5">
      <item.icon className="mt-0.5 size-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><span className="text-sm font-semibold">{item.title}</span><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p></div><ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>)}
  </div>;
}
