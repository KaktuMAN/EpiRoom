import {ReactElement} from "react";
import FullPage from "@components/layout/FullPage";
import Head from "next/head";
import {Card, CardMedia, Grid} from "@mui/material";
import {GetServerSideProps} from "next";
import path from "path";
import * as fs from "fs";
import {Town} from "@customTypes/town";
import Link from "next/link";
import {useRouter} from "next/router";



export const getServerSideProps: GetServerSideProps = async () => {
  const townsPath = path.join(process.cwd(), `./public/towns`);
  const towns: Town[] = [];

  try {
    fs.readdirSync(townsPath).map((town) => {
      towns.push(JSON.parse(fs.readFileSync(path.join(townsPath, town, "town.json"), 'utf8')) as Town);
    });
  } catch (error) {
    console.error(`Unable to load town informations: ${error}`);
    return { notFound: true };
  }
  return {
    props: { towns: towns },
  };
};

export default function TownSlector ({ towns }: {towns: Town[]}) {
  const router = useRouter();
  const tvSettings = !!router.query.tv;
  return (
    <main style={{width: "100%", height: "100%"}}>
      <Head>
        <title>EpiRooms</title>
      </Head>
      <h1 style={{textAlign: "center"}}>
        Sélectionnez votre ville
      </h1>
      <Grid container spacing={2} justifyContent={"center"}>
        {towns.map((town) => (
          <Grid item key={town.code}>
            <Link href={`/${town.code}/${town.mainFloor}${tvSettings ? "?tv=true" : ""}`}>
              <Card sx={{ minWidth: 250}}>
                <CardMedia component={"img"} alt={`${town.name} Image`} height={150} image={`/towns/${town.code}/image.png`}/>
                <h1 style={{textAlign: "center"}}>
                  {town.name}
                </h1>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </main>
  )
}

TownSlector.getLayout = function getLayout(page: ReactElement<Element>) {
  return <FullPage>{page}</FullPage>;
}
