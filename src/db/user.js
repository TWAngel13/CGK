const pgp = require('pg-promise')(/* options */)
const db = pgp(process.env.DB_URL)
module.exports = class User{
    static async createUser(name,email){
        if(await this.#emailExists(email)){
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
    static async #emailExists(email){
        const params = {
            table:"users",
            column:"email",
            value:email
        }
        return (await db.one(
            "SELECT EXISTS(SELECT 1 FROM ${table:name}\
            WHERE ${column:name}=${value})"
        ,params)).exists
    }
    static async exists(userID){
        const params = {
            table:"users",
            column:"id",
            value:userID
        }
        return (await db.one(
            "SELECT EXISTS(SELECT 1 FROM ${table:name}\
            WHERE ${column:name}=${value})"
        ,params)).exists
    }
    static async getAllUsers(startPos,maxPos){
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
    static async getParksReviews(userID,startPos,maxPos){
        return this.#getReviews(userID,startPos,maxPos,"park")
    }
    static async getRestaurantsReviews(userID,startPos,maxPos){
        return this.#getReviews(userID,startPos,maxPos,"restaurant")
    }
    static async getEntertainmentsReviews(userID,startPos,maxPos){
        return this.#getReviews(userID,startPos,maxPos,"entertainment")
    }
    static async #getReviews(userID,startPos,maxPos,tableName){
        const params = {
            userID:userID,
            start:startPos,
            limit:maxPos,
            table:this.#parseToReviewTable(tableName),
            imageTable:this.#parseToImageFromReview(tableName),
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
    static #parseToImageFromReview(tableName){
        const tablesMap = new Map([
            ["restaurant","imagesrestaurantreview"],
            ["park","imagesparkreview"],
            ["entertainment","imagesentertainmentreview"]
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
}