const AbstractPlaceClass = require("./abstractPlace")
class Park extends AbstractPlaceClass{
    static tableName = "park"
}
module.exports = Park