import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ThemeProvider } from '@mui/material/styles';
import theme from "@components/Theme";
import CssBaseline from '@mui/material/CssBaseline';
import { ReactElement, ReactNode} from "react";
import "@styles/scroller.css"
import "@styles/rooms.css"
import Head from "next/head";

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
      <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
)
}

export default MyApp
