"use client";

import { CSSProperties, useEffect } from "react";
import AnimatedSpreadSheet from "./animatedSpreadsheet";
import MonacoEditorWrapper from "./monacoEditor";
import P5Sketch from "./p5Component";
import { launchDrawLoop } from "./sheetAnimationState";

const containerStyle: CSSProperties = {
  marginLeft: "15px",
  marginTop: "15px",
}

const topRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}

const descriptionStyle: CSSProperties = {
  width: "600px",
  height: "200px",
  overflow: "scroll",
  marginLeft: "15px",
  marginTop: "5px",
  marginBottom: "5px",
  fontSize: "14px",
}

const descriptionText = [
  "This is a simple spreadsheet that can be used to create animations.",
  "Click on a cell to show the formula in the formula editor.",
  "Formulas are compatible with Excel and Google Sheets (see https://hyperformula.handsontable.com/)",
  "To reference time, the string \"$time\" can be used in formulas (but be careful, it's naively string replaced with a number in the forumala string)."
]

export default function App() {
  useEffect(() => {
    launchDrawLoop()
  }, [])
  return <div style={containerStyle}>
    <div style={topRowStyle}>
      <AnimatedSpreadSheet />
      <div style={descriptionStyle}>
        <div><b>Instructions</b></div>
        <ul>
        {descriptionText.map((text, i) => <li key={i}>{text}</li>)}
        </ul>
      </div>
    </div>
    <P5Sketch />
    <MonacoEditorWrapper />
  </div>
}
