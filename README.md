# Archive

This project has been archived and replaced by a closed-source alternative.

## EpiRoom

This project is a web application that allows users to see the room availability at Epitech

Currently, this project only works with the campus of Lille.

### Setup

To run this project, you will need to have **Node.js 18.x** installed on your machine.

```bash
npm install
```

### Run
In development mode (Set the environment variable `NODE_ENV` to `development` to prevent the PWA generation).
```bash
npm run dev
```

In production mode

```bash
npm run build
npm run start
```

### Features

- [x] Room availability
- [x] Activity details
- [x] Campus modularity
- [x] Campus selection

### How to add a new campus

To add a new campus you will need to create a new folder inside public/towns with the name of the campus. Then you will need to create a new file called `town.json` with the following structure:

```json
{
  "name": "Lille",
  "code": "LIL",
  "mainFloor": 0,
  "floors": [
    {
      "floor": 0,
      "name": "Ground floor"
    }
  ],
  "rooms":[
    {
      "intra_name":"FR/LIL/Hopital-Militaire/B-01-Bulma",
      "name":"B.01 - Bulma",
      "display_name":"Bulma",
      "seats": 3,
      "floor": 0
    }
  ]
}
```

And for each floor create the corresponding SVG, stored in the `public/towns/<campus_name>/svg/Z<floor>-Floor.svg` file.

```svg
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1137 627" height="100%" width="100%">
  <defs>
    <pattern patternUnits="userSpaceOnUse" width="11.5" height="11.5" x="0" y="0" patternTransform="rotate(45)" id="mx-pattern-hatch-1-636263-0">
      <line x1="0" y1="0" x2="0" y2="11.5" stroke="#636263" stroke-width="1.5"/>
    </pattern>
  </defs>
  <g>
    <g id="background">
      <!-- Background Shapes (A transparent rectangle of the size of the SVG) -->
      <rect x="0" y="0" width="1137px" height="627px" fill-opacity="0"/>
    </g>
    <g id="rooms">
      <!-- Room Shapes (Only the background of the room)-->
      <g id="B-01-Bulma">
        <rect x="218.46" y="3.49" width="188.54" height="103.51"/>
      </g>
    </g>
    <g id="floor">
      <!-- Floor Shapes (Walls and Decorations) -->
    </g>
  </g>
</svg>
```

And then you just need an image for the town, stored in the `public/towns/<campus_name>/image.png` file.

