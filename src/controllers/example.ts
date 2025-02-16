// Responsible for receiving & returning data to the routes

import { NextFunction, Request, Response } from "express";
import { number, object, string, ZodError } from "zod";
import * as exampleService from '@/services/example'
import { InternalServerError, ValidationError } from "@/utils/errors";

// Define the schema for the query parameters
const sumQuerySchema = object({
    a: string().transform(Number),
    b: string().transform(Number),
})

const sumSchema = object({
    a: number(),
    b: number(),
})

const getRandom = (_req: Request, res: Response) => {
    const random = exampleService.getRandom();
    return res.status(200).json({random});
}

const sumQuery = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {a,b} = sumQuerySchema.parse(req.query);
        const result = exampleService.sum(a,b);
        return res.status(200).json({result});
    } catch(error) {
        if(error instanceof ZodError){
            return next(new ValidationError(error.issues))
        } else {
            return next(new InternalServerError())
        }
    }
};

const sum = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {a,b} = sumSchema.parse(req.body);
        const result = exampleService.sum(a,b);
        return res.status(200).json({result});
    } catch(error) {
        if(error instanceof ZodError){
            return next(new ValidationError(error.issues))
        } else {
            return next(new InternalServerError())
        }
    }
}


export {sumQuery, sum, getRandom}