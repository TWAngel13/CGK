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
module.exports = class News{
    static async getAllNews(startPos,maxPos){
        const params = {
            start:startPos,
            limit:maxPos,
        }
        const list = await db.any(
            "SELECT\
                news.*,\
                ARRAY_AGG(images.id) AS images \
            FROM news \
            LEFT JOIN images \
            ON news.id = images.newsid \
            GROUP BY news.id \
            ORDER BY news.date DESC \
            OFFSET ${start}\
            LIMIT ${limit}\
            "
        ,params)
        return list
    }
    static async getNews(newsID){
        const params = {
            newsID:newsID,
        }
        const news = await db.one(
            "SELECT\
                news.*,\
                ARRAY_AGG(images.id) AS images \
            FROM news \
            LEFT JOIN images \
            ON news.id = images.newsid \
            WHERE news.id = ${newsID} \
            GROUP BY news.id \
            LIMIT 1\
            "
        ,params)
        return news
    }
    static async exists(newsID){
        const params = {
            value:newsID,
        }
        return (await db.one(
            "SELECT EXISTS(SELECT 1 FROM news\
            WHERE id=${value})"
        ,params)).exists
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
