import {FC, ReactElement, useEffect, useState} from "react";
import { Room } from "@customTypes/room";
import {Town} from "@customTypes/town";
import {generateRoomContent} from "@scripts/dialogGenerator";

interface FloorProps {
  townData: Town;
  floor: number;
  setDialogOpen: (open: boolean) => void;
  setDialogContent: (content: ReactElement) => void;
  sideDisplay: boolean;
}

const Floor: FC<FloorProps> = ({ townData,  floor, setDialogOpen, setDialogContent, sideDisplay}) => {
  const [scale, setScale] = useState([1, 1]);
  useEffect(() => {
    const updateScale = () => {
      const background = document.getElementById(`background_${floor}`);
      const svg = document.getElementById(`floorRender${floor}`);
      if (!svg || !background) return;
      const {width: svgWidth, height: svgHeight} = svg.getBoundingClientRect();
      background.style.display = "block";
      const {width, height} = background.getBoundingClientRect();
      background.style.display = "none";
      if (isNaN(width) || isNaN(height) || isNaN(svgWidth) || isNaN(svgHeight)) updateScale();
      setScale([svgWidth / width, svgHeight / height])
    }
    setTimeout(updateScale, 50)
    window.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [floor]);
  return (
    <>
      <svg id={`floorRender${floor}`}>
        {townData.rooms.map((room: Room) => {
          if (room.floor !== floor) return null;
          return (
            <g id={`${room.intra_name.split('/').pop()}-svg`} key={`${room.intra_name.split('/').pop()}-svg`} onClick={() => {if (room.no_status !== true && !sideDisplay) {setDialogOpen(true);setDialogContent(generateRoomContent(room))}}}>
              <use href={`/towns/${townData.code}/svg/Z${floor}-Floor.svg#${room.intra_name.split('/').pop()}`} className={`${["occupied", "reserved", "free"][room.status]} ${room.no_status === true ? "nostatus" : ""}`} key={`${room.intra_name}-svg-box`} transform={`scale(${scale[0]}, ${scale[1]})`}/>
              <use href={`/towns/${townData.code}/svg/Z${floor}-Floor.svg#${room.intra_name.split('/').pop()}-Text`} className={room.no_status === true ? "nostatus_text" : ""} key={`${room.intra_name}-svg-text`} transform={`scale(${scale[0]}, ${scale[1]})`}/>
            </g>
          )
        })}
        <use href={`/towns/${townData.code}/svg/Z${floor}-Floor.svg#floor`}
             transform={`scale(${scale[0]}, ${scale[1]})`}/>
        <use href={`/towns/${townData.code}/svg/Z${floor}-Floor.svg#background`} id={`background_${floor}`}
             style={{display: "none"}}/>
      </svg>
    </>
  );
};

export default Floor