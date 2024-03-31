const variableTypes = {
    Boolean: "boolean",
    Number: "number",
    String: "string",
    Array: "array",
}
module.exports = {
    isString,
    isInteger,//for me integer == number
    isBoolean,
    isArrayOfStrings,
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
function isArrayOfStrings(variable){
    return _isArrayOfType(variable,variableTypes.String)
}
function _compareTypes(variable,type){
    return ((typeof variable == type));
}
function _isArrayOfType(variable,type){
    if(!variable || !Array.isArray(variable) || variable.length == 0){
        return false
    }
    for(var i = 0;i < variable.length;i++){
        if(typeof variable[i] != type){
            return false;
        }
    }
    return true
}