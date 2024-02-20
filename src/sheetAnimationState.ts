"use client";

import { CellValue, HyperFormula } from 'hyperformula';
import { proxy } from 'valtio';
import type p5 from 'p5'
import { transform } from 'sucrase';
import * as acorn from 'acorn'
import { p5defs } from './p5Defs';

const numCells = 5

type CellChange = { rowIndex: number, colIndex: number, value: string }

function initialP5DrawFunction(p5sketch: p5, data: CellValue[][]) {
  p5sketch.clear()
  p5sketch.background(255, 200, 200)
  p5sketch.text("hello", p5sketch.sin(data[0][0] as number) * 100 + p5sketch.width / 2, 100)
}  

// initialze state and return only proxies so you don't accidentally use unlinked initialState
function initializeSpreadheetData() {

  const displayFormulaGrid: string[][] = Array.from({ length: numCells }).map(() => Array.from({ length: numCells }).map(() => '0'))

  const hfInstance = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
  const sheet = hfInstance.addSheet('sheet')
  const sheetId = hfInstance.getSheetId(sheet)!!
  hfInstance.setSheetContent(sheetId, displayFormulaGrid)

  const outputData = hfInstance.getSheetValues(sheetId)

  const initialDrawFuncString = `
//only make changes to the function body!
function initialP5DrawFunction(p5sketch: p5, data: (number|string|boolean|null)[][]) {
  p5sketch.background(255, 200, 200)
  p5sketch.text("hello", p5sketch.sin(data[0][0] as number) * 100 + p5sketch.width / 2, 100)
}  

  `

  const initialState = {
    outputData,
    outputDisplayData: { val: outputData },
    displayFormulaGrid,
    isRunning: { val: true },
    drawFunction: initialP5DrawFunction,
    drawFunctionString: initialDrawFuncString
  }

  const stateProxy = proxy(initialState)

  return { hfInstance, sheetId, stateProxy }
}

// eslint-disable-next-line no-inner-declarations
function nodeSlice(input: string, node: any): string {
  return input.substring(node.start, node.end)
}

function parseEditorString(editorVal: string) {

  if (editorVal) {
    const sucraseFunc = transform(editorVal, { transforms: ['typescript'] }).code
    const acParse = acorn.parse(sucraseFunc, { ecmaVersion: 2020, sourceType: 'module' })
    //@ts-ignore
    const bodyString = nodeSlice(sucraseFunc, acParse.body[0].body)

    const libAddedSrc = `
    ${bodyString}
    `

    const drawFunc = Function('p5sketch', 'data', libAddedSrc) as (typeof initialP5DrawFunction)

    stateProxy.drawFunction = drawFunc
  }
}

let sheetChanges: CellChange[] = []

const {stateProxy, hfInstance, sheetId} = initializeSpreadheetData()

const setIsRunning = (val: boolean) => {
  stateProxy.isRunning.val = val
}

function setSpreadsheetCell(rowIndex: number, colIndex: number, value: string) {
  stateProxy.displayFormulaGrid[rowIndex][colIndex] = value
  sheetChanges.push({ rowIndex, colIndex, value })
  console.log("setting cell", rowIndex, colIndex, value, sheetChanges)
}

function sheetUsesTime() {
  return stateProxy.displayFormulaGrid.flat().filter((cell) => cell.includes("$time")).length > 0
}

function updateDataSheet(time: number, sheetChanges: CellChange[], hfi: HyperFormula, proxyState: typeof stateProxy, updateDisplayVals: boolean) {
  const timeSec = time / 1000
  sheetChanges.forEach(({rowIndex, colIndex, value}) => {
    const newVal = value.replace("$time", timeSec + "")
    const changed = hfi.setCellContents({ row: rowIndex, col: colIndex, sheet: sheetId }, newVal)
  })

  //todo performance - can replace sheetUsesTime with a function that gets $time cells, 
  //and then pass those in here to not have to do naive loop
  for (let row = 0; row < numCells; row++) {
    for (let col = 0; col < numCells; col++) {
      const texExpr = proxyState.displayFormulaGrid[row][col]
      if (texExpr.includes("$time")) {
        const newVal = texExpr.replace("$time", timeSec + "")
        const changed = hfi.setCellContents({ row: row, col: col, sheet: sheetId }, newVal)
      }
    }
  }

  proxyState.outputData = hfi.getSheetValues(sheetId)
  if(updateDisplayVals) proxyState.outputDisplayData.val = processOutputDataForDisplay(proxyState.outputData)
}

function processOutputDataForDisplay(outputData: CellValue[][]) {
  return outputData.map((row) => {
    return row.map((cell) => typeof cell === "number" ? cell.toFixed(2) : cell)
  })
}

let frameCount = 0
function runDrawLoop(time: number) {
  if ((stateProxy.isRunning.val && sheetUsesTime()) || sheetChanges.length > 0) {
    const updateDisplayVals = frameCount%7 == 0 || sheetChanges.length > 0
    updateDataSheet(time, sheetChanges, hfInstance, stateProxy, updateDisplayVals)
    sheetChanges = [] //todo bug - why can i not just clear the collection here?
  }
  frameCount++
  if (typeof window !== 'undefined') requestAnimationFrame(runDrawLoop)
}

const launchDrawLoop = () => {
  setSpreadsheetCell(0, 0, "$time")
  setSpreadsheetCell(1, 1, "= $A1 / 10")
  runDrawLoop(0)
}

export { stateProxy, setIsRunning, setSpreadsheetCell, numCells, launchDrawLoop, parseEditorString }

