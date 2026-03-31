import { RateLimiterMemory } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'

const rateLimiter = new RateLimiterMemory({
    points: Number(process.env.RATE_LIMIT_POINTS) || 3,     
    duration: Number(process.env.RATE_LIMIT_DURATION) || 5,  
    blockDuration: Number(process.env.RATE_LIMIT_BLOCK) || 15,
})

const limiter = async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.RATE_LIMITED !== 'true') {
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
