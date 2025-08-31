import {FC, ReactElement} from "react";
import { Room } from "@customTypes/room";
import {Card, CardContent, Tooltip, Typography} from "@mui/material";
import {formatTime, generateRoomContent} from "@scripts/dialogGenerator";

interface RoomInformationsProps {
  room: Room;
  setDialogOpen: (open: boolean) => void;
  setDialogContent: (content: ReactElement<Element>) => void;
}

const RoomInformations: FC<RoomInformationsProps> = ({room, setDialogOpen, setDialogContent}) => {
  return (
    <Card className={["occupied", "reserved", "free"][room.status]} sx={{ minWidth: 200, color: "black"}} onClick={() => {setDialogOpen(true);setDialogContent(generateRoomContent(room))}}>
      <CardContent sx={{textAlign: "center"}}>
        <Typography variant="h5" component="div" sx={{textAlign: "center"}}>
          {room.display_name}
        </Typography>
        {room.activities[0] != undefined ? (
          <>
            <Typography>
              {formatTime(room.activities[0].start.getTime())} - {formatTime(room.activities[0].end.getTime())}
            </Typography>
            <Tooltip title={room.activities[0].title} placement={"top"} arrow>
              <Typography sx={{ mb: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {room.activities[0].title}
              </Typography>
            </Tooltip>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default RoomInformations