
String.prototype.escape = function() {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot',
        "'": '&#x27',
        "/\//": '&#x2F',
        '/': '&#x2F',
        "/\//g": " ",
        ' ': "",
        '$': ""
                };
    return this.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};
String.prototype.sanitize = function() {
  var result = this.replace(/\//g,"").escape();
  result = result.replace(/<|>|&|%|;|'|"| /g,"").toUpperCase();
  return result;
}

var formatMoney = function (num) {
      var str = num.toString().replace("$", "");
      var parts = false,
          output = [],
          i = 1,
          formatted = null;
          str = str.replace(" ", "");
          str = str.replace(/NaN/g, "0");
      if (str.indexOf(".") > 0) {
          parts = str.split(".");
          str = parts[0];
      }
      str = str.split("").reverse();
      for (var j = 0, len = str.length; j < len; j++) {
          if (str[j] != ",") {
              output.push(str[j]);
              if (i % 3 == 0 && j < (len - 1)) {
                  output.push(",");
              }
              i++;
          }
      }
      formatted = output.reverse().join("");
      return ("$" + formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
  };

      var unformatMoney = function(formatted){
        var unformatted =  formatted.replace(/,/g, '');
        unformatted = unformatted.replace(/$/g, '');
        if(isNaN(unformatted))
      		return unformatted;

        return parseFloat(unformatted);
      };

function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}

function inputChanged(element) {
	var termMonths = document.getElementById("termmonths");
	var termYears = document.getElementById("termyears");
	var downPay = document.getElementById("downpay");
	var downPercent = document.getElementById("downpercent");
	var price = document.getElementById("price");
  var interest = document.getElementById("interest");
  var tax = document.getElementById("tax");
	switch(element) {case termMonths: termMonths.value = termMonths.value.sanitize(); termYears.value = parseFloat(termMonths.value.replace(/\//g," ").sanitize()) / 12.00;  break;
			 case termYears: termYears.value = termYears.value.sanitize(); termMonths.value = parseFloat(termYears.value.replace(/\//g," ").sanitize()) * 12.00; break;
			 case downPay: downPay.value = downPay.value.sanitize(); downPercent.value =  (100 * parseFloat(unformatMoney(downPay.value.replace(/\//g,"").sanitize())) / parseFloat(unformatMoney(price.value.replace(/\//g,"").sanitize()))).toFixed(2); break;
			 case downPercent: downPercent.value = downPercent.value.sanitize(); downPay.value =  0.01 * parseFloat(downPercent.value.sanitize().replace(/\//g," ")) * parseFloat(unformatMoney(price.value.replace(/\//g," ").sanitize())); break;
			 case price: price.value = price.value.sanitize(); downPercent.value =    (100 * parseFloat(unformatMoney(downPay.value.replace(/\//g,"").sanitize())) / parseFloat(unformatMoney(price.value.replace(/\//g,"").sanitize()))).toFixed(2); break;
			 case interest: interest.value = interest.value.sanitize(); break;
       case tax: tax.value = tax.value.sanitize(); tax.value = formatMoney(tax.value.replace(/\//g,"").sanitize()).replace("$","") ;break;
       default: element.value = element.value.sanitize();}
       downPay.value = formatMoney(unformatMoney(downPay.value)).substring(1);
       downPercent.value = downPercent.value.replace(/%/g, "").replace("NaN", "");
       price.value = formatMoney(unformatMoney(price.value)).substring(1);
            //alert("price:  " + unformatMoney(price.value).toString() + "  ; down: " + unformatMoney(downPay.value).toString() + "  ; MATH: " + unformatMoney(downPay.value) / unformatMoney(price.value)  );
       termYears.value = formatMoney(unformatMoney(termYears.value)).substring(1);
       termMonths.value = formatMoney(unformatMoney(termMonths.value)).substring(1);
       interest.value = interest.value.replace(/\//g," ").sanitize();
       if (isNaN(downPercent.value)) {downPercent.value == "";}
}

var btnCalculate = document.getElementById("btnCalculate");
var lblPayment = document.getElementById("payment");

addEvent(document.getElementById("btnCalculate"), "click", calculatePMT());
$('#termmonths,#termyears,#downpay,#downpercent,#price,#interest,#tax').keyup(function() {inputChanged(this);})
//$('#termmonths,#termyears,#downpay,#downpercent,#price,#interest').keydown(function() {inputChanged(this);})

$('#btnCalculate').click(function() {	calculatePMT();	});
$('#btnShowGrid').click(function() {gridDisplay();});
function calculatePMT()  {
    clearRows();
    document.getElementById('btnShowGrid').innerHTML = "Show Amortization Table";
    document.getElementById('amortization').style.visibility = "hidden";
		var price = document.getElementById("price").value;
		price = price.replace(/\//g," ");
		var downPay = document.getElementById("downpay").value.sanitize();
		downPay = downPay.replace(/\//g," ");
		var termMonths = document.getElementById("termmonths").value.sanitize();
		termMonths = termMonths.replace(/\//g,"");
		var interest = document.getElementById("interest").value.sanitize().replace(/%/g,"") ;
		interest = interest.replace(/\//g," ");
		interest = parseFloat(interest)/12;
		var lblPayment = document.getElementById("payment");
		lblPayment.innerHTML = formatMoney((interest/100) / (1 - (Math.pow(1 + interest/100, -parseFloat(unformatMoney(termMonths))))) * (unformatMoney(price) - unformatMoney(downPay)));
		var lblTotalPayment = document.getElementById("totalpayment");
    var tax = document.getElementById('tax').value.replace(/\//g,"").replace(/,/g,"").sanitize();
    tax = parseFloat(tax);
    price = unformatMoney(price);
    downPay= unformatMoney(downPay);
    //alert(parseFloat(lblTotalLoan.innerHTML.replace(/,/g,"").substring(1)));
    lblTotalPayment.innerHTML = formatMoney(parseFloat(termMonths.replace(/,/g,"")) * (parseFloat(lblPayment.innerHTML.replace(/,/g,"").substring(1) ) + tax));
    var lblTotalLoan = document.getElementById("totalloanpayment");
    var lblTotalInterest = document.getElementById("totalinterest");
    lblTotalLoan.innerHTML = formatMoney(unformatMoney(lblTotalPayment.innerHTML.replace("$", "")) - unformatMoney(termMonths) * tax);
    var totalLoan = parseFloat(lblTotalLoan.innerHTML.replace(/,/g,"").sanitize().substring(1));
    lblTotalInterest.innerHTML = formatMoney(totalLoan - (price - downPay));

          }
function clearRows() {
var elmtTable = document.getElementById('amortization');
var tableRows = elmtTable.getElementsByTagName('tr');
var rowCount = tableRows.length;

for (var x=rowCount-1; x>0; x--) {
   elmtTable.removeChild(tableRows[x]);
}
}
function gridDisplay() {
    clearRows();
    var btnVal = document.getElementById('btnShowGrid').innerHTML;
  if (btnVal == "Show Amortization Table") {
    calculatePMT();
    document.getElementById('amortization').style.visibility = "visible";
    document.getElementById('btnShowGrid').innerHTML = "Hide Amortization Table";
    var i = 0;
    for ( i =0; i<document.getElementById("termmonths").value.sanitize().replace(/\//g,"").replace(/,/g,"");i++)
    {
      newRow(i);
    }
  }
  else {
      document.getElementById('amortization').style.visibility = "hidden";
      document.getElementById('btnShowGrid').innerHTML = "Show Amortization Table";
    }
}
function newRow(n) {
  var result = [];

    var payment = document.getElementById("payment").innerHTML;
    payment = payment.replace(/\//g," ").replace(/,/g,"").replace("$","") ;
    var price = document.getElementById("price").value;
    price = price.replace(/\//g," ").replace(/,/g,"") ;
    var tax = document.getElementById("tax").value;
    tax = tax.replace(/\//g," ").replace(/,/g,"").replace("$","") ;
    var downPay = document.getElementById("downpay").value.sanitize();
    downPay = downPay.replace(/\//g," ").replace(/,/g,"") ;
    var termMonths = document.getElementById("termmonths").value.sanitize();
    termMonths = termMonths.replace(/\//g," ").replace(/,/g,"") ;
    var interest = document.getElementById("interest").value.sanitize().replace(/%/g,"") ;
    interest = interest.replace(/\//g," ").replace(/,/g,"") ;
    interest = parseFloat(interest)/12/100;
    var lblPayment = document.getElementById("payment");

  result.push(n + 1);
  var openingBal = parseFloat(price - downPay) *( Math.pow(1+interest, termMonths) - Math.pow(1+interest, n)) / ( Math.pow(1+interest, termMonths) - 1);
  result.push(openingBal);
  var interestPaid = openingBal * interest;
  result.push(interestPaid);
  var principalPaid =  payment - interestPaid;
  result.push(principalPaid) ;
  result.push(tax);
  result.push(parseFloat(principalPaid) + parseFloat(tax) + parseFloat(interestPaid));
  result.push(openingBal - principalPaid);
  addRow(result);
}
function addRow(array) {
var table = document.getElementById('amortization');
var row = document.createElement('tr');
for (var i =0; i < array.length; i++) {
  var cell = document.createElement('td');
  var data = array[i];
  switch(i) {
           case 0: cell.innerHTML = parseFloat(data); break;
           default: cell.innerHTML = formatMoney(parseFloat(data).toFixed(2));
         }
  row.appendChild(cell);
}
table.appendChild(row);


}
$("#balance,#interest,#minpay,#proppay").keyup(function () {
         var balVal = $('#balance').val().trim().sanitize();
         var intVal = $('#interest').val().trim().sanitize();
         var minVal = $('#minpay').val().trim().sanitize();
         var propVal = $('#proppay').val().trim().sanitize();

           $('#balance').val(formatMoney(unformatMoney(balVal)).replace("$", ""));
           $('#interest').val(intVal);
           $('#minpay').val(formatMoney(unformatMoney(minVal)).replace("$", ""));
           $('#proppay').val(formatMoney(unformatMoney(propVal)).replace("$", ""));

     });

var btnCalculate = document.getElementById("btnCalculate");


btnCalculate.addEventListener("click", btnClick);

function btnClick()  {
 var balance = document.getElementById("balance").value.sanitize();
 var interest = document.getElementById("interest").value.sanitize();
 var propPayment = document.getElementById("proppay").value.sanitize();
 var minPayment = document.getElementById("minpay").value.sanitize();
 var lblPropMonths = document.getElementById("propmonths");
 var lblMinMonths = document.getElementById("minmonths");
 var lblPropInterestPaid = document.getElementById("propinterestpay");
 var lblMinInterestPaid = document.getElementById("mininterestpay");
 balance = balance.replace(/\//g," ");
 interest = interest.replace(/\//g," ");
 interest = parseFloat(interest) / 12;
 propPayment = propPayment.replace(/\//g," ");
 minPayment = minPayment.replace(/\//g," ");
 var propMonths = Math.log10( unformatMoney(propPayment)/ ( unformatMoney(propPayment) - unformatMoney(balance) * (interest/100)))/ Math.log10(1 + (interest/100));
 var minMonths = Math.log10( unformatMoney(minPayment)/ ( unformatMoney(minPayment) - unformatMoney(balance) * (interest/100)))/ Math.log10(1 + (interest/100));
 lblPropMonths.innerHTML = formatMoney(propMonths).substring(1);
 lblMinMonths.innerHTML = formatMoney(minMonths).substring(1);

 lblPropInterestPaid.innerHTML = formatMoney((propMonths * unformatMoney(propPayment) - unformatMoney(balance)));
 lblMinInterestPaid.innerHTML= formatMoney((minMonths * unformatMoney(minPayment) - unformatMoney(balance)));
   }
 
