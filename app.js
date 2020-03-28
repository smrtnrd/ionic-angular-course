const reasonInput = document.querySelector('#input-reason')
const amountInput = document.querySelector('#input-amount')
const cancelBtn = document.querySelector('#btn-cancel')
const confirmBtn = document.querySelector('#btn-confirm')
const expensesList = document.querySelector('#expenses-list')
const totalExpensesOutput = document.querySelector('#total-expenses')
const alertCtrl = document.querySelector('ion-alert-controller');

let totalExpenses = 0; // why does he use let

const clear = () => {
    reasonInput.value = '';
    amountInput.value = '';
};

confirmBtn.addEventListener('click', () => {
    const enteredReason = reasonInput.value;
    const enteredAmount = amountInput.value;
    
    // validation of the imput
    if (
        enteredReason.trim().length <= 0 || // case 1: no reason is written
        enteredAmount <= 0 || // case 2: amount is equal to 0 or less
        enteredAmount.trim() <= 0 // case 3: nothing is entered 
     ){
         alertCtrl.create({
            message: 'Please enter a valid reason and amount!',
            header: 'Invalid inputs',
            buttons: ['Okay']
        }).then(alertElement => {
            alertElement.present();
        });
         return;
     }
     const newItem = document.createElement('ion-item');
     newItem.textContent = enteredReason + ': $' + enteredAmount;

     expensesList.appendChild(newItem)
     //     console.log(enteredReason, enteredAmount);

     totalExpenses += +enteredAmount; // + convert the string to a number
     totalExpensesOutput.textContent = totalExpenses;
     clear();
});

cancelBtn.addEventListener('click', clear)