import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { configureAbly } from "@ably-labs/react-hooks";
import { server } from "../pages/index";

const clientId =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

configureAbly({
  authUrl: `${server}/api/createTokenRequest?clientId=${clientId}`,
  clientId: clientId,
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {

  
  return (
    <SessionProvider
      session={pageProps.session}
      refetchOnWindowFocus={false}
      refetchInterval={60 * 60}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
