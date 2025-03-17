import {ReactElement, useEffect, useState} from "react";
import FullPage from "@components/layout/FullPage";
import {useRouter} from "next/router";
import Head from "next/head";
import Floor from "@components/Floors/Floor";
import fetchApiData from "@scripts/fetchApiData";
import {
  Button,
  ButtonGroup,
  Dialog,
  Stack,
  Grid,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
  Fab,
  Typography
} from "@mui/material";
import RoomInformations from "@components/Rooms/RoomInformations";
import { GetServerSideProps } from 'next';
import * as path from "path";
import * as fs from "fs";
import updateRoomsStatus from "@scripts/updateRoomsStatus";
import {Town, TypeFloor} from "@customTypes/town";
import { QuestionMark } from '@mui/icons-material';
import {generateHelpContent} from "@scripts/dialogGenerator";

interface FloorRenderProps {
  townData: Town
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const townName = context.params?.town as string;
  const floorParam = parseInt(context.params?.floors as string);
  let floorFound = false;
  const townPath = path.join(process.cwd(), `./public/towns/${townName}/town.json`);
  let townData: Town;

  try {
    townData = JSON.parse(fs.readFileSync(townPath, 'utf8')) as Town;
  } catch (error) {
    console.error(`Unable to load town informations: ${error}`);
    return { notFound: true };
  }
  // Check if the current floor is in the floors of the config
  townData.floors.map((floor) => {
    if (floorParam === floor.floor)
      floorFound = true
  })
  townData.rooms.map((room) => room.activities = [])
  if (!floorFound)
    return {notFound: true}
  return {
    props: { townData },
  };
};

export default function FloorRender ({ townData }: FloorRenderProps) {
  const router = useRouter();
  const tvSettings = !!router.query.tv;
  const pedago = !!router.query.pedago;
  const [width, setWidth] = useState(750);
  const [currentFloor, setFloor] = useState(parseInt(router.query.floors as string) || 0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(<></>);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [time, setTime] = useState(new Date());
  const mobile = width < 750;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  townData.rooms.map((room) => [room.status, room.setStatus] = useState(2))
  if (pedago) {
    townData.rooms.map((room) => room.no_status = false)
  }
  useEffect(() => {
    setWidth(window.innerWidth);
    fetchApiData(townData, setLoading, setError);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    const updateStatus = setInterval(() => {
      setTime(new Date());
      townData.rooms.map((room) => {
        updateRoomsStatus(room);
      })
    }, 1000)
    const refreshData = setInterval(() => {
      fetchApiData(townData, setLoading, setError);
    }, error ? 30000 : 600000)
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(updateStatus);
      clearInterval(refreshData);
    };
  }, [townData, error]);

  if (loading && !tvSettings)
    return (<><Head><title>EpiRooms</title></Head><Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}><CircularProgress/></Box></>)
  return (
    <main style={{width: "100%", height: tvSettings ? "95%" : "100%"}} className={mobile ? "mobile" : ""}>
      <Head>
        <title>{townData.name != "" ? `EpiRooms - ${townData.name}` : 'EpiRooms'}</title>
      </Head>
      <Snackbar open={error} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
          Impossible de communiquer avec l&apos;intranet, les données affichées peuvent être obsolètes.
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={() => {setDialogOpen(false); setDialogContent(<></>)}}>
        {dialogContent}
      </Dialog>
      {mobile ? (
      <Stack direction={"column"} spacing={2}>
        <ButtonGroup orientation={"vertical"} variant={"contained"}>
          {townData.floors.map((floor) => {
            return (
              <Button key={`buttonFloor${floor.floor}`} disabled={floor.floor == currentFloor} onClick={(e) => {e.preventDefault(); setFloor(floor.floor); history.replaceState({}, '', `/${townData.code}/${floor.floor}`)}}>
                {floor.name}
              </Button>
            )
          })}
        </ButtonGroup>
        <Stack direction={"column"} spacing={2}>
          {townData.rooms.map((room) => {
            if (room.floor != currentFloor) return;
            if (room.no_status === true) return;
            return <RoomInformations room={room} key={`${room.intra_name}-info`} setDialogOpen={setDialogOpen} setDialogContent={setDialogContent}/>
          })}
        </Stack>
      </Stack>
      ) : (
      <Grid container spacing={2} sx={{width: "100%", height: "100%"}}>
        <Grid item xs={3}>
          {townData.floors.map((floor: TypeFloor) => {
            if (floor.floor == currentFloor) return;
            return (
              <div key={`sideFloor${floor.floor}`} style={{height: `${100 / (townData.floors.length - 1)}%`}} onClick={(e) => {e.preventDefault(); setFloor(floor.floor); history.replaceState({}, '', `/${townData.code}/${floor.floor}${tvSettings ? "?tv=true" : ""}${pedago ? "?pedago=true" : ""}`)}}>
                <Floor townData={townData} floor={floor.floor} setDialogOpen={setDialogOpen} setDialogContent={setDialogContent} sideDisplay={true}/>
              </div>
            )
          })}
        </Grid>
        <Grid item xs={9} sx={{height: "80%"}}>
          <Floor townData={townData} floor={currentFloor} setDialogOpen={setDialogOpen} setDialogContent={setDialogContent} sideDisplay={false}/>
        </Grid>
        <Grid item xs={11}>
          <Stack direction={"row"} spacing={2}>
            <ButtonGroup orientation={"vertical"} variant={"contained"}>
              {townData.floors.map((floor) => {
                return (
                  <Button key={`buttonFloor${floor.floor}`} disabled={floor.floor == currentFloor} onClick={(e) => {e.preventDefault(); setFloor(floor.floor); history.replaceState({}, '', `/${townData.code}/${floor.floor}${tvSettings ? "?tv=true" : ""}${pedago ? "?pedago=true" : ""}`)}}>
                    {floor.name}
                  </Button>
                )
              })}
            </ButtonGroup>
            <Stack direction={"row"} spacing={2} className={"scroll_container"}>
              {townData.rooms.map((room) => {
                if (room.floor != currentFloor) return;
                if (room.no_status === true) return;
                return <RoomInformations room={room} key={`${room.intra_name}-info`} setDialogOpen={setDialogOpen} setDialogContent={setDialogContent}/>
              })}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant={"h5"}>
            {time.toLocaleString("fr-FR", {hour: "numeric", minute: "numeric", second: "numeric"})}
          </Typography>
          <Typography sx={{marginBottom: 1, fontSize: tvSettings ? "15px": ""}}>
            {time.toLocaleString("fr-FR", {weekday: "long", day: "numeric", month: "long"})}
          </Typography>
          <Fab disabled color="primary" size={"medium"} onClick={() => {setDialogOpen(true); setDialogContent(generateHelpContent(townData));}}>
            <QuestionMark/>
          </Fab>
        </Grid>
      </Grid>
      )}
    </main>
  )
}

FloorRender.getLayout = function getLayout(page: ReactElement) {
  return <FullPage>{page}</FullPage>;
}
