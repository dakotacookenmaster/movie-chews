import { RatingDto } from "../dto/rating.dto"

export class Rating {
    Source: string
    Value: string

    constructor(ratingDto: RatingDto) {
        Object.assign(this, ratingDto)
    }
}