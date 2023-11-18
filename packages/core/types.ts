export type Fun<
        Args extends unknown[] = unknown[],
        Ret extends unknown = unknown
> = (...args: Args) => Ret

export interface Queue<T extends Fun = Fun> {
        (fun: T): void
        mount(fun: T): void
        clean(fun: T): void
        flush(...args: unknown[]): void
}

export interface Frame<T extends Fun = Fun> extends Queue<T> {
        raf(fun: Fun): number
        now(): number
        start(): void
        pause(): void
        reset(): void
        stop(): void
        restart(): void
        setTimeout(fun: T, ms: number): number
        clearTimeout(id: number): void
}

export default Frame
