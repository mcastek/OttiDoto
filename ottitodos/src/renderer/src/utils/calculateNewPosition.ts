export function calculateNewPosition(prev?: number, next?: number) {
    const step = 10000

    if (prev === undefined && next === undefined) return step

    if (prev === undefined) return next! - step

    if (next === undefined) return prev! + step

    return (prev + next) / 2
}
