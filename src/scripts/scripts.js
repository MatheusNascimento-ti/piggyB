

const store ={
    get(){
        return JSON.parse(localStorage.getItem("piggyB:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("piggyB:transactions", JSON.stringify(transactions))
    },
    Sclear(){
        localStorage.clear()

        Utils.remove()
    }
}

const DOM = {
    transactioContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, extrat){ 
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.InnerHtmlTransection(transaction)

        DOM.transactioContainer.appendChild(tr)
    },

    InnerHtmlTransection(transaction){
        const CSSclass = transaction.amount > 0 ? "deposito" : "saque"
        const amount = Utils.formatCurency(transaction.amount)

        const html = `
            <td class = "type">${transaction.type}</td>
            <td class = "${CSSclass}">${amount}</td>
            <td class = "data">${transaction.date}</td>
        `
        return html
    },
    
    updatePiggy(){
        document
        .getElementById('piggy')
        .innerHTML = Utils.formatCurency(Utils.balance())
    },

    clearTransactions(){
        DOM.transactioContainer.innerHTML = ""
    }
}

const Utils = {
    all: store.get(),
    
    formatAmount(value){
        value = Number(value) * 100
        
        return value
    },

    formatDate(date){
        const splitedDate = date.split("-")

        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    },

    formatCurency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value)/100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },

    remove(){
        Utils.all.splice(0)

        app.reload()
    },

    balance(){
        total = 0

        Utils.all.forEach(transaction =>{
            total += transaction.amount 
        })
        return total
    },

    add(transaction){
        Utils.all.push(transaction)

        app.save()
    }
}

const app = {
    init(){
        Utils.all.forEach(transaction =>{
            DOM.addTransaction(transaction)
        });

        DOM.updatePiggy()
        store.set(Utils.all)
    },
    save(){
        store.set(Utils.all)
    },
    reload(){
        DOM.clearTransactions()
        app.init()
    },
}


const Form = {
    type: "",
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),
    
    clearFields(){
        Form.type = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    getValues(){
        return {
            type: Form.type,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const {type, amount, date} = Form.getValues()

        if(type.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor preencha todos os campos")
        }
    },

    formatValues(){
        let {type, amount, date} = Form.getValues()
        
        if(type == "saque"){
            amount = amount * -1
            amount = Utils.formatAmount(amount)
        }else{
            amount = Utils.formatAmount(amount)
        }

        date = Utils.formatDate(date)

        return {
            type,
            amount,
            date,
        }
    },

    deposit(event){
        Form.type = "deposito" 
        event.preventDefault()
        try{
            Form.validateFields()
            const transaction = Form.formatValues()
            Utils.add(transaction)
            Form.clearFields()
        }catch(error){
            
        }
        
    },

    withDraw(event){
        Form.type = "saque"
        event.preventDefault()
        try{
            Form.validateFields()
            const transaction = Form.formatValues()
            Utils.add(transaction)
            Form.clearFields()
        }catch(error){
            alert(error.message)
        }
    }
}
