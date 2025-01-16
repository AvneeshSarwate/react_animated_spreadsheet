"use client";

import { CSSProperties, memo, useState } from 'react';
import styles from './styles.module.css'
import { useSnapshot } from 'valtio';

import { stateProxy, setIsRunning, setSpreadsheetCell, numCells } from './sheetAnimationState'

const contaierStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
}

const range = (low: number, high: number) => {
  return Array.from({ length: high - low + 1 }, (_, i) => low + i);
}

function countMap<T>(num: number, fn: (i: number) => T): T[] {
  return range(0, num - 1).map(fn);
}

function rangeMap<T>(low: number, num: number, fn: (i: number) => T): T[] {
  return range(low, num - 1).map(fn);
}

type CellProps = { rowIndex: number, colIndex: number, cellClass: string, cellOnClick: (rowIndex: number, colIndex: number) => void, cellData: string }
function Cell({ rowIndex, colIndex, cellClass, cellOnClick, cellData }: CellProps) {
  // console.log("rerender cell", rowIndex, colIndex, cellData)
  return <>
    <div className={cellClass} onClick={() => cellOnClick(rowIndex, colIndex)}>
      {cellData}
    </div>
  </>
}
const cellPropsEqual = (prev: CellProps, next: CellProps) => {
  return prev.cellData === next.cellData && prev.cellClass === next.cellClass
}

const MemoCell = memo(Cell, cellPropsEqual)

export default function AnimatedSpreadSheet() {
  // console.log("top level rerender")

  const outputDisplayData = useSnapshot(stateProxy.outputDisplayData)
  const isRunning = useSnapshot(stateProxy.isRunning)
  const displayFormulaGrid = useSnapshot(stateProxy.displayFormulaGrid)

  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null)

  const [cellEditorText, setCellEditorText] = useState<string>(focusedCell ? displayFormulaGrid[focusedCell[0]][focusedCell[1]] : "")

  const setSelectedCellText = (text: string) => {
    if (focusedCell) {
      setCellEditorText(text)
      setSpreadsheetCell(focusedCell[0], focusedCell[1], text)
    }
  }

  const delayedCommitTextInput = (initialValue: string) => {
    const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key == "Enter") setSelectedCellText((e.target as HTMLInputElement).value)
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setSelectedCellText(e.target.value)
    }
    return <input id="formulaEditor" type="text" value={initialValue} onKeyDown={handleKeydown} onBlur={handleBlur} onChange={(e) => setCellEditorText(e.target.value)} />
  }

  const cellClass = (rowIndex: number, colIndex: number) => {
    const cellIsFocused = focusedCell && focusedCell[0] === rowIndex && focusedCell[1] === colIndex
    return `${styles.displayCell} ${cellIsFocused ? styles.focused : ''}`
  }

  const cellOnClick = (rowIndex: number, colIndex: number) => {
    const cellDisplay = displayFormulaGrid[rowIndex][colIndex]
    setCellEditorText(cellDisplay)
    setFocusedCell([rowIndex, colIndex])
  }

  const makeMemoCell = (rowIndex: number, colIndex: number) => {
    return <MemoCell key={colIndex} rowIndex={rowIndex} colIndex={colIndex} cellClass={cellClass(rowIndex, colIndex)} cellOnClick={cellOnClick} cellData={outputDisplayData.val[rowIndex][colIndex] + ""} />
  }

  const makeDataCellRow = (rowIndex: number) => {
    return <>
      <div className={styles.rowLabel}>{rowIndex + 1}</div>
      {countMap(numCells, (colIndex) => makeMemoCell(rowIndex, colIndex))}
    </>
  }
  const letters = "ABCDEFGHIJK"
  const makeTopLabelRow = () => {
    return <>
      <div className={styles.rowLabel}></div>
      {countMap(numCells, (colIndex) => <div key={colIndex} className={styles.colLabel}>{letters[colIndex]}</div>)}
    </>
  }

  return <div>
    <div className="grid" style={contaierStyle}>
      {rangeMap(-1, numCells, (rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {rowIndex == -1 ? makeTopLabelRow() : makeDataCellRow(rowIndex)}
        </div>
      ))}
    </div>
    <br />
    {delayedCommitTextInput(cellEditorText)}
    <label htmlFor="formulaEditor">formula editor</label>
    <br />
    <input type="checkbox" checked={isRunning.val} onChange={(e) => setIsRunning(e.target.checked)} />
    <label htmlFor="isRunning">Run animation</label>
  </div>
}