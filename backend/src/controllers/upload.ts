import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import sharp from 'sharp'
import fs from 'fs'


export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        
        if (req.file.size < 2 * 1024) {
            return next(new BadRequestError('Файл слишком маленький, минимум 2kb'))
        }

        try {
            await sharp(req.file.path).metadata();
        } catch {
            fs.unlinkSync(req.file.path)
            return next(new BadRequestError('Файл не является валидным изображением'))
        }

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
