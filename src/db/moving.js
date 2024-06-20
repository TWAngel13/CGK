const pgp = require('pg-promise')(/* options */)
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
module.exports = class Moving{
    static async hashAllPasswords(){
        const users = (await db.one("SELECT ARRAY_AGG(DISTINCT users.id) AS ids FROM USERS")).ids;
        for (const user of users) {
            const password = await this.getPassword(user);
            const hash = await bcrypt.hash(password,saltRounds);
            this.ReplacePassword(user,hash);
        }
    }
    static async getPassword(id){
        return (await db.one("SELECT users.password FROM USERS WHERE users.id=${id}",{id:id})).password;
    }
    static async ReplacePassword(id,password){
        await db.none("UPDATE users set password=${password} WHERE id = ${id}",{id:id,password:password});
    }
}
