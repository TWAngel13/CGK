const { search } = require('../routes/users')

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
    restaurantExists,
    parkExists,
    entertainmentExists,

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
    return _getReviews(userID,startPos,maxPos,"reviewrestaurant")
}
async function getEntertainmentReviews(userID,startPos,maxPos){
    return _getReviews(userID,startPos,maxPos,"reviewentertainment")
}
async function getParkReviews(userID,startPos,maxPos){
    return _getReviews(userID,startPos,maxPos,"reviewpark")
}
async function getReviewsForRestaurant(objectID,startPos,maxPos){
    return _getReviewsForPlace(objectID,startPos,maxPos,"reviewrestaurant")
}
async function getReviewsForEntertainment(objectID,startPos,maxPos){
    return _getReviewsForPlace(objectID,startPos,maxPos,"reviewentertainment")
}
async function getReviewsForPark(objectID,startPos,maxPos){
    return _getReviewsForPlace(objectID,startPos,maxPos,"reviewpark")
}
async function getInfoForPark(objectID){
    return _getInfoForPlace(objectID,"park")
}
async function getInfoFoRestaurant(objectID){
    return _getInfoForPlace(objectID,"restaurant")
}
async function getInfoForEntertainment(objectID){
    return _getInfoForPlace(objectID,"entertainment")
}
async function userExists(userID){
    return _exists("users","id",userID)
}
async function parkExists(objectID){
    return _exists("park","id",objectID)
}
async function entertainmentExists(objectID){
    return _exists("entertainment","id",objectID)
}
async function restaurantExists(objectID){
    return _exists("restaurant","id",objectID)
}
async function getAllTagsRestaurant(){
    return _getAllTags("restaurant")
}
async function getAllTagsPark(){
    return _getAllTags("park")
}
async function getAllTagsEntertainment(){
    return _getAllTags("entertainment")   
}
async function getAllRestaurants(startPos,maxPos,sort,search){
    return _getAllPlaces("restaurant",startPos,maxPos,sort,search)
}
async function getAllParks(startPos,maxPos,sort,search){
    return _getAllPlaces("park",startPos,maxPos,sort,search)
}
async function getAllEntertainments(startPos,maxPos,sort,search){
    return _getAllPlaces("entertainment",startPos,maxPos,sort,search)
}
async function _exists(table,column,value){
    const params = {table:table,column:column,value:value}
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
        table:tableName,
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
        table:tableName,
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
            JSON_AGG(DISTINCT ${workingTime:name}) AS workingHours\
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
async function _getAllPlaces(tableName,startPos,maxPos,sort,search){
    const params = {
        table:tableName,
        imageTable:_parseToImageFromPlace(tableName),
        start:startPos,
        limit:maxPos,
        sort:sort,
        search:search,
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
            WHERE ${table:name}.name LIKE '%${search:value}%'\
            GROUP BY ${table:name}.id\
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
        ["reviewrestaurant","imagesrestaurantreview"],
        ["reviewpark","imagesparkreview"],
        ["reviewentertainment","imagesentertainmentreview"]
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