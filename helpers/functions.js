
module.exports = {
    checkStringNotEmpty: function(str) {
        if(str === undefined || str === null || str.length === 0) {
            return false;
        }
        return true;
    },

    getDBErrors: function(errors) {
        var normalizeErrors = [];
        for (var property in errors) {
            if (errors.hasOwnProperty(property)) {
                normalizeErrors.push({title: "Error in: "+property, detail: errors[property].message});
            }
        }
        return normalizeErrors;
    }
};