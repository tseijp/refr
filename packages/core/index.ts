import type { Fun, Queue, Frame } from '@refr/types'

export default frame

export function frame(ts = -1, id = -1): Frame {
        let current = queue()
        /**
         * request and cancel animation frame
         */
        const request = (fun = () => {}) => void (id = requestAnimationFrame(fun))
        const cancel = () => void ((ts = -1), id > 0 && cancelAnimationFrame(id))
        /**
         * loop animation frame
         */
        const loop = () => ts > -1 && void (request(loop), current(ts))
        const self = (() => ts < 0 && void (request(loop), ts++)) as Frame
        /**
         * mount and clean queue
         */
        self.mount = (fun) => void current.mount(fun)
        self.clean = (fun) => void current.clean(fun)
        self.cancel = () => void ((current = queue()), cancel())
        return self
}

export function queue(): Queue {
        let next = new Set<Fun>()
        let current = next
        /**
         * flush queue
         */
        const self = ((...args) => {
                if (!current.size) return
                next = new Set()
                current.forEach((fun) =>
                        safely(fun, ...args) && next.add(fun)
                )
                current = next
        }) as Queue
        /**
         * mount and clean queue
         */
        self.mount = (fun) => void next.add(fun)
        self.clean = (fun) => void next.delete(fun)
        return self
}

export function safely(fun: Fun, ...args: unknown[]) {
        try {
                return fun(...args)
        } catch (e) {
                console.warn(e)
                return false
        }
}