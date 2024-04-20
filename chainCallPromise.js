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
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFINED) {
                setTimeout(()=>{
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2,x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                },0)
                
            }
            if (this.status === REJECTED) {
                setTimeout(()=>{
                try {
                    let x = onRejected(this.reason)
                    resolvePromise(promise2,x, resolve, reject);
                } catch (e) {
                    reject(e)
                }
            },0)
            }
            if (this.status === PENDING) {
                //订阅
                this.onFulfilledCallbacks.push(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2,x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                })
                this.onRejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2,x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })

        return promise2
    }
}

function resolvePromise(promise2,x, resolve, reject){
    console.log('----',promise2,x)

}
let promise = new MyPromise((resolve, reject) => {
    // setTimeout(() => {
    resolve('result')
    // }, 2000)
    // reject('Error')
    // throw new Error('Error')
})


let promise2 = promise.then((value) => {
    // return new Promise((resolve, reject) => {
    //     resolve(value + '-> then -> promise2')
    // })
    return value + '-> then -> promise2'
})
promise.then((value) => {
    console.log('Fullfilled:' + value)
}, (reason) => {
    console.log('Rejected:' + reason)
})