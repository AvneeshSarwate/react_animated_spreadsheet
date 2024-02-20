import React, { useRef, useEffect } from 'react'
import type p5 from 'p5'
import { useSnapshot } from 'valtio'
import { stateProxy } from './sheetAnimationState'
// Define the types for the p5 instance
type P5Instance = {
  remove: () => void
}

// Define the types for the p5 module
type P5Module = {
  default: {
    new (sketch: (p: any) => void, node?: Element | null): P5Instance
  }
}

const P5Sketch: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null)
  const sketchInstance = useRef<P5Instance | null>(null)
  console.log("p5 top level render")
  useEffect(() => {
    console.log("p5 effect")
    let p5mod: P5Module['default']

    // Dynamically import the p5 module
    import('p5')
      .then((p5Module: any) => {
        p5mod = p5Module.default

        // Define the sketch
        const sketch = (p: p5) => {
          p.setup = () => {
            p.createCanvas(400, 400)
          }

          p.draw = () => {
            // p.background(220)
            // p.ellipse(p.width / 2, p.height / 2, Math.sin(p.frameCount * 0.01) * 100, 50)
            stateProxy.drawFunction(p, stateProxy.outputData)
          }
        }

        // Remove any existing canvas
        if (sketchInstance.current) {
          sketchInstance.current.remove()
        }

        // Create the p5 instance
        if (sketchRef.current) {
          sketchInstance.current = new p5mod(sketch, sketchRef.current)
        }
      })
      .catch((error) => {
        console.error('Failed to load p5 module:', error)
      })

    // Clean up
    return () => {
      if (sketchInstance.current) {
        sketchInstance.current.remove()
      }
    }
  }, [])

  return <div ref={sketchRef}></div>
}

export default P5Sketch
