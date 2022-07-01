const controller = new AbortController();
const {signal} = controller;

const getDataNBP = async (code) => {
    return await new Promise((resolve, reject) => {
        setTimeout(async () => {
            const response = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${code}/`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                signal
            })

            const data = await response.json();
            resolve(data);
        }, 100);
    })
}

const getDataBackend = async (code) => {
    return await new Promise(async (resolve, reject) => {
        const response = await fetch(`http://localhost:3000/currencies?code=${code}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            signal
        })

        const data = await response.json()

        if (data.length) {
            resolve(data[0])
        }
        reject("Something is no yes")
    })
}


const getDataLocalStorage = async (code) => {
    return await new Promise((resolve, reject) => {
        const data = localStorage.getItem('currencies');
        if (data) {
            JSON.parse(data).forEach((currency) => {
                if (currency.code === code) {
                    resolve(currency)
                }
            })
        }
        reject('something is no yes in localstorage');
    })
}
//
// getDataLocalStorage('usd')
//     .then(console.log)
//     .catch(console.error);
//
// getDataNBP('usd')
//     .then(console.log)
//     .catch(console.error);


//
// getDataBackend(('usd'))
//     .then(console.log)
//     .catch(console.error);

const currencyCode = 'usd';

// Promise.race([
//     getDataBackend(currencyCode),
//     getDataLocalStorage(currencyCode),
//     getDataNBP(currencyCode)])
//     .then(console.log)
//     .catch(console.error);

Promise.any([
    getDataBackend(currencyCode),
    getDataLocalStorage(currencyCode),
    getDataNBP(currencyCode)])
    .then((data) => {
        console.log(data);
        controller.abort()
    })
    .catch(console.error);
//
// Promise.all([
//     getDataBackend(currencyCode),
//     getDataLocalStorage(currencyCode),
//     getDataNBP(currencyCode)])
//     .then(console.log)
//     .catch(console.error);

