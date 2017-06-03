/*
    poly-fill
*/

export default function () {

    // Object.assign
    if (typeof Object.assign != 'function') {
        Object.assign = function(target, varArgs) { // .length of function is 2
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object')
            }

            var to = Object(target)

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index]

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey]
                        }
                    }
                }
            }
            return to
        }
    }

}
