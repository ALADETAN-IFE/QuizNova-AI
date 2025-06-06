import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";
import { ResultProvider } from "@/context/ResultContext";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";

// Configure Inter font for Turbopack compatibility
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "QuizNova AI",
  description: "AI-powered quiz creation and management platform",
  authors: [{ name: "IfeCodes" }],
  icons: "/quizNova.ico",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QuizNova AI",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  creator: "IfeCodes",
  publisher: "IfeCodes",
  openGraph: {
    title: "QuizNova AI",
    description: "AI-powered quiz creation and management platform",
    type: "website",
    siteName: "QuizNova AI",
    locale: "en_US",
    images: [
      {
        url: "/logo.png", // Path to your Open Graph image
        width: 1200, // Recommended width
        height: 630, // Recommended height
        alt: "QuizNova AI Logo", // Alt text for the image
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizNova AI",
    description: "AI-powered quiz creation and management platform",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/quizNova.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QuizNova AI" />
      </head>
      <body className={`min-h-screen bg-deep-space text-cool-white pb-20 ${inter.className}`}>
        <SessionProviderWrapper>
          <AuthProvider>
            <ResultProvider>
              <Toaster 
                // position="top-right"
              />
              <Analytics />
              {children}
              <Navigation />
            </ResultProvider>
          </AuthProvider>
        </SessionProviderWrapper>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              // Unregister any existing service workers
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                  registration.unregister();
                }
              });

              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                    
                    // Check if the app is already installed
                    if (!window.matchMedia('(display-mode: standalone)').matches) {
                      // Show install prompt after a delay
                      setTimeout(() => {
                        if ('BeforeInstallPromptEvent' in window) {
                          window.addEventListener('beforeinstallprompt', (e) => {
                            e.preventDefault();
                            // Store the event for later use
                            window.deferredPrompt = e;
                            
                            // Create and show the install prompt
                            const installPrompt = document.createElement('div');
                            installPrompt.style.cssText = \`
                              position: fixed;
                              bottom: 20px;
                              left: 50%;
                              transform: translateX(-50%);
                              background: rgba(0, 0, 0, 0.9);
                              color: white;
                              padding: 16px;
                              border-radius: 12px;
                              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                              z-index: 1000;
                              max-width: 90%;
                              width: 400px;
                              text-align: center;
                              backdrop-filter: blur(10px);
                              border: 1px solid rgba(255, 255, 255, 0.1);
                            \`;

                            const promptContent = document.createElement('div');
                            promptContent.innerHTML = \`
                              <div style="margin-bottom: 12px; font-weight: 600;">Install QuizNova AI</div>
                              <div style="margin-bottom: 16px; font-size: 14px; opacity: 0.9;">
                                Install our app for a better experience. Get quick access and work offline.
                              </div>
                            \`;

                            const buttonContainer = document.createElement('div');
                            buttonContainer.style.cssText = \`
                              display: flex;
                              gap: 8px;
                              justify-content: center;
                            \`;

                            const installButton = document.createElement('button');
                            installButton.textContent = 'Install';
                            installButton.style.cssText = \`
                              background: #4CAF50;
                              color: white;
                              border: none;
                              padding: 8px 24px;
                              border-radius: 6px;
                              font-weight: 500;
                              cursor: pointer;
                              transition: background 0.2s;
                            \`;
                            installButton.onmouseover = () => installButton.style.background = '#45a049';
                            installButton.onmouseout = () => installButton.style.background = '#4CAF50';
                            installButton.onclick = () => {
                              window.deferredPrompt.prompt();
                              window.deferredPrompt.userChoice.then((choiceResult) => {
                                if (choiceResult.outcome === 'accepted') {
                                  console.log('User accepted the install prompt');
                                  installPrompt.remove();
                                }
                                window.deferredPrompt = null;
                              });
                            };

                            const dismissButton = document.createElement('button');
                            dismissButton.textContent = 'Not Now';
                            dismissButton.style.cssText = \`
                              background: transparent;
                              color: white;
                              border: 1px solid rgba(255, 255, 255, 0.3);
                              padding: 8px 24px;
                              border-radius: 6px;
                              font-weight: 500;
                              cursor: pointer;
                              transition: background 0.2s;
                            \`;
                            dismissButton.onmouseover = () => dismissButton.style.background = 'rgba(255, 255, 255, 0.1)';
                            dismissButton.onmouseout = () => dismissButton.style.background = 'transparent';
                            dismissButton.onclick = () => {
                              installPrompt.remove();
                              // Store in localStorage to not show again for 24 hours
                              localStorage.setItem('pwaInstallDismissed', Date.now().toString());
                            };

                            buttonContainer.appendChild(installButton);
                            buttonContainer.appendChild(dismissButton);
                            promptContent.appendChild(buttonContainer);
                            installPrompt.appendChild(promptContent);
                            document.body.appendChild(installPrompt);

                            // Check if we should show the prompt (not dismissed in last 24 hours)
                            const lastDismissed = localStorage.getItem('pwaInstallDismissed');
                            if (lastDismissed) {
                              const hoursSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
                              if (hoursSinceDismissed < 24) {
                                installPrompt.remove();
                              }
                            }
                          });
                        }
                      }, 3000);
                    }
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
