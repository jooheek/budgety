//공통화를 통해 코드를 정리한다 코드를 깨끗하고 보기 좋게 정리한다, 데이터 privacy 를 지킬 수 있다.
//UI Module/ Data Module /Controller Module로 나눈다

var budgetController = (function(){

    var x = 23;
    var add = function(a){
        return x+a;
    }
    return{
        publicTest :function(b){
            return add(b);
        }
    }

})();
//클로저 내부에 있기 떄문에 budgetController에 정의된 변수들은 console 에서 출력하지 못한다.
//return의 budgetController.publicTest(a)는 접근이 가능함


var UIcontroller = (function(){

})();
//각 기능을 분리했기때문에 모듈이 독립적으로 작동한다. - seoaration of concerns


var controller = (function(budgetCtrl,UICtrl){

    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic :function (){
            console.log(z);
        }
    }
})(budgetController,UIcontroller);