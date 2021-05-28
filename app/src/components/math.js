export function lerp(x, y, a) {
    return (1 - a) * x + a * y
}

export function clamp(x, min, max) {
   return Math.min(Math.max(x, min), max)
}
