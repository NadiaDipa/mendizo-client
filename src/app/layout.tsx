import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
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
          toastOptions={{
            duration: 4500,
            style: {
              background: "#EAF7FF",
              color: "#12232E",
              border: "1px solid #9BD5F5",
              borderRadius: "16px",
              padding: "17px 20px",
              fontFamily: "var(--font-manrope)",
              fontSize: "15px",
              fontWeight: "600",
              lineHeight: "1.5",
              boxShadow: "0 10px 30px rgba(0, 124, 199, 0.22)",
              maxWidth: "400px",
            },
            success: {
              iconTheme: {
                primary: "#16834A",
                secondary: "#D1F5DF",
              },
            },
            error: {
              iconTheme: {
                primary: "#DC4545",
                secondary: "#FEE2E2",
              },
            },
          }}
        />
        <SonnerToaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
