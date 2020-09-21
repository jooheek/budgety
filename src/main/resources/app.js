//공통화를 통해 코드를 정리한다 코드를 깨끗하고 보기 좋게 정리한다, 데이터 privacy 를 지킬 수 있다.
//UI Module/ Data Module /Controller Module로 나눈다


//BudgetController
var budgetController = (function(){



})();
//클로저 내부에 있기 떄문에 budgetController에 정의된 변수들은 console 에서 출력하지 못한다.
//return의 budgetController.publicTest(a)는 접근이 가능함

//UIController
var UIcontroller = (function(){

})();
//각 기능을 분리했기때문에 모듈이 독립적으로 작동한다. - seoaration of concerns


//Global App Controller
var controller = (function(budgetCtrl,UICtrl){

    var ctrlAddItem = function (){
        //1.Get the field input data

        //2.add the item to the budget controller

        //3.add the item to the UI

        //4. calculate the budget

        //5. display the budget on the UI
        console.log('it worked')
    }

 document.querySelector('.add__btn'),addEventListener('click',ctrlAddItem);

 document.addEventListener('keypress',function(event){

     if(event.keyCode ===13 || event.which === 13){
            ctrlAddItem();

     }
 });



})(budgetController,UIcontroller);