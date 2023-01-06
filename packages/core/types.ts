export default Frame

export interface Frame<T extends Fun = Fun> {
        (): void
        cancel(): void
        mount(fun: T): void
        clean(fun: T): void
}

export interface Queue {
        (...args: unknown[]): void
        mount(fun: Fun): void
        clean(fun: Fun): void
}

export type Fun<
        Args extends unknown[] = unknown[],
        Ret extends unknown = unknown
> = (...args: Args) => Ret
