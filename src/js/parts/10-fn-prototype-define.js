//重点！！！
//构造函数是$E.fn.init，将构造函数的prototype指向$E.fn
//模仿jquery写法
$E.fn.init.prototype = $E.fn;