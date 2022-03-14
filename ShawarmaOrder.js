const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    ORDER:   Symbol("order"),
    REORDER:   Symbol("reorder"),
    SIZE:   Symbol("size"),
    TOPPINGS:   Symbol("toppings"),
    DIPS:   Symbol("dips"),
    DRINKS:  Symbol("drinks"),
    DESERTS:  Symbol("deserts"),
    PAYMENT: Symbol("payment")
});

//
const ITEM = {
    BURGER: 'burger',
    PIZZA: 'pizza',
    SHAWARMA: 'shawarma'
}

//
const ITEMSIZE = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
}

//
const ITEMPRICE = {
    BURGER: 5,
    PIZZA: 10,
    SHAWARMA: 7
}

//
const SIZEPRICE = {
    SMALL: 0,
    MEDIUM: 1,
    LARGE: 2
}

module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sOrder = "";
        this.sToppings = "";
        this.sDips = "";
        this.sDeserts = "";
        this.sDrinks = "";
        this.sItem = [];
        this.sTotal = 0;
    }

    //
    validateItem(value){

        value = value.toLowerCase();
        if((value.indexOf('1') === 0 && value.length === 1)  || value.indexOf('burger') > -1)
            return ITEM.BURGER;
        else if((value.indexOf('2') === 0 && value.length === 1)  || value.indexOf('shawarma') > -1)
            return ITEM.SHAWARMA;
        else if((value.indexOf('3') === 0 && value.length === 1)  || value.indexOf('pizza') > -1)
            return ITEM.PIZZA;
        else    
            return '';
    }

    //
    validateSize(value){

        value = value.toLowerCase() ;
        if((value.indexOf('s') === 0 && value.length === 1) || value.indexOf('small') > -1)
            return ITEMSIZE.SMALL;
        else if((value.indexOf('m') === 0 && value.length === 1) || value.indexOf('medium') > -1)
            return ITEMSIZE.MEDIUM;
        else if((value.indexOf('l') === 0 && value.length === 1) || value.indexOf('large') > -1)
            return ITEMSIZE.LARGE;
        else return '';
    }

    //
    calcTotal() {

        //item cost
        if(this.sItem){
           this.sItem.forEach(element => {
            if(element === ITEM.BURGER)
                this.sTotal += ITEMPRICE.BURGER;
            if(element === ITEM.PIZZA)
                this.sTotal += ITEMPRICE.PIZZA;
            if(element === ITEM.SHAWARMA)
                this.sTotal += ITEMPRICE.SHAWARMA;
           });
        }

        //size cost
        if(this.sSize){
            if(this.sSize === ITEMSIZE.SMALL)
                this.sTotal += SIZEPRICE.SMALL;
            if(this.sSize === ITEMSIZE.MEDIUM)
                this.sTotal += SIZEPRICE.MEDIUM;
            if(this.sSize === ITEMSIZE.LARGE)
                this.sTotal += SIZEPRICE.LARGE;
        }

        //toppings cost ~ each cost $1
        if(this.sToppings && this.sToppings.length){
            if(this.sToppings.indexOf(' '))
                this.sTotal += this.sToppings.split(' ').length;
            else
                this.sTotal += 1;
        }

        //dips cost ~ each cost $1
        if(this.sDips && this.sDips.length){
            if(this.sDips.indexOf(' '))
                this.sTotal += this.sDips.split(' ').length;
            else
                this.sTotal += 1;
        }

        //drink cost ~ cost $1
        if(this.sDrinks){
            this.sTotal += 1;
        }

        //desert cost ~ cost $1
        if(this.sDeserts){
            this.sTotal += 1;
        }
    }

    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.ORDER;
                aReturn.push("Welcome to Grace Cafe.");
                aReturn.push("What order would you like?");
                aReturn.push("1-Burger");
                aReturn.push("2-Shawarma");
                aReturn.push("3-Pizza");
                break;
            case OrderState.ORDER://
                const item1 = this.validateItem(sInput);
                if(item1 === ''){
                    aReturn.push("Oh no! Wrong option :( Try again!");
                    break;
                }else{
                    this.sItem.push(item1);
                }
                this.stateCur = OrderState.REORDER;
                aReturn.push("What another order would you like?");
                aReturn.push("1-Burger");
                aReturn.push("2-Shawarma");
                aReturn.push("3-Pizza");
                break;
            case OrderState.REORDER://
                const item2 = this.validateItem(sInput);
                if(item2 === ''){
                    aReturn.push("Oh no! Wrong option :( Try again!");
                    break;
                }else if(item2 != 'no'){
                    this.sItem.push(item2)
                }
                this.stateCur = OrderState.SIZE;
                aReturn.push("What size would you like?");
                aReturn.push("s-small, m-medium, l-large");
                break;
            case OrderState.SIZE:
                this.sSize = this.validateSize(sInput);
                if(this.sSize === ''){
                    aReturn.push("Oh no! Wrong option :( Try again!");
                    break;
                }
                this.stateCur = OrderState.TOPPINGS;
                aReturn.push("What toppings would you like?");
                break;
            case OrderState.TOPPINGS:
                this.stateCur = OrderState.DIPS;
                this.sToppings = sInput;
                aReturn.push("What dips would you like?");
                break;
            case OrderState.DIPS:
                this.stateCur = OrderState.DRINKS;
                this.sDips = sInput;
                aReturn.push("Would you like drinks with that?");
                break;
            case OrderState.DRINKS:
                this.stateCur = OrderState.DESERTS;
                if(sInput.toLowerCase() != "no"){
                    this.sDrinks = sInput;
                }
                aReturn.push("Would you like deserts with that?");
                break;
            case OrderState.DESERTS:
                this.stateCur = OrderState.PAYMENT;
                if(sInput.toLowerCase() != "no"){
                    this.sDeserts = sInput;
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.sSize} ${this.sItem.toString()} with ${this.sToppings} ${this.sDips}`);
                if(this.sDrinks){
                    aReturn.push(this.sDrinks);
                }
                if(this.sDeserts){
                    aReturn.push(this.sDeserts);
                }

                this.calcTotal();//
                this.nOrder = this.sTotal;
                aReturn.push(`Your total order value will be costing $${this.sTotal}!`);//
                
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                let shipping=sInput.purchase_units[0].shipping;
                let shippingAddress=shipping.address;
                let address= `${shipping.name.full_name} ${shippingAddress.address_line_1} ${shippingAddress.address_line_2} ${shippingAddress.admin_area_2} ${shippingAddress.admin_area_1} ${shippingAddress.postal_code} ${shippingAddress.country_code}`;
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                aReturn.push(`Delivering Address is ${address}`);

                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
        // your client id should be kept private
        if(sTitle != "-1"){
          this.sItem = sTitle;
        }
        if(sAmount != "-1"){
          this.nOrder = sAmount;
        }
        const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
        return(`
        <!DOCTYPE html>
    
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
        </head>
        
        <body>
          <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
          <script
            src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
          </script>
          Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
          <div id="paypal-button-container"></div>
    
          <script>
            paypal.Buttons({
                createOrder: function(data, actions) {
                  // This function sets up the details of the transaction, including the amount and line item details.
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: '${this.nOrder}'
                      }
                    }]
                  });
                },
                onApprove: function(data, actions) {
                  // This function captures the funds from the transaction.
                  return actions.order.capture().then(function(details) {
                    // This function shows a transaction success message to your buyer.
                    $.post(".", details, ()=>{
                      window.open("", "_self");
                      window.close(); 
                    });
                  });
                }
            
              }).render('#paypal-button-container');
            // This function displays Smart Payment Buttons on your web page.
          </script>
        
        </body>
            
        `);
    
      }
}