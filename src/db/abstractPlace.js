const pgp = require('pg-promise')(/* options */)
const db = pgp(process.env.DB_URL)
module.exports = class AbstractPlaceClass{
    static tableName = null;
    static async getImageFromReview(id){
        const params = {
            table:AbstractPlaceClass.#parseToImageFromReview(this.tableName),
            imageID:id
        }
        const image = (await db.oneOrNone(
            "SELECT ${table:name}.image\
            FROM ${table:name} \
            WHERE id = ${imageID} \
            LIMIT 1 \
            "
        ,params))
        if(image){
            return image.image
        }
        else{
            return null
        }
    }
    static async getAllPlaces(startPos,maxPos,sort,search,tags){
        const params = {
            table:this.tableName,
            imageTable:AbstractPlaceClass.#parseToImageFromPlace(this.tableName),
            tagTable:AbstractPlaceClass.#parseToTag(this.tableName),
            start:startPos,
            limit:maxPos,
            sort:sort,
            search:search,
            tags:tags,
        }
        const list = await db.one(
            "SELECT \
                JSON_AGG(DISTINCT x.*) as objects\
            FROM \
                (SELECT \
                    ${table:name}.*,\
                    ARRAY_AGG(DISTINCT ${imageTable:name}.id) AS images\
                FROM ${table:name}\
                LEFT JOIN ${imageTable:name}\
                ON ${table:name}.id = ${imageTable:name}.objectid\
                LEFT JOIN ${tagTable:name} \
                ON ${table:name}.id = ${tagTable:name}.objectid \
                WHERE \
                    ${table:name}.name LIKE '%${search:value}%'\
                    AND \
                        (COALESCE(${tags:list},'') = ''\
                        OR \
                        ${tagTable:name}.tag IN (${tags:list})) \
                GROUP BY ${table:name}.id\
                HAVING \
                    CASE \
                        WHEN (${tags:list}) IS NOT NULL THEN \
                            COUNT(DISTINCT ${tagTable:name}.tag) = ARRAY_LENGTH(ARRAY[${tags:list}],1)\
                        ELSE TRUE \
                    END \
                OFFSET ${start}\
                LIMIT ${limit}\
            ) AS x\
            "
        ,params)
        return list
    }
    static async getAllReviews(objectID,startPos,maxPos){
        const params = {
            objectID:objectID,
            start:startPos,
            limit:maxPos,
            table:AbstractPlaceClass.#parseToReviewTable(this.tableName),
            imageTable:AbstractPlaceClass.#parseToImageFromReview(this.tableName), 
        }
        //sending all binary images in single response too slow,so i will send only id`s
        const reviews = await db.any(
            "SELECT\
                ${table:name}.*,\
                ARRAY_AGG(${imageTable:name}.id) AS images \
            FROM ${table:name} \
            LEFT JOIN ${imageTable:name} \
            ON ${table:name}.id = ${imageTable:name}.reviewid \
            WHERE ${table:name}.objectid = ${objectID} \
            GROUP BY ${table:name}.id\
            OFFSET ${start}\
            LIMIT ${limit}\
            "
        ,params)
        return reviews
    }
    static async getInfo(objectID){
        const params = {
            objectID:objectID,
            table: this.tableName,
            imageTable:AbstractPlaceClass.#parseToImageFromPlace(this.tableName),
            tagTable:AbstractPlaceClass.#parseToTag(this.tableName),
            workingTime: AbstractPlaceClass.#parseToTime(this.tableName),
        }
        const info = await db.one(
            "SELECT \
                ${table:name}.*,\
                ARRAY_AGG(DISTINCT ${imageTable:name}.id) AS images, \
                JSON_AGG(DISTINCT ${workingTime:name}) AS workingHours, \
                ARRAY_AGG(DISTINCT ${tagTable:name}.tag) AS tags \
            FROM ${table:name} \
            LEFT JOIN ${imageTable:name} \
            ON ${table:name}.id = ${imageTable:name}.objectid \
            LEFT JOIN ${tagTable:name} \
            ON ${table:name}.id = ${tagTable:name}.objectid\
            LEFT JOIN ${workingTime:name} \
            ON ${table:name}.id = ${workingTime:name}.objectid\
            WHERE ${table:name}.id = ${objectID} \
            GROUP BY ${table:name}.id\
            "
        ,params)
        return info
    }
    static async exists(objectID){
        const params = {
            table:this.tableName,
            column:"id",
            value:objectID,
        }
        return (await db.one(
            "SELECT EXISTS(SELECT 1 FROM ${table:name}\
            WHERE ${column:name}=${value})"
        ,params)).exists
    }
    static async getAllTags(objectID){
        const params = {
            tagTable:AbstractPlaceClass.#parseToTag(this.tableName)
        }
        return (await db.one(
            "SELECT \
                ARRAY_AGG(DISTINCT ${tagTable:name}.tag) as tags\
            FROM ${tagTable:name}"
        ,params))
    }
    static async getImage(imageID){
        const params = {
            table:AbstractPlaceClass.#parseToImageFromPlace(this.tableName),
            imageID:imageID
        }
        const image = (await db.oneOrNone(
            "SELECT ${table:name}.image\
            FROM ${table:name} \
            WHERE id = ${imageID} \
            LIMIT 1 \
            "
        ,params))
        if(image){
            return image.image
        }
        else{
            return null
        }
    }
    static #parseToTime(tableName){
        const tablesMap = new Map([
            ["entertainment","businesshoursentertainment"],
            ["park","businesshourspark"],
            ["restaurant","businesshoursrestaurant"]
        ])
        return tablesMap.get(tableName)
    }
    static #parseToTag(tableName){
        const tablesMap = new Map([
            ["entertainment","tagentertainment"],
            ["park","tagpark"],
            ["restaurant","tagrestaurant"]
        ])
        return tablesMap.get(tableName)
    }
    static #parseToImageFromPlace(tableName){
        const tablesMap = new Map([
            ["restaurant","imagesrestaurant"],
            ["park","imagespark"],
            ["entertainment","imagesentertainment"]
        ])
        return tablesMap.get(tableName)
    }
    static #parseToReviewTable(tableName){
        const tablesMap = new Map([
            ["entertainment","reviewentertainment"],
            ["park","reviewpark"],
            ["restaurant","reviewrestaurant"]
        ])
        return tablesMap.get(tableName);
    }
    
    static #parseToImageFromReview(tableName){
        const tablesMap = new Map([
            ["restaurant","imagesrestaurantreview"],
            ["park","imagesparkreview"],
            ["entertainment","imagesentertainmentreview"]
        ])
        return tablesMap.get(tableName)
    }
    static #parseToImageReview(tableName){
        const tablesMap = new Map([
            ["entertainment","imagesentertainmentreview"],
            ["park","imagesparkreview"],
            ["restaurant","imagesrestaurantreview"]
        ])
        return tablesMap.get(tableName)
    }
}
