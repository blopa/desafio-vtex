function addField (argument) {
    var user = argument.name; // nome do usuario do github

    // verifica se o input das horas esta vazio, se tiver seta pra 0
    var totalHoras = document.getElementsByClassName('total-horas-' + user);
    if(totalHoras[0].value == ''){
        totalHoras[0].value = 0;
    }

    // pegando preço da hora do usuario
    var precoHora = document.getElementsByClassName('preco-hora-' + user);

    // determinando preço total pro carrinho, horas selecionadas * preço por hora
    var precoTotaluser = parseInt(totalHoras[0].value) * parseInt(precoHora[0].innerText);

    var check = document.getElementsByClassName("crt-remover-" + user).length;
    if(check == 0) { // verificando se ja existe o dev no carrinho
        var myTable = document.getElementById("carrinho");
        var userAvatar = document.getElementsByClassName('avatar-' + user);
        //var removerUser = 'remover-' + user;
        //var userName = user;
        var currentIndex = myTable.rows.length;
        var currentRow = myTable.insertRow(-1);

        // adicionando nova row pra tabela do carrinho com todos elementos necessarios
        var rowUseravatar = document.createElement("img");
        rowUseravatar.setAttribute("class", "avatar-user crt-avatar-user-" + user);
        rowUseravatar.setAttribute("src", userAvatar[0].src);

        var rowUsername = document.createElement("p");
        rowUsername.setAttribute("class", "user-name crt-user-" + user);
        rowUsername.innerHTML = user;

        var rowPrecohora = document.createElement("p");
        rowPrecohora.setAttribute("class", "moeda preco-hora crt-preco-hora-" + user);
        rowPrecohora.innerHTML = precoHora[0].innerText;

        var rowTotalhoras = document.createElement("p");
        rowTotalhoras.setAttribute("class", "total-horas crt-total-horas-" + user);
        rowTotalhoras.innerHTML = totalHoras[0].value;

        var rowprecoTotaluser = document.createElement("p");
        rowprecoTotaluser.setAttribute("class", "moeda preco-total-user crt-preco-total-" + user);
        rowprecoTotaluser.innerHTML = precoTotaluser;

        var rowRemoveuser = document.createElement("input");
        rowRemoveuser.setAttribute("name", user);
        rowRemoveuser.setAttribute("type", "button");
        rowRemoveuser.setAttribute("value", "Remover");
        rowRemoveuser.setAttribute("onclick", "removeFromcart(this);");
        rowRemoveuser.setAttribute("class", "btn btn-danger pull-right crt-remover-" + user);

        var currentCell = currentRow.insertCell(-1);
        currentCell.appendChild(rowUseravatar);

        currentCell = currentRow.insertCell(-1);
        currentCell.appendChild(rowUsername);

        currentCell = currentRow.insertCell(-1);
        currentCell.appendChild(rowPrecohora);

        currentCell = currentRow.insertCell(-1);
        currentCell.appendChild(rowTotalhoras);

        currentCell = currentRow.insertCell(-1);
        currentCell.appendChild(rowprecoTotaluser);

        currentCell = currentRow.insertCell(-1);
        currentCell.appendChild(rowRemoveuser);

        // atualizando subtotal do pedido
        var precoTotalcart = document.getElementsByClassName('preco-subtotal-cart');
        precoTotalcart[0].innerHTML = parseInt(precoTotalcart[0].innerHTML) + precoTotaluser;
    }
    else{ // caso dev ja esteja no carrinho, apenas adiciona as horas
        var atualizaTotalhoras = document.getElementsByClassName('crt-total-horas-' + user);
        atualizaTotalhoras[0].innerHTML = parseInt(atualizaTotalhoras[0].innerHTML) + parseInt(totalHoras[0].value);

        var precoTotalcart = document.getElementsByClassName('preco-subtotal-cart');
        precoTotalcart[0].innerHTML = parseInt(precoTotalcart[0].innerHTML) + precoTotaluser;

        var atualizaPrecototaluser = document.getElementsByClassName('crt-preco-total-' + user);
        atualizaPrecototaluser[0].innerHTML = parseInt(atualizaPrecototaluser[0].innerHTML) + precoTotaluser;
    }
    updateTotal("update"); // atualiza total do pedido
}

function removeFromcart (argument) {
    var user = argument.name;

    var precoTotalcart = document.getElementsByClassName('preco-subtotal-cart');
    var removePrecototaluser = document.getElementsByClassName('crt-preco-total-' + user);
    precoTotalcart[0].innerHTML = parseInt(precoTotalcart[0].innerHTML) - parseInt(removePrecototaluser[0].innerHTML);

    // remove dev do carrinho
    var row = argument.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateTotal("update");
}

function addDesconto (argument){ // adiciona desconto no total do pedido
    var cupom = document.getElementsByClassName('cupom');
    if(cupom[0].value == "SHIPIT"){
        //var descontoAplicado = true;

        var tipoRequest = document.getElementsByClassName('crt-btn-desconto');
        tipoRequest[0].setAttribute("onclick", "removeDesconto(this);");
        tipoRequest[0].innerHTML = "Remover";
        cupom[0].disabled = true;
        updateTotal('addCupom');
    }
    else{
        var mensagemCupom = document.getElementsByClassName('mensagem-cupom');
        mensagemCupom[0].innerHTML = "Erro no cupom!";
    }
}

function removeDesconto (argument){ // remove desconto do total do pedido
    var cupom = document.getElementsByClassName('cupom');
    var tipoRequest = document.getElementsByClassName('crt-btn-desconto');
    tipoRequest[0].setAttribute("onclick", "addDesconto(this);");
    tipoRequest[0].innerHTML = "Inserir";
    cupom[0].disabled = false;
    cupom[0].value = "";
    updateTotal('removeCupom');
}

function updateTotal(argument){ // atualiza total usando acoes

    var acao = argument;
    var precoTotalcart = document.getElementsByClassName('preco-total-cart');
    var precoSubtotalcart = document.getElementsByClassName('preco-subtotal-cart');
    var mensagemCupom = document.getElementsByClassName('mensagem-cupom');

    if(acao == "addCupom"){
        var valorCupom = parseInt(precoSubtotalcart[0].innerHTML)* 0.25;
        precoTotalcart[0].innerHTML = parseInt(precoSubtotalcart[0].innerHTML) - valorCupom;
        mensagemCupom[0].innerHTML = "Desconto de R$ " + valorCupom;
    }
    if(acao == "removeCupom"){
        precoTotalcart[0].innerHTML = precoSubtotalcart[0].innerHTML;
        mensagemCupom[0].innerHTML = "";
    }
    if(acao == "update") {
        precoTotalcart[0].innerHTML = precoSubtotalcart[0].innerHTML;
    }
}