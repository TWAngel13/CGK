const variableTypes = {
    Boolean: "boolean",
    Number: "number",
    String: "string"
}
module.exports = {
    isString,
    isInteger,//for me integer == number
    isBoolean,
}
//without this sql will die in agony
function isString(variable){
    return _compareTypes(variable,variableTypes.String)
}
function isInteger(variable){
    if(isNaN(variable)){
        return false
    }
    return _compareTypes(variable,variableTypes.Number)
}
function isBoolean(variable){
    return _compareTypes(variable,variableTypes.Boolean)
}
function _compareTypes(variable,type){
    return ((typeof variable == type));
}