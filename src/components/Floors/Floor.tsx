import {FC, useEffect, useState} from "react";
import {Tooltip} from "@mui/material";
import { Room } from "@customTypes/room";

interface FloorProps {
  rooms: Room[];
  town: string;
  floor: number;
  width: number;
  height: number;
}

const Floor: FC<FloorProps> = ({ rooms, town,  floor, width, height }) => {
  const [xScale, setXScale] = useState(1.0);
  const [yScale, setYScale] = useState(1.0);
  useEffect(() => {
    const background = document.getElementById(`background_${floor}`);
    if (!background) return;
    background.style.display = ""
    setXScale((width / background.getBoundingClientRect().width).toFixed(2) as unknown as number);
    setYScale((height / background.getBoundingClientRect().height).toFixed(2) as unknown as number);
    background.style.display = "none"
  })
  return (
    <div style={{height: height, width: width}}>
      <svg style={{height: "100%", width: "100%"}} id={"svg"}>
        {rooms.map((room: Room) => {
          const key = room.intra_name.split('/').pop();
          if (room.floor !== floor) return null;
          return (
            <>
              <Tooltip title={room.display_name} arrow style={{backgroundColor: "white", color: "black"}}>
                <use href={`/towns/${town}/svg/${floor}/Z${floor}-Floor.svg#${key}`} className={["occupied", "reserved", "free"][room.status]} transform={`scale(${xScale}, ${yScale})`} key={key}/>
              </Tooltip>
            </>
          )})}
        <use href={`/towns/${town}/svg/${floor}/Z${floor}-Floor.svg#floor`} transform={`scale(${xScale}, ${yScale})`}/>
        <use href={`/towns/${town}/svg/${floor}/Z${floor}-Floor.svg#background`} id={`background_${floor}`} style={{display: "none"}}/>
      </svg>
    </div>
  );
};

export default Floor