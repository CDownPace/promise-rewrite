const PENDING = 'PENDING',
    FULFINED = 'FULFINED',
    REJECTED = 'REJECTED'

class MyPromise {
    constructor(executor) {

        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFINED;
                this.value = value;

                //发布
                this.onFulfilledCallbacks.forEach(fn => fn())
            }

        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;

                //发布
                this.onRejectedCallbacks.forEach(fn => fn())
            }

        }
        try {

            executor(resolve, reject);

        } catch (e) {
            reject(e)
        }
    }
    //x有可能是普通值，也可能是promise
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value =>value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason =>{throw reason}
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFINED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)

            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status === PENDING) {
                //订阅
                this.onFulfilledCallbacks.push(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                })
                this.onRejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })

        return promise2
    }
    catch(errorCallback) {
        return this.then(null,errorCallback);
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    // console.log('----', promise2, x)
    if (promise2 == x) {
        return reject(new TypeError('Chaining cycle detected for promise MyPromise'))
    }

    let called = false

    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            let then = x.then

            if (typeof then === 'function') { //肯定是Promise
                then.call(x, (y) => {
                    if (called) return;
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                }, (r) => {
                    if (called) return;
                    called = true
                    reject(r)
                })

            } else {

                resolve(x)
            }
        } catch (e) {
            if (called) return;
            called = true
            reject(e)
        }

    } else {
        resolve(x)
    }

}

let promise1 = new MyPromise((resolve, reject) => {
    resolve('Promise1');
})

let promise2 = promise1.then(() => {
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            // resolve('new Promise resolve')
            resolve(new MyPromise((resolve,reject)=>{
                resolve(new MyPromise((resolve,reject)=>{
                    resolve('my Promise resolve')
                }))
            }))
        }, 2000)
    })

    //return Promise.resolve('Promise resolve')
}, (reason) => {
    return reason;
})

promise2.then().then().then().then((value) => {
    //console.log(value);
    throw Error('Error')
}, (reason) => {
    console.log(reason);
}).catch((e)=>{
    console.log('ee',e)
})