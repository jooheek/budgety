//공통화를 통해 코드를 정리한다 코드를 깨끗하고 보기 좋게 정리한다, 데이터 privacy 를 지킬 수 있다.
//UI Module/ Data Module /Controller Module로 나눈다


//BudgetController
var budgetController = (function(){

    var Expense = function (id,description,value){
        this.id =id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id,description,value){
        this.id =id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function (curr){
            sum += curr.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals:{
            exp:0,
            inc:0
        },
        budget : 0,
        percentage: -1
        //존재하지 않는다는걸 나타낼때 0 보다 -1을 사용
    };
    // var allExpenses =[];
    // var allIncomes =[];
    // var totalExpenses =0; 처럼
    //여러 변수들이 정리안돼서 날라다니는것보다 한 data structure에 담아져서 관리되는 것이 좋다
    return{
        addItem:function (type,des,val){
            //헷갈리지 않게 변수명은 다르게 정한다. 같게 하는게 더 안헷갈릴것 같은데... -> 어디서 변수가 어디서 받아온건지 확인하기에 좋다.
            var newItem;

            //create new ID
            if(data.allItems[type].length >0){
                ID = data.allItems[type][data.allItems[type].length -1].id +1;
            }else{
                ID =0;
            }

            //모든 입력(inc,exp)마다 id가 다르게 저장되어야하고 중복될 수 없다
            //[1,2,3,4,5]다음은 6이 와야하고
            //삭제되는 데이터 때문에 [1,3,4,7,8]과 같은 배열이 나올것이다.
            //따라서 새로 만들어지는 id는 기존 배열의 마지막 숫자 +1이어야한다.
            //id에 아무것도 안 들어가있는 상태일때는 undefined 발생 -> allItems 의 길이를 구하고

            //create new item based on 'inc' or 'exp'
            if(type =='exp'){
                newItem = new Expense(ID,des,val);
            }else if(type =='inc'){
                newItem = new Income(ID,des,val);
            }
            //push it into data structure
            data.allItems[type].push(newItem);

            //return new element
            return newItem;

        },

        calculateBudget :function (){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget :income -expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round(( data.totals.exp / data.totals.inc ) * 100);
            }else{
                data.percentage =-1;
            }

            //expense = 100 and income 200, spent 50%

        },
        getBudget:function (){
            return{
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },
        //데이터를 받거나 보내주기만 하는 함수를 만든다.

        testing : function(){
            console.log(data);
        }
    };

})();
//클로저 내부에 있기 떄문에 budgetController에 정의된 변수들은 console 에서 출력하지 못한다.
//return의 budgetController.publicTest(a)는 접근이 가능함
//expense 함수를 클로저로 만들었기떄문에 접근 불가 -> 테스트 할때만 함수 밖에 놔서 확인후 삭제

//UIController
var UIcontroller = (function(){

    var DOMstrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer :'.income__list',
        expensesContainer :'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel :'.budget__income--value',
        expensesLabel :'.budget__expenses--value',
        percentageLabel :'.budget__expenses--percentage'
    };
    //input box에 입력한 데이터가 expence,income 박스에 넣어져야한다.
    return{
        getInput: function(){
            return{
                //property 정의는 :로 한다. 
                 type : document.querySelector(DOMstrings.inputType).value,
                //value WILL be either +, -
                 description : document.querySelector(DOMstrings.inputDescription).value,
                 value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
                //이게 더 길지 않나 보기 힘들고...?- 다른 controller에서 사용하기 용이하게 DOMstrings에 정리하고 return으로 반환함
            };

        },

        addListItem : function(obj,type){
            var html,newHtml,element;

            //Create HTML string with placeholder text
            if(type ==='inc'){
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div ' +
                'class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button' +
                'class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
                //""로 작성하면 string으로 인식한다. ''은 아님

            }else if(type ==='exp'){
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div'+
                'class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div'+
                'class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace placeholder text with actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            //insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        clearFields :function(){
            var fields,fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            //field.slice()하고 싶지만 list형이라 불가능 -> array형태로 바꿔준다

            fieldsArr.forEach(function (current,index,array){
                current.value = "";
                //clear the fields
            });
            //모든 field를 한번에 삭제해주는 함수
            fieldsArr[0].focus();
            //field가 모두 정리되고 다시 데이터를 입력하기 용이하게 만들어준다

        },
        //입력버튼을 누르고 input field에 남은 데이터를 삭제해줄 함수
        displayBudget:function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+ '%';

            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent ='---';

            }
        },
        getDomstrings:function(){
            return DOMstrings;
        }
    };
})();
//각 기능을 분리했기때문에 모듈이 독립적으로 작동한다. - separation of concerns


//Global App Controller
var controller = (function(budgetCtrl,UICtrl){

    var setupEventListeners = function(){

        var DOM = UICtrl.getDomstrings();
        //DOM이 eventlistener에서만 필요하기 떄문에 함수 안에 넣어놓는다

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        //DOMstrings.inputBtn이 아니라 DOM.inputBtn이다. controller로 오면서 변수명을 바꿨기 때문

        document.addEventListener('keypress',function(event){
            if(event.code ==='Enter'){
                //키보드 이벤트
                ctrlAddItem();

            }
        });
    };
    //왜 initialization function을 만들어야하는지 알아보자
    //코드가 흩어져보이니까 eventListener로 모음
    var updateBudget = function(){

        //1. calculate the budget
        budgetCtrl.calculateBudget();

        //2. return the budget
        var budget = budgetCtrl.getBudget();

        //3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function (){
        var input, newItem;

        //1.Get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0 ){
            //2.add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);

            //3.add the item to the UI
            UICtrl.addListItem(newItem,input.type);

            //4.clear the fields
            UICtrl.clearFields();

            //5.calculate and update budget
            updateBudget();
        }

    };

    return {
        init:function (){
            console.log('application has started');
            UICtrl.displayBudget({
                budget : 0,
                totalInc :0,
                totalExp : 0,
                percentage : -1
            });
            //
            setupEventListeners();
        }
    };

})(budgetController,UIcontroller);


controller.init();
//함수 밖에 있는 유일한 함수가 될것임


