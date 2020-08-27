const checkCashRegister = (price, cash, cid) => {
    
    //validate input
    if (typeof price !== 'number' || typeof cash !== 'number' || !Array.isArray(cid) ) {
        return false;
    }

    //create a new array for change keys, sorted from highest to lowest
    const cashRegister = [
        ["ONE HUNDRED", 0, 100],
        ["TWENTY", 0, 20],
        ["TEN", 0, 10],
        ["FIVE", 0, 5],
        ["ONE", 0, 1],
        ["QUARTER", 0, 0.25],
        ["DIME", 0, 0.1],
        ["NICKEL", 0, 0.05],
        ["PENNY", 0, 0.01]
    ]

    
    //Assign values to cashRegister array - this will filter out any invalid currencies passed to the checkCashRegister function
    cid.forEach(item => {
        let indexReference = item[0];

        for(let i = 0; i < cashRegister.length; i++) {
            if (cashRegister[i].includes(indexReference)) {
                cashRegister[i][1] = item[1];
            }
        }
    });

    //find total currency in cashRegister
    let totalCurrency = getTotal(cashRegister);

      //set response object
    let responseObj = {
        status: 'OPEN',
        change: []
    }
    
    //define array variable to keep track of change
    let change = [cash - price];
    
    //exit early if there is no change required
    if (change[0] <= 0) {
        return responseObj;
    }

    //exit early if change is more than total amount of funds in cashRegister
    if (change[0] > totalCurrency) {
        responseObj.status = 'INSUFFICIENT_FUNDS';
        return responseObj;
    }

    //define change array
    let returnChange = [];

    //Iterate through cashRegister to find amount to add to returnChange array
    cashRegister.forEach((item, index, arr) => {
        
        let value = item[2];
        let cash = item[1];
        
        let response = findChange(change[0], cash, value);
        change[0] = response[0];

        //update amount in cashRegister (not required) 
        arr[index][1] = response[1];

        //add return change to returnChange array or cashRegister amount if equal to zero
        if (response[2] > 0 || response[1] === 0) {
            returnChange.push([item[0], response[2]]);
        }
    });

    //exit if there is change left (unable to change exact amount)
    if(change[0] > 0) {
        responseObj.status = "INSUFFICIENT_FUNDS";
        return responseObj;
    }

    
    //reverse returnChange array to output smallest values first if zero
    returnChange.reverse();
    
    //sort returnChange array by value
    returnChange.sort(sortArray);
    
    responseObj.change = returnChange;
    
    //check if status is closed 
        for(let i = 0; i < returnChange.length; i++)
        if (returnChange[i][1] === 0) {
            responseObj.status = 'CLOSED';
            return responseObj;
        } 

    
    return responseObj;
}
  

const findChange = (change, cash, value) => {
    let amount = 0;
    if (cash === 0) return [change, cash, amount];
    
    change = change * 100;
    cash = cash * 100;
    value = value * 100;
    
    while (change >= value && cash > 0 ) {
        amount ++;
        change = Math.round(change - value);
        cash = cash - value;
    }

    //return remaining change, remaining cash in cashRegister and change to be added to the returnChange array
    return [change/100, cash/100, (amount*value)/100];
}

const getTotal = cashRegister => {
    let total = 0;
    for (let i = 0; i < cashRegister.length; i++) {
        total = Math.round(total + cashRegister[i][1] * 100);
    }
    return total/100;
}

const sortArray = (a, b) => {
    if(a[1] === b[1]) return 0;
    else return (a[1] > b[1]) ? -1 : 1;
}

let test = checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
console.log(test);
