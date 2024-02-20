import React, { useRef, useEffect } from 'react'
import p5 from 'p5'
import { stateProxy } from './sheetAnimationState'

const P5Sketch: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null)
  const sketchInstance = useRef<p5 | null>(null)
  console.log("p5 top level render")
  useEffect(() => {
  
    // Define the sketch
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(400, 400)
      }

      p.draw = () => {
        stateProxy.drawFunction(p, stateProxy.outputData)
      }
    }

    // Remove any existing canvas
    if (sketchInstance.current) {
      sketchInstance.current.remove()
    }

    // Create the p5 instance
    if (sketchRef.current) {
      sketchInstance.current = new p5(sketch, sketchRef.current)
    }

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
