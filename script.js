/* [Declarações] */
const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

    /* [Funções]*/
const removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
        transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionInToDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSclass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSclass)
    li.innerHTML = `${transaction.name}
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
    </button>`
    transactionsUl.prepend(li)
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((acc, value) => acc + value, 0))
    .toFixed(2)

const getIncome = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0))
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((acc, transaction) => acc + transaction, 0)
    .toFixed(2)
    
const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({amount}) => amount)
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    
    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionInToDOM)
    updateBalanceValues()
}

init()


const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({ 
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount)
    })

}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit =  ev => {
    ev.preventDefault()

    const transactionName  = inputTransactionName.value.trim()
    const transactionAmount  = inputTransactionAmount.value.trim()
    const isSomeInputsEmpty = transactionName === '' || transactionAmount === ''
    
    if (isSomeInputsEmpty) {
        alert('Favor preencher as duas informações')
        return 
    }

    addToTransactionsArray(transactionName, transactionAmount)
    
    init()
    updateLocalStorage()
    cleanInputs()
}


/* [Event] */
form.addEventListener('submit', handleFormSubmit)