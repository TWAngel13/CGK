const pgp = require('pg-promise')(/* options */)
const db = pgp(process.env.DB_URL)

module.exports = {
    addUser,
    getRestaurantsReviews,
    getEntertainmentReviews,
    getParkReviews,
    getReviewsForRestaurant,
    getReviewsForPark,
    getReviewsForEntertainment,
    getInfoFoRestaurant,
    getInfoForEntertainment,
    getInfoForPark,
    getAllTagsEntertainment,
    getAllTagsPark,
    getAllTagsRestaurant,
    getAllEntertainments,
    getAllParks,
    getAllRestaurants,
    userExists,
    listUsers,
    restaurantExists,
    parkExists,
    entertainmentExists,
    getImagePlaceEntertainment,
    getImagePlacePark,
    getImagePlaceRestaurant,
    getImageReviewEntertainment,
    getImageReviewPark,
    getImageReviewRestaurant,
}
const places = {
    park: "park",
    restaurant : "restaurant",
    entertainment : "entertainment",
}
async function addUser(name,email){
    if(await _exists("users","email",email)){
        return -1
    }
    else{
        const params = {
            name:name,
            email:email
        }
        await db.none(
            "INSERT INTO users (name,email) \
            VALUES (${name},${email}) \
            ON CONFLICT DO NOTHING"
            ,params)
        return 1
    }
}
async function getRestaurantsReviews(userID,startPos,maxPos){
    return _getReviews(userID,startPos,maxPos,places.restaurant)
}
async function getEntertainmentReviews(userID,startPos,maxPos){
    return _getReviews(userID,startPos,maxPos,places.entertainment)
}
async function getParkReviews(userID,startPos,maxPos){
    return _getReviews(userID,startPos,maxPos,places.park)
}
async function getReviewsForRestaurant(objectID,startPos,maxPos){
    return _getReviewsForPlace(objectID,startPos,maxPos,places.restaurant)
}
async function getReviewsForEntertainment(objectID,startPos,maxPos){
    return _getReviewsForPlace(objectID,startPos,maxPos,places.entertainment)
}
async function getReviewsForPark(objectID,startPos,maxPos){
    return _getReviewsForPlace(objectID,startPos,maxPos,places.park)
}
async function getInfoForPark(objectID){
    return _getInfoForPlace(objectID,places.park)
}
async function getInfoFoRestaurant(objectID){
    return _getInfoForPlace(objectID,places.restaurant)
}
async function getInfoForEntertainment(objectID){
    return _getInfoForPlace(objectID,places.entertainment)
}
async function userExists(userID){
    return _exists("users","id",userID)
}
async function parkExists(objectID){
    return _exists(places.park,"id",objectID)
}
async function entertainmentExists(objectID){
    return _exists(places.entertainment,"id",objectID)
}
async function restaurantExists(objectID){
    return _exists(places.restaurant,"id",objectID)
}
async function getAllTagsRestaurant(){
    return _getAllTags(places.restaurant)
}
async function getAllTagsPark(){
    return _getAllTags(places.park)
}
async function getAllTagsEntertainment(){
    return _getAllTags(places.entertainment)   
}
async function getAllRestaurants(startPos,maxPos,sort,search,tags){
    return _getAllPlaces(places.restaurant,startPos,maxPos,sort,search,tags)
}
async function getAllParks(startPos,maxPos,sort,search,tags){
    return _getAllPlaces(places.park,startPos,maxPos,sort,search,tags)
}
async function getAllEntertainments(startPos,maxPos,sort,search,tags){
    return _getAllPlaces(places.entertainment,startPos,maxPos,sort,search,tags)
}
async function getImagePlaceRestaurant(id){
    return _getImagePlace(id,places.restaurant)   
}
async function getImagePlacePark(id){
    return _getImagePlace(id,places.park)   
}
async function getImagePlaceEntertainment(id){
    return _getImagePlace(id,places.entertainment)   
}
async function getImageReviewRestaurant(id){
    return _getImageReview(id,places.restaurant)   
}
async function getImageReviewPark(id){
    return _getImageReview(id,places.park)   
}
async function getImageReviewEntertainment(id){
    return _getImageReview(id,places.entertainment)   
}
async function listUsers(startPos,maxPos){
    const params = {
        start:startPos,
        limit:maxPos
    }
    return (await db.oneOrNone(
        "SELECT \
            JSON_AGG(DISTINCT x.*) as users\
        FROM (\
            SELECT * FROM users\
            OFFSET ${start} \
            LIMIT ${limit} \
        ) AS x\
        "
    ,params))
}
async function _getImagePlace(id,tableName){
    const params = {
        table:_parseToImageFromPlace(tableName),
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
async function _getImageReview(id,tableName){
    const params = {
        table:_parseToImageFromReview(tableName),
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
async function _exists(table,column,value){
    const params = {
        table:table,
        column:column,
        value:value
    }
    return (await db.one(
        "SELECT EXISTS(SELECT 1 FROM ${table:name}\
        WHERE ${column:name}=${value})"
    ,params)).exists
}
async function _getReviews(userID,startPos,maxPos,tableName){
    const params = {
        userID:userID,
        start:startPos,
        limit:maxPos,
        table:_parseToReviewTable(tableName),
        imageTable:_parseToImageFromReview(tableName),
    }
    return (await db.any(
        "SELECT\
            ${table:name}.*,\
            ARRAY_AGG(${imageTable:name}.id) AS images \
        FROM ${table:name} \
        LEFT JOIN ${imageTable:name} \
        ON ${table:name}.id = ${imageTable:name}.reviewid \
        WHERE ${table:name}.userid = ${userID} \
        GROUP BY ${table:name}.id\
        "
    ,params))
}
async function _getReviewsForPlace(objectID,startPos,maxPos,tableName){
    const params = {
        objectID:objectID,
        start:startPos,
        limit:maxPos,
        table:_parseToReviewTable(tableName),
        imageTable:_parseToImageFromReview(tableName), 
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
async function _getInfoForPlace(objectID,tableName){
    const params = {
        objectID:objectID,
        table:tableName,
        imageTable:_parseToImageFromPlace(tableName),
        tagTable:_parseToTag(tableName),
        workingTime: _parseToTime(tableName),
    }
    //same thing
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
async function _getAllPlaces(tableName,startPos,maxPos,sort,search,tags){
    const params = {
        table:tableName,
        imageTable:_parseToImageFromPlace(tableName),
        tagTable:_parseToTag(tableName),
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
                    WHEN ${tags:list} IS NOT NULL THEN \
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
async function _getAllTags(tableName){
    const params = {
        tagTable:_parseToTag(tableName)
    }
    return (await db.one(
        "SELECT \
            ARRAY_AGG(DISTINCT ${tagTable:name}.tag) as tags\
        FROM ${tagTable:name}"
    ,params))
}
function _parseToImageFromPlace(tableName){
    const tablesMap = new Map([
        ["restaurant","imagesrestaurant"],
        ["park","imagespark"],
        ["entertainment","imagesentertainment"]
    ])
    return tablesMap.get(tableName)
}
function _parseToImageFromReview(tableName){
    const tablesMap = new Map([
        ["restaurant","imagesrestaurantreview"],
        ["park","imagesparkreview"],
        ["entertainment","imagesentertainmentreview"]
    ])
    return tablesMap.get(tableName)
}
function _parseToTime(tableName){
    const tablesMap = new Map([
        ["entertainment","businesshoursentertainment"],
        ["park","businesshourspark"],
        ["restaurant","businesshoursrestaurant"]
    ])
    return tablesMap.get(tableName)
}
function _parseToTag(tableName){
    const tablesMap = new Map([
        ["entertainment","tagentertainment"],
        ["park","tagpark"],
        ["restaurant","tagrestaurant"]
    ])
    return tablesMap.get(tableName)
}
function _parseToReviewTable(tableName){
    const tablesMap = new Map([
        ["entertainment","reviewentertainment"],
        ["park","reviewpark"],
        ["restaurant","reviewrestaurant"]
    ])
    return tablesMap.get(tableName);
}
function _parseToImagePlace(tableName){
    const tablesMap = new Map([
        ["entertainment","imagesentertainment"],
        ["park","imagespark"],
        ["restaurant","imagesrestaurant"]
    ])
    return tablesMap.get(tableName)
}
function _parseToImageReview(){
    const tablesMap = new Map([
        ["entertainment","imagesentertainmentreview"],
        ["park","imagesparkreview"],
        ["restaurant","imagesrestaurantreview"]
    ])
    return tablesMap.get(tableName)
}