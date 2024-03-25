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
    getParkTags,
    getEntertainmentTags,
    getRestaurantTags,
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
async function getParkTags(objectID){
    return _getTags(objectID,"tagpark","parkid")
}
async function getRestaurantTags(objectID){
    return _getTags(objectID,"tagrestaurant","restaurantid")
}
async function getEntertainmentTags(objectID){
    return _getTags(objectID,"tagentertainment","entertainmentid")
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
        table:tableName
    }
    return (await db.any(
        "SELECT * FROM ${table:name} \
        WHERE userid = ${userID}\
        LIMIT ${limit} OFFSET ${start}"
    ,params))
}
async function _getTags(objectID,tableName,columnName){
    const params = {
        objectID:objectID,
        table:tableName,
        column:columnName
    }
    return (await db.any(
        "SELECT tag FROM ${table:name} \
        WHERE ${column:name}=${objectID}"
    ,params))
}
async function _getReviewsForPlace(objectID,startPos,maxPos,tableName){
    const params = {
        objectID:objectID,
        start:startPos,
        limit:maxPos,
        table:tableName
    }
    return (await db.any(
        "SELECT * FROM ${table:name} \
        WHERE objectid = ${objectID}\
        LIMIT ${limit} OFFSET ${start}"
    ,params))
}
async function _getInfoForPlace(objectID,tableName){
    const params = {
        objectID:objectID,
        table:tableName
    }
    return (await db.any(
        "SELECT * FROM ${table:name} \
        WHERE id = ${objectID}\
        LIMIT 1"
    ,params))
}