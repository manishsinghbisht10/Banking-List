'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

const displayMovement = function (movements, sort = false) {
  const move = sort ? movements.slice().sort((a, b) => a - b) : movements;
  console.log(move);
  containerMovements.innerHTML = '';
  move.forEach(function (move, index) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__value">${move.toFixed(2)} £</div>
       </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserNames = function (accs) {
  accs.forEach(function (user) {
    user.userName = user.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUserNames(accounts);

const calcPrintBalance = function (account) {
  const mov = account.movements;
  const balance = mov.reduce((acc, movement) => {
    return acc + movement;
  }, 0);
  labelBalance.textContent = `${balance.toFixed(2)} £`;
  account.balance = balance;
};

const calcDisplaySummary = function (account) {
  const movements = account.movements;
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income.toFixed(2)} £`;

  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${(out * -1).toFixed(2)} £`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposite => deposite * (account.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} £`;
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    //Display Login Message
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Diplay movements
    displayMovement(currentAccount.movements);
    //Display Balance
    calcPrintBalance(currentAccount);
    //Display Summary
    calcDisplaySummary(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const constReciverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    amount > 0 &&
    constReciverAccount &&
    currentAccount.balance >= amount &&
    constReciverAccount.userName !== currentAccount.userName
  ) {
    console.log('ready for money transfer');
    currentAccount.movements.push(-amount);
    constReciverAccount.movements.push(amount);
    displayMovement(currentAccount.movements);
    //Display Balance
    calcPrintBalance(currentAccount);
    //Display Summary
    calcDisplaySummary(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value); //floor does type cohersion
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement;
    currentAccount.movements.push(amount);
    displayMovement(currentAccount.movements);
    //Display Balance
    calcPrintBalance(currentAccount);
    //Display Summary
    calcDisplaySummary(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('close', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

let sortedState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sortedState);
  sortedState = !sortedState;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
