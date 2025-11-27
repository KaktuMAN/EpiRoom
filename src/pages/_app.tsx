import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ThemeProvider } from '@mui/material/styles';
import theme from "@components/Theme";
import CssBaseline from '@mui/material/CssBaseline';
import { ReactElement, ReactNode} from "react";
import "@styles/scroller.css"
import "@styles/rooms.css"
import Head from "next/head";
import Snowflake from "@components/Theme/Snowflake";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement<Element>) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json"/>
      </Head>
      <ThemeProvider theme={theme}>
      <div id="snowflakes" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 69420, pointerEvents: "none"}}>
        {Array.from({length: 42}, (_, i) => <Snowflake key={i} />)}
      </div>
      <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
)
}

export default MyApp
