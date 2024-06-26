const pgp = require('pg-promise')(/* options */)
const db = (() => {
    const os = process.platform;
    if (os === "win32"){
        return pgp({
            "host": "localhost",
            "port": 5432,
            "database": "CGK",
            "user": "Anna",
            "password": "0000"
        });
    } else {
        return pgp(process.env.DB_URL)
    }
})();
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
    static async getAllObjects(startPos,maxPos,sort,search,tags,categoryName,optionalTags){
        const params = {
            start:startPos,
            limit:maxPos,
            sort:sort,
            search:search,
            tags:tags,
            optionalTags:optionalTags,
            categoryName:categoryName,
        }
        let optionalQuery = "";
        if (optionalTags){
            let i = 0;
            optionalTags.forEach(array => {
                const check = ` ARRAY_AGG(DISTINCT tag.name) && ARRAY[\${optionalTags${i}:list}] \n`;
                params[`optionalTags${i}`] = array;
                i+=1;
                if(optionalQuery != ""){
                    optionalQuery += " AND ";
                }
                optionalQuery += check;
            });
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
                LEFT JOIN objectcategory \
                ON object.category = objectcategory.id \
                LEFT JOIN tag \
                ON tag.id = objecttag.tagid \
                WHERE \
                    LOWER(object.name) LIKE LOWER('%${search:value}%')\
                    AND \
                        (${categoryName} IS NOT NULL\
                        AND \
                        objectcategory.name = ${categoryName} \
                        OR \
                        ${categoryName} IS NULL\
                        AND \
                        TRUE) \
                GROUP BY object.id\
                HAVING \
                    CASE \
                        WHEN (${tags:list}) IS NOT NULL AND (${optionalTags:list}) IS NOT NULL THEN \
                            ARRAY_AGG(DISTINCT tag.name) @> (ARRAY[${tags:list}])" +
                            (optionalQuery!=""?" AND ":" ") + 
                                (optionalQuery!=""?optionalQuery:" ") +
                        "WHEN (${tags:list}) IS NOT NULL THEN \
                            ARRAY_AGG(DISTINCT tag.name) @> (ARRAY[${tags:list}]) " +
                        (optionalQuery!=""?"WHEN (${optionalTags:list}) IS NOT NULL THEN ":" ") +
                            (optionalQuery!=""?optionalQuery:" ") +
                    "ELSE TRUE \
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
                review.*\
            FROM review \
            WHERE review.object = ${objectID} \
            GROUP BY review.id\
            OFFSET ${start}\
            LIMIT ${limit}\
            "
        ,params)
        return reviews
    }
    static async getObjectAttributes(objectID){
        const params = {
            objectID:objectID,
        }
        return (await db.one(
            "SELECT \
            COALESCE(json_object_agg(objectattribute.attributename,objectattribute.attributevalue) FILTER (WHERE objectattribute.attributename IS NOT NULL), '{}'::JSON) as attributes\
            FROM objectattribute \
            WHERE objectid = ${objectID}"
        ,params))
    }
    static async getInfo(objectID){
        const params = {
            objectID:objectID,
        }
        const info = await db.one(
            "SELECT \
                object.*,\
                JSON_AGG(DISTINCT objectcategory.name) AS categoryName,\
                ARRAY_AGG(DISTINCT images.id) AS images, \
                JSON_AGG(DISTINCT businesshours) AS workingHours, \
                COALESCE(json_object_agg(objectattribute.attributename,objectattribute.attributevalue) FILTER (WHERE objectattribute.attributename IS NOT NULL), '{}'::JSON) as attributes,\
                ARRAY_AGG(DISTINCT tag.name) AS tagsName \
            FROM object \
            LEFT JOIN images \
            ON object.id = images.objectid \
            LEFT JOIN objecttag \
            ON object.id = objecttag.objectid\
            LEFT JOIN tag \
            ON objecttag.tagid = tag.id \
            LEFT JOIN businesshours \
            ON object.id = businesshours.objectid\
            LEFT JOIN objectattribute \
            ON object.id = objectattribute.objectid \
            LEFT JOIN objectcategory \
            ON object.category = objectcategory.id \
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
            "SELECT images.id\
            FROM images \
            WHERE id = ${imageID} \
            LIMIT 1 \
            "
        ,params))
        if(image){
            return image.id
        }
        else{
            return null
        }
    }
}
