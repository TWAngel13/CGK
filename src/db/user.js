const { AlreadyExists, NotExists, AccessDenied } = require('../constaints/errorCodes')

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
module.exports = class User{
    static async getUserInfoMinimal(userID){
        const params = {
            userID:userID,
        }
        return (await db.oneOrNone(
            "SELECT \
                users.name,\
                users.id ,\
                JSON_AGG(DISTINCT review) AS review \
            FROM users \
            LEFT JOIN review \
            ON users.id = review.userid \
            WHERE users.id = ${userID} \
            GROUP BY users.id \
        ",params))
    }
    static async getUserInfoAuth(userID){
        const params = {
            userID:userID,
        }
        return (await db.oneOrNone(
            "SELECT \
                users.name,\
                users.id ,\
                JSON_AGG(DISTINCT review) AS review, \
                JSON_AGG(DISTINCT favourites.objectid) AS favourites \
            FROM users \
            LEFT JOIN review \
            ON users.id = review.userid \
            LEFT JOIN favourites \
            ON users.id = favourites.userid \
            WHERE users.id = ${userID} \
            GROUP BY users.id \
        ",params))
    }
    static async addFavourites(userID,objectID){
        const params = {
            userID:userID,
            objectID:objectID,
        }
        return (await db.none(
            "INSERT INTO favourites (userid,objectid) \
            VALUES(${userID},${objectID}) \
            ON CONFLICT (userid,objectid) DO NOTHING \
        ",params))
    }
    static async removeFavourites(userID,objectID){
        const params = {
            userID:userID,
            objectID:objectID,
        }
        return (await db.none(
            "DELETE FROM favourites \
            WHERE \
                objectid = ${objectID} \
                AND \
                userid = ${userID} \
        ",params))
    }
    static async addImage(objectID,reviewID,imageData){
        const params = {
            image:imageData,
            objectID:objectID,
            reviewID:reviewID,
        }
        const image = (await db.oneOrNone(
            "INSERT INTO images (objectid) \
            VALUES(${objectID}) \
            RETURNING id"
        ,params))
        console.log(image);

        if(image){
            return image
        }
        else{
            return null
        }
    }
    static async createReview(userID,rating,objectID,reviewText){
        const params = {
            userID:userID,
            rating:rating,
            objectID:objectID,
            reviewText: reviewText
        }
        return (await db.one(
            "INSERT INTO review (userid,rating,object,text) \
            VALUES(${userID},${rating},${objectID},${reviewText}) \
            ON CONFLICT (userid,object) DO UPDATE \
            SET rating = ${rating}, text = ${reviewText} \
            RETURNING ID\
        ",params)).id
    }
    static async loginUser(email,password){
        const params = {
            email:email,
            password:password
        }
        const loginedUser = await db.oneOrNone(
        "SELECT\
            users.id,\
            users.email\
        FROM users \
        WHERE \
            users.email = ${email} \
            AND\
            users.password = ${password} \
        "
        ,params)
        if(!loginedUser){
            return NotExists.code
        }
        const generatedToken = loginedUser.id+this.#generate_token(256)
        const params2 = {
            token: generatedToken,
            userid: loginedUser.id,
        }
        db.none(
            "INSERT INTO tokens (token,userid)\
            VALUES (${token},${userid})"
        ,params2)
        return generatedToken
    }
    static async logout(token){
        const params = {
            token:token
        }
        return await db.none(
            "DELETE FROM tokens \
            WHERE token = ${token}"
        ,params)
    }
    static async createUser(name,email,password){
        if(await this.#emailExists(email)){
            return AlreadyExists.code
        }
        else{
            const params = {
                name:name,
                email:email,
                password:password
            }
            await db.none(
                "INSERT INTO users (name,email,password) \
                VALUES (${name},${email},${password}) \
                ON CONFLICT DO NOTHING"
                ,params)
            return 1
        }
    }
    static async exists(userID){
        const params = {
            value:userID
        }
        return (await db.one(
            "SELECT EXISTS(SELECT 1 FROM users\
            WHERE id =${value})"
        ,params)).exists
    }
    static async getAllUsers(startPos,maxPos){
        const params = {
            start:startPos,
            limit:maxPos
        }
        return (await db.oneOrNone(
            "SELECT \
                JSON_AGG(json_build_object('id', x.id, 'name', x.name)) as users\
            FROM (\
                SELECT * FROM users\
                OFFSET ${start} \
                LIMIT ${limit} \
            ) AS x\
            "
        ,params))
    }
    static async getUserReviews(userID,startPos,maxPos){
        const params = {
            userID:userID,
            start:startPos,
            limit:maxPos,
        }
        return (await db.any(
            "SELECT\
                review.*,\
                object.name as objectName\
            FROM review \
            LEFT JOIN object \
            ON object.id = review.object \
            WHERE review.userid = ${userID} \
            GROUP BY review.id , object.name\
            ORDER BY review.id \
            "
        ,params))
    }
    static async getUserFavourites(userID,startPos,maxPos){
        const params = {
            userID:userID,
            start:startPos,
            limit:maxPos,
        }
        return (await db.any(
            "SELECT\
                favourites.objectid,\
                ARRAY_AGG(json_build_object('id', object.id, 'name', object.name)) as object \
            FROM favourites \
            LEFT JOIN object \
            ON object.id = favourites.objectid \
            WHERE favourites.userid = ${userID} \
            GROUP BY favourites.objectid \
            "
        ,params))
    }
    static async ReviewExists(reviewID){
        const params = {
            value:reviewID
        }
        return (await db.one(
            "SELECT EXISTS(SELECT 1 FROM review\
            WHERE id =${value})"
        ,params)).exists
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
    static async validateToken(token){
        const params = {
            token:token
        }
        const userID = await db.oneOrNone(
            "SELECT \
                tokens.userid\
            FROM tokens \
            WHERE \
                token = ${token}"
        ,params)
        if(userID){
            return userID.userid
        }
        return null;
    }
    static  #generate_token(length){
        //edit the token allowed characters
        var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        var b = [];  
        for (var i=0; i<length; i++) {
            var j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    }
}