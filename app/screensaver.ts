/*
https://github.com/samuelweckstrom/react-dvd-screensaver

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from "react"

function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    setWindowSize(getWindowSize)
  }, [])
  React.useLayoutEffect(() => {
    const onResize = () => {
      setWindowSize(getWindowSize)
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return windowSize
}

export interface UseDvdScreensaverParams {
  freezeOnHover?: boolean
  hoverCallback?: () => void
  speed?: number
}

interface AnimationRefProperties {
  animationFrameId: number
  impactCount: number
  isPosXIncrement: boolean
  isPosYIncrement: boolean
  containerHeight: number
  containerWidth: number
  positionX: number
  positionY: number
}

export interface UseDvdScreensaver {
  containerRef: React.RefObject<
    HTMLElement | HTMLDivElement | React.ReactElement
  >
  elementRef: React.RefObject<HTMLElement | HTMLDivElement | React.ReactElement>
  hovered: boolean
  impactCount: number
}

export function useDvdScreensaver(
  params: UseDvdScreensaverParams,
): UseDvdScreensaver {
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const animationRef = React.useRef<AnimationRefProperties>({
    animationFrameId: 0,
    impactCount: 0,
    isPosXIncrement: false,
    isPosYIncrement: false,
    containerHeight: 0,
    containerWidth: 0,
    positionX: Math.random() * (windowWidth - 0) + 0,
    positionY: Math.random() * (windowHeight - 0) + 0,
  })
  const elementRef = React.useRef<HTMLElement | HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLElement | HTMLDivElement>(null)
  const [impactCount, setImpactCount] = React.useState<number>(0)
  const [hovered, setHovered] = React.useState<boolean>(false)

  const animate = React.useCallback(() => {
    const delta = params.speed ?? 5
    const setPos = ({
      containerSpan,
      delta,
      elementSpan,
      prevPos,
      toggleRefKey,
    }: {
      containerSpan: number
      delta: number
      elementSpan: number
      prevPos: number
      toggleRefKey: "isPosXIncrement" | "isPosYIncrement"
    }) => {
      const parentBoundary = containerSpan - elementSpan
      const positionInRange = Math.min(Math.max(prevPos, 0), parentBoundary)
      if (positionInRange >= parentBoundary) {
        animationRef.current[toggleRefKey] = true
        animationRef.current.impactCount = animationRef.current.impactCount + 1
        setImpactCount(animationRef.current.impactCount)
      }
      if (positionInRange <= 0) {
        animationRef.current[toggleRefKey] = false
        animationRef.current.impactCount = animationRef.current.impactCount + 1
        setImpactCount(animationRef.current.impactCount)
      }
      return animationRef.current[toggleRefKey]
        ? positionInRange - delta
        : positionInRange + delta
    }

    if (elementRef.current?.parentElement) {
      const containerHeight = elementRef.current.parentElement.clientHeight
      const containerWidth = elementRef.current.parentElement.clientWidth
      const elementHeight = elementRef.current.clientHeight
      const elementWidth = elementRef.current.clientWidth

      const posX = setPos({
        containerSpan: containerWidth,
        delta,
        elementSpan: elementWidth,
        prevPos: animationRef.current.positionX,
        toggleRefKey: "isPosXIncrement",
      })

      const posY = setPos({
        containerSpan: containerHeight,
        delta,
        elementSpan: elementHeight,
        prevPos: animationRef.current.positionY,
        toggleRefKey: "isPosYIncrement",
      })

      elementRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`
      animationRef.current.positionX = posX
      animationRef.current.positionY = posY
    }
    const animationFrameId = requestAnimationFrame(animate)
    animationRef.current.animationFrameId = animationFrameId
  }, [params.speed])

  React.useEffect(() => {
    if (params.freezeOnHover) {
      if (hovered) {
        cancelAnimationFrame(animationRef.current.animationFrameId)
        animationRef.current.animationFrameId = 0
      }
      if (!hovered && !animationRef.current.animationFrameId) {
        animationRef.current.animationFrameId = requestAnimationFrame(animate)
      }
    }
    if (params.hoverCallback) {
      params.hoverCallback()
    }
  }, [animate, params, hovered])

  const handleMouseOver = () => {
    setHovered(true)
  }

  const handleMouseOut = () => {
    setHovered(false)
  }

  React.useLayoutEffect(() => {
    if (elementRef.current) {
      elementRef.current.style.willChange = "transform"
      elementRef.current.addEventListener("mouseover", handleMouseOver)
      elementRef.current.addEventListener("mouseout", handleMouseOut)
      animationRef.current.animationFrameId = requestAnimationFrame(animate)
    }

    const currentElementRef = elementRef.current
    const currentAnimationRef = animationRef.current
    return () => {
      currentElementRef?.removeEventListener("mouseover", handleMouseOut)
      currentElementRef?.removeEventListener("mouseout", handleMouseOver)
      cancelAnimationFrame(currentAnimationRef.animationFrameId)
    }
  }, [animate, animationRef, elementRef])

  return {
    containerRef,
    elementRef,
    hovered,
    impactCount,
  }
}
