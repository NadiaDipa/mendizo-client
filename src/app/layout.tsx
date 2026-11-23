import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mendizo — Expert Repairs at Your Doorstep",
  description:
    "Book trusted professionals for appliance and device repairs with Mendizo.",
  icons: {
    icon: "/mendizo-logo.svg",
  },
};

// Runs before paint so a saved dark theme is applied without a flash.
const themeScript = `(function(){try{var saved=localStorage.getItem("mendizo-theme");var dark=saved?saved==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var root=document.documentElement;root.classList.toggle("dark",dark);root.style.colorScheme=dark?"dark":"light";root.dataset.theme=dark?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerif.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}

        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            duration: 4500,
            style: {
              fontFamily: "var(--font-manrope)",
              fontSize: "15px",
              fontWeight: "600",
              borderRadius: "16px",
              maxWidth: "400px",
            },
          }}
        />
      </body>
    </html>
  );
}
