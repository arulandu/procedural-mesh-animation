export function lerp(x, y, a) {
    return (1 - a) * x + a * y
}

export function clamp(x, min, max) {
   return Math.min(Math.max(x, min), max)
}

export function randomRange(lb, ub, rng){
    if(ub < lb){
        throw Error("upper bound has to be greater than lower bound")
    }

    return rng()*(ub-lb)+lb
}

export function randomSin(seed = Math.PI / 4) { // ~3.4 million b4 repeat.
    // https://stackoverflow.com/a/19303725/1791917
    return () => {
        const x = Math.sin(seed++) * 10000
        return x - Math.floor(x)
    }
}
