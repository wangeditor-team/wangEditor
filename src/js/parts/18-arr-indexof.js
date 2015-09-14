if(!Array.prototype.indexOf){
    //IE低版本不支持 arr.indexOf 
    Array.prototype.indexOf = function(elem){
        var i = 0,
            length = this.length;
        for(; i<length; i++){
            if(this[i] === elem){
                return i;
            }
        }
        return -1;
    };
    //IE低版本不支持 arr.lastIndexOf
    Array.prototype.lastIndexOf = function(elem){
        var length = this.length;
        for(length = length - 1; length >= 0; length--){
            if(this[length] === elem){
                return length;
            }
        }
        return -1;
    };
}