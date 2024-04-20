const PENDING = 'PENDING',
    FULFINED = 'FULFINED',
    REJECTED = 'REJECTED'

class MyPromise {
    constructor(executor) {

        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFINED;
                this.value = value;
            }

        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
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
    }
}
let promise = new MyPromise((resolve, reject) => {
    // reject('Error')
    // resolve('result')
    throw new Error('Error')
})
promise.then((value) => {
    console.log('Fullfilled:' + value)
}, (reason) => {
    console.log('Rejected:' + reason)
})