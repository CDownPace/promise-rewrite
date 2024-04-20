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
    then(onFulfilled, onRejected) {
        if (this.status === FULFINED) {
            onFulfilled(this.value)
        }
        if (this.status === REJECTED) {
            onRejected(this.reason)
        }
        if (this.status === PENDING) {
            //订阅
            this.onFulfilledCallbacks.push(() => {
                onFulfilled(this.value)
            })
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason)
            })
        }
    }
}
let promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('result')
    }, 2000)
    // reject('Error')
    // throw new Error('Error')
})
promise.then((value) => {
    console.log('Fullfilled:' + value)
}, (reason) => {
    console.log('Rejected:' + reason)
})