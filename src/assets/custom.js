function add2(main, arr, ans){
    for(var i = 0; i < $("#" + main + " .test").length; i++){
        var val = $("#" + main + " .test").eq(i);
        for(var j = 0; j < val.find("fieldset").length; j++){
            var part = val.find("fieldset").eq(j);
            var test = true;
            for(var k = 0; k < arr.length; k++){
                if(!$.isNumeric(arr[k])){
                    if(part.find("." + arr[k]).eq(0).hasClass("ng-invalid")){
                        test = false;
                    }
                }
            }
            var sum = 0;
            if(test){
                for(k = 0; k < arr.length; k++){
                    if($.isNumeric(arr[k])){
                        sum = sum + Number(arr[k]);
                    } else if($.type(arr[k]) === "string") {
                        sum = sum + Number(part.find("." + arr[k]).eq(0).val());
                    } else {
                        if(arr[k][0] == "sub"){
                            sum = sum + sub3(arr[k][1], arr[k][2], i);
                        } else if(arr[k][0] == "div"){
                            sum = sum + div3(arr[k][1], arr[k][2], i);
                        } else if(arr[k][0] == "mul"){
                            sum = sum + mul3(arr[k][1], arr[k][2], i);
                        }
                    }
                }
                part.find("." + ans).eq(0).val(sum.toFixed(2));
            }
        }
    }
}
function sub2(main, arr, ans){
    for(var i = 0; i < $("#" + main + " .test").length; i++){
        var val = $("#" + main + " .test").eq(i);
        for(var j = 0; j < val.find("fieldset").length; j++){
            var part = val.find("fieldset").eq(j);
            var test = true;
            for(var k = 0; k < arr.length; k++){
                if(!$.isNumeric(arr[k])){
                    if(part.find("." + arr[k]).eq(0).hasClass("ng-invalid")){
                        test = false;
                    }
                }
            }
            var diff;
            if(test){
                if($.isNumeric(arr[0])){
                    diff = Number(arr[0]);
                } else if($.type(arr[0]) === "string") {
                    diff = Number(part.find("." + arr[0]).eq(0).val());
                } else {
                    if(arr[k][0] == "add"){
                        diff = add3(arr[k][1], arr[k][2], i);
                    } else if(arr[0][0] == "div"){
                        diff = div3(arr[0][1], arr[0][2], i);
                    } else if(arr[0][0] == "mul"){
                        diff = mul3(arr[0][1], arr[0][2], i);
                    }
                }
                for(k = 1; k < arr.length; k++){
                    if($.isNumeric(arr[k])){
                        diff = diff - Number(arr[k]);
                    } else if($.type(arr[k]) === "string") {
                        diff = diff - Number(part.find("." + arr[k]).eq(0).val());
                    } else {
                        if(arr[k][0] == "add"){
                            diff = diff - add3(arr[k][1], arr[k][2], i);
                        } else if(arr[k][0] == "div"){
                            diff = diff - div3(arr[k][1], arr[k][2], i);
                        } else if(arr[k][0] == "mul"){
                            diff = diff - mul3(arr[k][1], arr[k][2], i);
                        }
                    }
                }
                part.find("." + ans).eq(0).val(diff.toFixed(2));
            }
        }
    }
}
function div2(main, arr, ans){
    for(var i = 0; i < $("#" + main + " .test").length; i++){
        var val = $("#" + main + " .test").eq(i);
        for(var j = 0; j < val.find("fieldset").length; j++){
            var part = val.find("fieldset").eq(j);
            var test = true;
            for(var k = 0; k < arr.length; k++){
                if(!$.isNumeric(arr[k])){
                    if(!part.find("." + arr[k]).eq(0).hasClass("ng-invalid")){
                        test = false;
                    }
                }
            }
            var div;
            if(test){
                if($.isNumeric(arr[0])){
                    div = Number(arr[0]);
                } else if($.type(arr[k]) === "string") {
                    div = Number(part.find("." + arr[k]).eq(0).val());
                } else {
                    if(arr[k][0] == "add"){
                        div = add3(arr[k][1], arr[k][2], i);
                    } else if(arr[k][0] == "sub"){
                        div = sub3(arr[k][1], arr[k][2], i);
                    } else if(arr[k][0] == "mul"){
                        div = mul3(arr[k][1], arr[k][2], i);
                    }
                }
                for(k = 1; k < arr.length; k++){
                    if($.isNumeric(arr[k])){
                        div = div / Number(arr[k]);
                    } else if($.type(arr[k]) === "string") {
                        div = div / Number(part.find("." + arr[k]).eq(0).val());
                    } else {
                        if(arr[k][0] == "add"){
                            div = div / add3(arr[k][1], arr[k][2], i);
                        } else if(arr[k][0] == "sub"){
                            div = div / sub3(arr[k][1], arr[k][2], i);
                        } else if(arr[k][0] == "mul"){
                            div = div / mul3(arr[k][1], arr[k][2], i);
                        }
                    }
                }
                part.find("." + ans).eq(0).val(div.toFixed(2));
            }
        }
    }
}
function mul2(main, arr, ans){
    for(var i = 0; i < $("#" + main + " .test").length; i++){
        var val = $("#" + main + " .test").eq(i);
        for(var j = 0; j < val.find("fieldset").length; j++){
            var part = val.find("fieldset").eq(j);
            var test = true;
            for(var k = 0; k < arr.length; k++){
                if(!$.isNumeric(arr[k])){
                    if(part.find("." + arr[k]).eq(0).hasClass("ng-invalid")){
                        test = false;
                    }
                }
            }
            var prod = 1;
            if(test){
                for(k = 0; k < arr.length; k++){
                    if($.isNumeric(arr[k])){
                        prod = prod * Number(arr[k]);
                    } else if($.type(arr[k]) === "string") {
                        prod = prod * Number(part.find("." + arr[k]).eq(0).val());
                    } else {
                        if(arr[k][0] == "add"){
                            prod = prod * add3(arr[k][1], arr[k][2], i);
                        } else if(arr[k][0] == "sub"){
                            prod = prod * sub3(arr[k][1], arr[k][2], i);
                        } else if(arr[k][0] == "div"){
                            prod = prod * div3(arr[k][1], arr[k][2], i);
                        }
                    }
                }
                part.find("." + ans).eq(0).val(prod.toFixed(2));
            }
        }
    }
}

function add3(main, arr, i){
    var val = $("#" + main + " .test").eq(i);
    for(var j = 0; j < val.find("fieldset").length; j++){
        var part = val.find("fieldset").eq(j);
        var test = true;
        for(var k = 0; k < arr.length; k++){
            if(!$.isNumeric(arr[k])){
                if(part.find("." + arr[k]).eq(0).hasClass("ng-invalid")){
                    test = false;
                }
            }
        }
        var sum = 0;
        if(test){
            for(k = 0; k < arr.length; k++){
                if($.isNumeric(arr[k])){
                    sum = sum + Number(arr[k]);
                } else {
                    sum = sum + Number(part.find("." + arr[k]).eq(0).val());
                }
            }
            return sum;
        }
    }
}
function sub3(main, arr, i){
    var val = $("#" + main + " .test").eq(i);
    for(var j = 0; j < val.find("fieldset").length; j++){
        var part = val.find("fieldset").eq(j);
        var test = true;
        for(var k = 0; k < arr.length; k++){
            if(!$.isNumeric(arr[k])){
                if(part.find("." + arr[k]).eq(0).hasClass("ng-invalid")){
                    test = false;
                }
            }
        }
        var diff;
        if(test){
            if($.isNumeric(arr[0])){
                diff = Number(arr[0]);
            } else {
                diff = Number(part.find("." + arr[0]).eq(0).val());
            }
            for(k = 1; k < arr.length; k++){
                if($.isNumeric(arr[k])){
                    diff = diff - Number(arr[k]);
                } else {
                    diff = diff - Number(part.find("." + arr[k]).eq(0).val());
                }
            }
            return diff;
        }
    }
}
function div3(main, arr, i){
    var val = $("#" + main + " .test").eq(i);
    for(var j = 0; j < val.find("fieldset").length; j++){
        var part = val.find("fieldset").eq(j);
        var test = true;
        for(var k = 0; k < arr.length; k++){
            if(!$.isNumeric(arr[k])){
                if(part.find("." + arr[k]).eq(0).hasClass("ng-invalid")){
                    test = false;
                }
            }
        }
        var div;
        if(test){
            if($.isNumeric(arr[0])){
                div = Number(arr[0]);
            } else {
                div = Number(part.find("." + arr[0]).eq(0).val());
            }
            for(k = 1; k < arr.length; k++){
                if($.isNumeric(arr[k])){
                    div = div / Number(arr[k]);
                } else {
                    div = div / Number(part.find("." + arr[k]).eq(0).val());
                }
            }
            return div;
        }
    }
}
function mul3(main, arr, i){
    var val = $("#" + main + " .test").eq(i);
    for(var j = 0; j < val.find("fieldset").length; j++){
        var part = val.find("fieldset").eq(j);
        var test = true;
        for(var k = 0; k < arr.length; k++){
            if(!$.isNumeric(arr[k])){
                if(part.find("." + arr[k]).eq(0).hasClass("ng-invalid")){
                    test = false;
                }
            }
        }
        var prod = 1;
        if(test){
            for(k = 0; k < arr.length; k++){
                if($.isNumeric(arr[k])){
                    prod = prod * Number(arr[k]);
                } else {
                    prod = prod * Number(part.find("." + arr[k]).eq(0).val());
                }
            }
            return prod
        }
    }
}
$("input").keyup(function(){
    var this_ref = this;
    if($(this_ref).hasClass("ng-invalid")){
        $(this_ref).css("border-left-width","5px");
        $(this_ref).css("border-left-color","red");
    } else {
        $(this_ref).css("border-left-width","");
        $(this_ref).css("border-left-color","");
    }
});
$("select").change(function(){
    var this_ref = this;
    if($(this_ref).hasClass("ng-invalid")){
        $(this_ref).css("border-left-width","5px");
        $(this_ref).css("border-left-color","red");
    } else {
        $(this_ref).css("border-left-width","");
        $(this_ref).css("border-left-color","");
    }
});