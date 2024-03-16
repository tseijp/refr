import { frame } from '.'
import { useRef, useEffect } from 'react'
import { Fun, Queue, Frame } from './types'

export { Fun, Queue, Frame }

export const useCall = <F extends Function>(callback: F) => {
        const ref = useRef<Fun>((...args: unknown[]) =>
                ref.callback(...args)
        ).current
        ref.callback = callback
        return ref
}

export const useFrame = (callback: Fun, self = frame) => {
        const fun = useCall(callback)
        useEffect(() => {
                self(fun)
                return () => {
                        self(fun)
                }
        }, [self, fun])
        return self
}

export const useFrameRef = <El extends Element>(callback: Fun, self: Frame) => {
        const fun = useCall(callback)
        const ref = useCall((el: El) => {
                if (el) {
                        ref.current = el
                        self(fun)
                } else self(fun)
        })
        return ref
}
