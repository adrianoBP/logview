window.setInterval(function(){
    GetData();
}, 2500);

function GetData(){
    var request = new XMLHttpRequest();
    request.open('GET', 'https://projectsherlock.ddns.net/uk/Linnworks/ChannelIntegration/Helper/log.txt');
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                PupulateTable(request.responseText);
            }
        }
    }
}

GetData();

var logTable = document.getElementById("logTable");
var dict = [];

function PupulateTable(text){
    ClearTable();
    let lines = text.split('\n');

    let limit = lines.length - 1;

    if(lines.length > 500){
        limit = 500;
    }

    for(let i = lines.length - limit; i < lines.length; i++){
        var items = lines[i].split(']');
        if(items.length >= 4){
            let newRow   = logTable.insertRow(0);
            var currentId = "R"+i;
            newRow.id += currentId;

            var status = items[0].replace('[','');

            let newText1  = document.createTextNode(status);
            let newText2  = document.createTextNode(items[1].replace('[',''));
            let newText3  = document.createTextNode(items[2].replace('[',''));
            let newText4  = document.createTextNode(items[3].replace('[',''));

            newText1.id += "R"+i;
            newText2.id += "R"+i;
            newText3.id += "R"+i;
            newText4.id += "R"+i;

            let newHeader1  = newRow.insertCell(0);
            let newHeader2  = newRow.insertCell(1);
            let newHeader3  = newRow.insertCell(2);
            let newHeader4  = newRow.insertCell(3);

            switch(status){
                case "DEBUG":
                    newHeader1.style.color = "#111";
                    break;
                case "INFO":
                    newHeader1.style.fontWeight = "bold";
                    newHeader1.style.color = "#0D47A1";
                    break;
                case "WARNING":
                    newHeader1.style.fontWeight = "bold";
                    newHeader1.style.color = "#E65100";
                    break;
                case "ERROR":
                    newHeader1.style.fontWeight = "bold";
                    newHeader1.style.color = "#b71c1c";
                    break;
            }

            newHeader1.appendChild(newText1);
            newHeader2.appendChild(newText2);
            newHeader3.appendChild(newText3);
            newHeader4.appendChild(newText4);

            var message = "";
            for(let i = 4; i<items.length; i++){
                message += "]"+items[i];
            }

            dict[currentId] = message;

            newRow.onclick = function(myrow){
                let responseObject = ParseToJson(dict[myrow.path[1].id]);
                if(responseObject.response != ""){
                    swal(responseObject.message, "", {
                        buttons: {
                            request: "Request",
                            response: "Response"
                        }
                    })
                        .then((value) => {
                            switch(value){
                                case "request":
                                    swal(responseObject.request);
                                    break;
                                case "response":
                                    swal(responseObject.response);
                                    break;
                            }
                        });
                }else if(responseObject.request != ""){
                    swal(responseObject.message, "", {
                        buttons: {
                            request: "Request"
                        }
                    })
                        .then((value) => {
                            switch(value){
                                case "request":
                                    swal(responseObject.request);
                                    break;
                            }
                        });
                }else{
                    swal(responseObject.message, "");
                }
                // if(dict[myrow.path[1].id].substring(2).replace("|", "\n").length > 875){
                //     console.log(responseObject);
                //     swal(responseObject.message, responseObject.request);
                // }else{
                //     swal(responseObject.message, responseObject.request);
                // }
            }
        }
    }
    AddTableHeader();

}

function AddTableHeader(){

    let newRow   = logTable.insertRow(0);

    newRow.style.fontWeight = "bold";

    let newText1  = document.createTextNode('Type');
    let newText2  = document.createTextNode('Time');
    let newText3  = document.createTextNode('Token');
    let newText4  = document.createTextNode('Method');

    let newHeader1  = newRow.insertCell(0);
    let newHeader2  = newRow.insertCell(1);
    let newHeader3  = newRow.insertCell(2);
    let newHeader4  = newRow.insertCell(3);

    newHeader1.appendChild(newText1);
    newHeader2.appendChild(newText2);
    newHeader3.appendChild(newText3);
    newHeader4.appendChild(newText4);
}

function ClearTable(){
    $("#logTable tr").remove();
}

function ParseToJson(text){
    var myObject = {};
    var elements = text.split("|");
    var mainMessage = elements[0].substr(3);
    switch(elements.length){
        case 2:
            myObject = { message:mainMessage, request:elements[1].substr(10), response:""};
            break;
        case 3:
            myObject = { message:mainMessage, request:elements[1].substr(10), response:elements[2].substr(10)};
            break;
        default:
            myObject = { message:mainMessage, request:"", response:""};

    }
    return myObject;
}
