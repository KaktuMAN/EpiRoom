import React from "react";

export default function DefaultLayout(props: {children: React.ReactNode}) {
  return (
    <div style={{margin: "6px"}}>
      {props.children}
    </div>
  );
}