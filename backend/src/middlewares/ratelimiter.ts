import { RateLimiterMemory } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'

const rateLimiter = new RateLimiterMemory({
    points: Number(process.env.RATE_LIMIT_POINTS) || 20,     // кол-во запросов
    duration: Number(process.env.RATE_LIMIT_DURATION) || 1,  // за сколько секунд
    blockDuration: Number(process.env.RATE_LIMIT_BLOCK) || 15, // блокировка на сколько секунд
})

const excludedPaths = ['/auth/csrf-token', '/auth/login', '/auth/register']

const limiter = async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.RATE_LIMITED !== 'true') {
        return next()
    }

    if (excludedPaths.includes(req.path)) {
        return next()
    }

    try {
        await rateLimiter.consume(req.ip || 'unknown')
        return next()
    } catch {
        return res.status(429).json({ message: 'Too Many Requests' })
    }
}

export default limiter
