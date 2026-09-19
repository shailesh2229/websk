import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground font-mono">
          &copy; {new Date().getFullYear()} WEBSK. All rights reserved.
        </p>
        <div className="flex gap-4">
          {Object.entries(profile.socials).map(([key, url]) => (
            <Link
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground capitalize"
            >
              {key}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
