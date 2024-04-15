const AbstractPlaceClass = require("./abstractPlace")
class Restaurant extends AbstractPlaceClass{
    static tableName = "restaurant"
}
module.exports = Restaurant