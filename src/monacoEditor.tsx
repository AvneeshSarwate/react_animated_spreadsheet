"use client";

import React, { CSSProperties, useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { p5defs } from './p5Defs'
import { parseEditorString, stateProxy } from './sheetAnimationState';

const buttonStyle: CSSProperties = {
  'border': 'black 1px solid',
  'marginBottom': '5px',
}

const MonacoEditorWrapper: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    self.MonacoEnvironment = {
      getWorker: function (_, label) {
        if (label === 'typescript' || label === 'javascript') {
          return new Worker(new URL('../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url))
        }
        return new Worker(new URL('../node_modules/monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
      },
    }

    if (editorContainerRef.current) {
      editorRef.current = monaco.editor.create(editorContainerRef.current, {
        language: 'typescript',
        theme: 'vs-dark',
        value: stateProxy.drawFunctionString,
      })

      // Additional configuration
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      })

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true,
      })

      // Add extra libraries if necessary
      const p5uri = "ts:filename/p5.d.ts"
      monaco.languages.typescript.typescriptDefaults.addExtraLib(p5defs, p5uri)
    }

    return () => {
      editorRef.current?.dispose()
    }
  }, [])

  return <>
    <button style={buttonStyle} onClick={() => parseEditorString(editorRef.current?.getValue() || "")}>Update Draw Function</button>
    <div ref={editorContainerRef} style={{ height: '400px', width: '800px' }} />
  </>
}

export default MonacoEditorWrapper
