'use strict';

// Data

const account1 = {
  userName: 'rt',
  owner: 'Rahul Thakare',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  userName: 'at',
  owner: 'Aman Tajne',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  userName: 'hk',
  owner: 'Himanshu Kotpalliwar',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  userName: 'mm',
  owner: 'Mohit Musale',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//                  MOMENTS

function moments(array) {
  containerMovements.innerHTML = '';
  array.forEach(function (value, i) {
    const type = (value >= 0) ? ('deposit') : ('withdrawal');
    const html = ` <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${value}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

//           DISPLAYING BALANCE

function calcBalance(obj) {
  const balance = obj.movements.reduce(function (acc, value) {
    return acc + value;
  }, 0);
  obj.balance = balance;
  labelBalance.textContent = ` ${balance}€`;
}

// CALCULATING AND DISPLAYING IN and OUT

function calcIn(arr) {
  const inValue = arr.filter(value => value > 0).reduce((acc, value) => (acc + value), 0);
  labelSumIn.textContent = `${inValue}€`;
};

function calcOut(arr) {
  const inValue = Math.abs(arr.filter(value => value < 0).reduce((acc, value) => (acc + value), 0));
  labelSumOut.textContent = `${inValue}€`;
};

//CALCULATING AND DISPLAYING INTREST on each deposit of 1.2 percent

function calcIntrest(arr, obj) {
  const intrestValue = arr.filter(value => value > 0).map(value => value * (obj.interestRate) / 100).filter(value => value >= 1).reduce((acc, value) => (acc + value), 0);
  labelSumInterest.textContent = `${intrestValue}€`;
};

//           LOGGING IN

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();  // prevents form submitting because that button is inside form element.
  currentAccount = accounts.find(function (acc) {
    return acc.userName === inputLoginUsername.value;
  });
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginUsername.blur();//  for losing focus on username after hitting enter
    inputLoginPin.blur();      //  for losing focus on pin after hitting enter
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    // calling moments

    moments(currentAccount.movements);

    // Displaying Balance

    calcBalance(currentAccount);

    // CALCULATING AND DISPLAYING IN and OUT
    calcIn(currentAccount.movements);
    calcOut(currentAccount.movements);

    // CALCULATING AND DISPLAYING INTREST on each deposit 

    calcIntrest(currentAccount.movements, currentAccount);

  }
  else {
    alert(`Invalid login credentials please try again`);
  }
});

// Transfer Money


let toTransfer;
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); 
  toTransfer = accounts.find(function (acc) {
    return acc.userName === inputTransferTo.value;
  });
  let transferValue = Number(inputTransferAmount.value);
  if (toTransfer?.userName && transferValue > 0 && currentAccount.balance >= transferValue && toTransfer.userName != currentAccount.userName) {
    currentAccount.movements.push(-transferValue);
    toTransfer.movements.push(transferValue);
    moments(currentAccount.movements);
    calcBalance(currentAccount);
    calcIn(currentAccount.movements);
    calcOut(currentAccount.movements);
    calcIntrest(currentAccount.movements, currentAccount);

  }
  else if (currentAccount.userName) {
    alert(`Can't transfer to this account `);
  }
  else if (transferValue < 0) {
    alert(`Please enter a valid amount`);
  }
  else if (currentAccount.balance < transferValue) {
    alert(`insufficient balance..`);
  }
  else {
    alert(`Invalid id please try again`);
  }
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();
});


//LOAN

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();  // prevents form submitting because that button is inside form element.
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0) {
    currentAccount.movements.push(loanAmount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  moments(currentAccount.movements);
  calcBalance(currentAccount);
  calcIn(currentAccount.movements);
  calcOut(currentAccount.movements);
  calcIntrest(currentAccount.movements, currentAccount);
});


//CLOSE ACCOUNT

btnClose.addEventListener('click', function (e) {
  e.preventDefault(); 
  let closeUser = inputCloseUsername.value;
  let closePass = Number(inputClosePin.value);
  if (closeUser === currentAccount.userName && closePass === currentAccount.pin) {
    const index = accounts.findIndex(function (acc) {
      return acc.userName === currentAccount.userName;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    alert(`Account deleted successfully`);
    labelWelcome.textContent =`Log in to get started`;
  }
  else {
    alert(`invalid credientials `);
  }
  inputCloseUsername.value = '';
  inputCloseUsername.blur();
  inputClosePin.value = '';
  inputClosePin.blur();
})

// SORT
btnSort.addEventListener('click',function(){
  currentAccount.movements.sort((a,b)=>{
    if(a>b) return 1;
    if(a<b) return -1;
  });
  moments(currentAccount.movements);
})























//                                           CODING CHALLENGE 01


//------------------------------------------------------------------------------------------


// const juliasData = [3,5,2,12,7];
// const katesData =[9,16,6,8,3];

// function checkDogs(julia,kate){
//     const onlyDogs = julia.slice(1,-2);
//     // console.log(onlyDogs);
//     const bothDogsAges = [...onlyDogs,...kate];
//     console.log(bothDogsAges);
//     bothDogsAges.forEach(function(element,i){
//           if(element >=3){
//             console.log(`Dog no ${i+1} is adult and is ${element} year's old `);
//           }
//           else{
//             console.log(`Dog no ${i+1} is puppy and is ${element} year's old `);
//           }
//     });
// }
// checkDogs(juliasData,katesData);

//-----------------------------------------------------------------------------------------

//                                       CALCULATING AND DISPLAYING BALANCE






//-----------------------------------------------------------------------------------------------------------



//                                   MAXIMUM VALUE OF ARRAY USING REDUCE METHOD


// function calcMax(arr){
//   const balance = arr.reduce(function(acc,value){
//       return (acc>=value)?acc:value;
//   },arr.at(0));
//   // console.log(arr.at(0));
//   console.log(balance);
// }
// calcMax(account1.movements);


//------------------------------------------------------------------------------------------


//                                             CODING CHALLENGE NO 2

// function avgHumanAge(arr) {
//  const humanAge = arr.map(function(value){
//   if(value<=2){
//     return 2*value;
//   }
//   else{
//     return 16+(value*4);
//   }
//  });
//  const adultHumanAge = humanAge.filter(function(value){
//   return value>=18;
//  });
//  const avgAdultHumanAge = adultHumanAge.reduce(function(acc,value){
//   return acc + value ;
//  });
//  return avgAdultHumanAge/adultHumanAge.length;
// };
// // const avgHumanAgeOfAll = avgHumanAge([16,6,10,5,6,1,4]);
// const avgHumanAgeOfAll = avgHumanAge([5,2,4,1,15,8,3]);
// console.log(avgHumanAgeOfAll);


//-------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------------



// const account1 = {
//     owner: 'Jonas Schmedtmann',
//     movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//     interestRate: 1.2, // %
//     pin: 1111,
//   };



//-------------------------------------------------------------------------------------------------------------


//                                          CODING CHALLENGE N0 3



// function avgHumanAge(arr) {
//   const humanAge = arr.map(value=>(value<=2)?(2*value):(16 + (value*4))).filter(value=>(value>=18)).reduce((acc,value,i,arr)=>acc + (value/arr.length),0);

//  return humanAge;
// };
// // const avgHumanAgeOfAll = avgHumanAge([16,6,10,5,6,1,4]);
// const avgHumanAgeOfAll = avgHumanAge([5,2,4,1,15,8,3]);
// console.log(avgHumanAgeOfAll);


//-------------------------------------------------------------------------------------------------------------

//                                              THE FIND METHOD
let str = `The findIndex Method`;
let newStr = str.toUpperCase()
console.log(newStr);

// console.log(accounts.find(acc=>acc.owner === 'Jonas Schmedtmann'));
// This methods returns that value of array for which the return statement get true but returns only the first value for which the return  statement got true



//-------------------------------------------------------------------------------------------------------------




