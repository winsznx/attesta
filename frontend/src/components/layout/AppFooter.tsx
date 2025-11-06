import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
              Attesta
            </h3>
            <p className="text-sm text-muted-foreground">
              Verify anything, prove everything - your legal truth layer powered
              by AI and blockchain.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#tech" className="hover:text-foreground">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="https://github.com/winsznx/attesta" className="hover:text-foreground" target="_blank">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="https://github.com/winsznx/attesta" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <div className="flex justify-center gap-6 mb-4">
            <a
              href="https://x.com/attestahq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Follow us on X (Twitter)"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/winsznx/attesta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View our GitHub repository"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Attesta. All rights reserved.</p>
            <p className="mt-2">
              <Link href="/terms" className="hover:text-foreground underline">Terms</Link>
              {" · "}
              <Link href="/privacy" className="hover:text-foreground underline">Privacy</Link>
              {" · "}
              Not legal advice - consult an attorney
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

