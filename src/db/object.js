const pgp = require('pg-promise')(/* options */)
//const db = pgp(process.env.DB_URL)
const db = pgp({
    "host": "localhost",
    "port": 5432,
    "database": "CGK",
    "user": "Anna",
    "password": "0000"
})
module.exports = class Object{
    static async imageExists(objectID){
        const params = {
            value:objectID,
        }
        return (await db.one(
            "SELECT EXISTS(SELECT 1 FROM images\
            WHERE id=${value})"
        ,params)).exists
    }
    static async getAllObjects(startPos,maxPos,sort,search,tags){
        const params = {
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
                    object.*,\
                    ARRAY_AGG(DISTINCT tag.name) AS tags,\
                    ARRAY_AGG(DISTINCT images.id) AS images\
                FROM object\
                LEFT JOIN images\
                ON object.id = images.objectid\
                LEFT JOIN objecttag \
                ON object.id = objecttag.objectid\
                LEFT JOIN tag \
                ON tag.id = objecttag.tagid \
                WHERE \
                    object.name LIKE '%${search:value}%'\
                    AND \
                        (COALESCE(${tags:list},'') = ''\
                        OR \
                        tag.name IN (${tags:list})) \
                GROUP BY object.id\
                HAVING \
                    CASE \
                        WHEN (${tags:list}) IS NOT NULL THEN \
                            COUNT(DISTINCT tag.name) = ARRAY_LENGTH(ARRAY[${tags:list}],1)\
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
        }
        //sending all binary images in single response too slow,so i will send only id`s
        const reviews = await db.any(
            "SELECT\
                review.*,\
                ARRAY_AGG(images.id) AS images \
            FROM review \
            LEFT JOIN images \
            ON review.id = images.reviewid \
            WHERE review.object = ${objectID} \
            GROUP BY review.id\
            OFFSET ${start}\
            LIMIT ${limit}\
            "
        ,params)
        return reviews
    }
    static async getInfo(objectID){
        const params = {
            objectID:objectID,
        }
        const info = await db.one(
            "SELECT \
                object.*,\
                ARRAY_AGG(DISTINCT images.id) AS images, \
                JSON_AGG(DISTINCT businesshours) AS workingHours, \
                ARRAY_AGG(DISTINCT tag.name) AS tagsName, \
                ARRAY_AGG(DISTINCT objectattribute.attributename) AS attributes \
            FROM object \
            LEFT JOIN images \
            ON object.id = images.objectid \
                AND images.reviewID is null \
            LEFT JOIN objecttag \
            ON object.id = objecttag.objectid\
            LEFT JOIN tag \
            ON objecttag.tagid = tag.id \
            LEFT JOIN businesshours \
            ON object.id = businesshours.objectid\
            LEFT JOIN objectattribute \
            ON object.id = objectattribute.objectid \
            WHERE object.id = ${objectID} \
            GROUP BY object.id\
            "
        ,params)
        return info
    }
    static async exists(objectID){
        const params = {
            value:objectID,
        }
        return (await db.one(
            "SELECT EXISTS(SELECT 1 FROM object\
            WHERE id=${value})"
        ,params)).exists
    }
    static async getAllTags(){
        return (await db.one(
            "SELECT \
                ARRAY_AGG(DISTINCT tag.name) as tags\
            FROM tag"
        ))
    }
    static async getAllTagsByType(type){
        const params = {
            type:type,
        }
        return (await db.one(
            "SELECT \
                ARRAY_AGG(DISTINCT tag.name) as tags\
            FROM tag \
            WHERE tagtype = ${type}"
        ,params))
    }
    static async getImage(imageID){
        const params = {
            imageID:imageID
        }
        const image = (await db.oneOrNone(
            "SELECT images.image\
            FROM images \
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
}