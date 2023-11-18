import { Fun, Queue, Frame } from './types'

export const safely = (fun: Fun, ...args: unknown[]) => {
        try {
                return fun(...args)
        } catch (e) {
                console.warn(e)
                return false
        }
}

export const createQueue = (): Queue => {
        let next = new Set<Fun>()
        let current = next
        const self = ((fun: Fun) => {
                if (current.has(fun)) {
                        self.mount(fun)
                } else self.clean(fun)
        }) as unknown as Queue
        self.mount = (fun) => next.add(fun)
        self.clean = (fun) => next.delete(fun)
        self.flush = (...args) => {
                if (!current.size) return
                next = new Set()
                current.forEach((fun) => {
                        if (safely(fun, ...args)) next.add(fun)
                })
                current = next
        }
        return self
}

export const nativeNow = () =>
        typeof performance === 'undefined' ? Date.now : () => performance.now()

export const nativeRaf = () =>
        typeof window === 'undefined'
                ? (_fun: Fun) => 0
                : (fun: Fun) => requestAnimationFrame(fun)

export const createFrame = <T extends Fun = Fun>() => {
        /**
         * animation frame
         */
        const self = ((fun) => void (current(fun), self.start())) as Frame<T>

        let ts = -1
        let raf = (self.raf = nativeRaf())
        let now = (self.now = nativeNow())
        let flush = (self.flush = (...args) => current.flush(...args))

        self.mount = (fun: T) => current.mount(fun)
        self.clean = (fun: T) => current.clean(fun)
        self.start = () => void (ts < 0 && raf(loop))
        self.pause = () => void (ts > -1 && (ts = -2)) // -2 means paused
        self.reset = () => void ([prev, current] = [current, createQueue()])
        self.stop = () => void (self.reset(), self.pause())
        self.restart = () => void ((current = prev), self.start())

        let ms = -1
        let pt = -1
        let dt = -1
        let current = createQueue()
        let prev = current

        const loop = () => {
                pt = ms
                ms = now()
                dt = ~pt ? ms - pt : 0
                flush(++ts)
                if (ts > -1) raf(loop)
        }

        /**
         * for timeouts
         */
        const map = new Map()
        let id = 0

        self.setTimeout = (callback: Fun, delay: number) => {
                let time = now() + delay
                const fun: any = (...args: unknown[]) => {
                        if (ms < time - dt / 2) return true
                        if (callback(...args)) {
                                time = ms + delay
                                return true
                        } else map.get(id)?.()
                }

                // clean up
                const ret = ++id
                const clean = () => void (self(fun), map.delete(id))
                map.set(ret, clean)

                // start
                self(fun)

                return ret
        }

        self.clearTimeout = (id: number) => void map.get(id)?.()

        return self
}

export const frame = createFrame()

export default frame
