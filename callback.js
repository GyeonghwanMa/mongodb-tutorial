const addSum = (a, b, callback) => {
    setTimeout(() => {
        if (typeof a !== 'number' || typeof b !== 'number') return callback('a, b must be numbers');
        callback(undefined, a+b);
    }, 3000);
}

let callback = (error, sum) => {
    if (error) return console.log( {error} );
    console.log({sum});
}

addSum(10, 'ss', callback);