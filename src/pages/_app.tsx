import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRemoteCSS } from "@/hooks/useRemoteCSS";
import { useStore } from "react-redux";
import { streamSlice } from "@/store/slices/streamSlice";
import Head from "next/head";

const MfeProviders = dynamic(() => import("@/components/MfeProviders"), {
  ssr: false,
});

function StreamStoreInjector({ children }: { children: React.ReactNode }) {
  const store = useStore() as any;
  useEffect(() => {
    if (store && store.injectReducer) {
      store.injectReducer("streams", streamSlice.reducer);
    }
  }, [store]);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  const SHARED_MFE_URL =
    process.env.NEXT_PUBLIC_SHARED_URL || "http://localhost:3342";

  const { loaded, error } = useRemoteCSS(
    SHARED_MFE_URL,
    "shared_remote",
    "./Button",
  );

  const showContent = loaded || error;

  return (
    <MfeProviders>
      <StreamStoreInjector>
        <Head>
          {/* Preconnect ke domain CDN untuk mempercepat DNS lookup & TLS handshake */}
          <link rel="preconnect" href="https://cdn.jsdelivr.net" />
          <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
          {/* Lightgallery CSS */}
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery-bundle.min.css"
          />
        </Head>
        {showContent ? (
          <Component {...pageProps} />
        ) : (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
            Loading resources...
          </div>
        )}
      </StreamStoreInjector>
    </MfeProviders>
  );
}
