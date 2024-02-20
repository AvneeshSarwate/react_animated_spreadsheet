"use client";

import { CSSProperties, useEffect } from "react";
import AnimatedSpreadSheet from "./animatedSpreadsheet";
import MonacoEditorWrapper from "./monacoEditor";
import P5Sketch from "./p5Component";
import { launchDrawLoop } from "./sheetAnimationState";

const style: CSSProperties = {
  marginLeft: "15px",
  marginTop: "15px",
}

export default function App() {
  useEffect(() => {
    launchDrawLoop()
  }, [])
  return <div style={style}>
    <AnimatedSpreadSheet />
    <P5Sketch />
    <MonacoEditorWrapper />
  </div>
}
