window.onload = function() {
    atualizaDadospg();
};

function atualizaDadospg(){
    var usersCarrinho = JSON.parse(localStorage.getItem("usersCarrinho"));
    var valorCupom = localStorage.getItem("valorCupom");
    if(usersCarrinho) {
        usersCarrinho.forEach(function(usuario){
            //var cartPrecohorauser = localStorage.getItem("cartPrecohorauser-" + usuario);
            //var cartTotalhoras = localStorage.getItem("cartTotalhoras-" + usuario);
            //var cartTotalhoras = localStorage.getItem("cartPrecototaluser-" + usuario);
            addField(usuario, 'true');
        });
    }
    if(valorCupom){
        atualizaCupom();
    }
}

function finalizarPedido(){

}

function addTocart(button){
    var user = button.dataset.user;
    addField(user);
    if(localStorage.getItem('valorCupom')){
        removeDesconto();
        atualizaCupom();
    }
}

function updateUserscarrinho(user){
    if(!localStorage.getItem("qntCarrinho")) {
        localStorage.setItem('qntCarrinho', 0);
    }
    if(!localStorage.getItem("usersCarrinho")) {
        var usersCarrinho = new Array();
    }
    else{
        var usersCarrinho = JSON.parse(localStorage.getItem("usersCarrinho"));
    }

    var qntCarrinho = parseInt(localStorage.getItem('qntCarrinho'));

    usersCarrinho[qntCarrinho] = user;
    localStorage.setItem('usersCarrinho', JSON.stringify(usersCarrinho));

    qntCarrinho++;
    localStorage.setItem('qntCarrinho', qntCarrinho);
}

function getJsondata(user){
    var xmlReq = new XMLHttpRequest();
    xmlReq.open('GET', '/user/?user=' + user, false);
    xmlReq.send(null);
    if (xmlReq.status == 200) {
        var jsonData = JSON.parse(xmlReq.responseText);
        return jsonData.preco;
    }
}

function addField (argument, pagereload) {
    var user = argument; // nome do usuario do github

    var totalHoras;
    var totalHorastemp = document.getElementsByClassName('total-horas-' + user);
    if(totalHorastemp[0].value == ''){ // verifica se o input das horas esta vazio, se tiver seta pra 0
        totalHoras = 0;
    }
    else{
        totalHoras = totalHorastemp[0].value;
    }
    if(pagereload) {
        totalHoras = localStorage.getItem("cartTotalhoras-" + user);
    }

    // pegando preço da hora do usuario
    //var precoHoratemp = document.getElementsByClassName('preco-hora-' + user);
    //var precoHora = precoHoratemp[0].innerText;
    var precoHora = getJsondata(user);

    // determinando preço total pro carrinho, horas selecionadas * preço por hora
    var precoTotaluser = parseInt(totalHoras) * parseInt(precoHora);

    var check = document.getElementsByClassName("crt-remover-" + user).length;
    if(check == 0) { // verificando se ja existe o dev no carrinho
        var userAvatar = document.getElementsByClassName('avatar-' + user);
        //var removerUser = 'remover-' + user;
        //var userName = user;
        if(!pagereload) {
            updateUserscarrinho(user);
        }

        var myTable = document.getElementById("carrinho");
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
        rowPrecohora.innerHTML = precoHora;

        var rowTotalhoras = document.createElement("p");
        rowTotalhoras.setAttribute("class", "total-horas crt-total-horas-" + user);
        rowTotalhoras.innerHTML = totalHoras;
        //createCookie('totalHoras-' + user, totalHoras[0].value, 1);
        localStorage.setItem('cartTotalhoras-' + user, totalHoras);

        var rowprecoTotaluser = document.createElement("p");
        rowprecoTotaluser.setAttribute("class", "moeda preco-total-user crt-preco-total-" + user);
        rowprecoTotaluser.innerHTML = precoTotaluser;
        //createCookie('precoTotaluser-' + user, precoTotaluser, 1);
        localStorage.setItem('cartPrecototaluser-' + user, precoTotaluser);

        var rowRemoveuser = document.createElement("input");
        rowRemoveuser.setAttribute("data-user", user);
        rowRemoveuser.setAttribute("id", "crt-btn-remove-" + user);
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
    }
    else{ // caso dev ja esteja no carrinho, apenas adiciona as horas
        var atualizaTotalhoras = document.getElementsByClassName('crt-total-horas-' + user);
        //var totalHorascookie = readCookie('totalHoras-' + user);
        var cartTotalhorasstorage = localStorage.getItem('cartTotalhoras-' + user);
        var atualizaDadostotalhoras = parseInt(totalHoras) + parseInt(cartTotalhorasstorage);
        atualizaTotalhoras[0].innerHTML = atualizaDadostotalhoras;
        localStorage.setItem('cartTotalhoras-' + user, atualizaDadostotalhoras);

        var atualizaPrecototaluser = document.getElementsByClassName('crt-preco-total-' + user);
        var atualizaPrecototaluserstorage = localStorage.getItem('cartPrecototaluser-' + user);
        var atualizaDadosprecototal = parseInt(atualizaPrecototaluserstorage) + precoTotaluser;
        atualizaPrecototaluser[0].innerHTML = atualizaDadosprecototal;
        localStorage.setItem('cartPrecototaluser-' + user, atualizaDadosprecototal);
    }
    // atualizando subtotal do pedido
    var tempSubtotal = document.getElementsByClassName('preco-subtotal-cart');
    var cartAtualizado;
    if(localStorage.getItem('precoSubtotalcart') && !pagereload){ // se ainda nao houve subtotal setado, set o subtotal a ser igual o total adicionado
        cartAtualizado = parseInt(localStorage.getItem('precoSubtotalcart')) + precoTotaluser;
    }
    else{
        cartAtualizado = precoTotaluser;
    }
    //var cartAtualizado = parseInt(tempSubtotal[0].innerHTML) + precoTotaluser;
    tempSubtotal[0].innerHTML = cartAtualizado;
    localStorage.setItem('precoSubtotalcart', cartAtualizado);
    updateTotal("update"); // atualiza total do pedido
}

function removeFromcart (argument) {
    var user = argument.dataset.user;

    var precoSubtotalcart = document.getElementsByClassName('preco-subtotal-cart');
    var precoSubtotalcartstorage = localStorage.getItem('precoSubtotalcart');
    //var removePrecototaluser = document.getElementsByClassName('crt-preco-total-' + user);
    var removePrecototaluser = localStorage.getItem('cartPrecototaluser-' + user);
    var atualizaPrecosubtotal = parseInt(precoSubtotalcartstorage) - parseInt(removePrecototaluser);
    precoSubtotalcart[0].innerHTML = atualizaPrecosubtotal;
    localStorage.setItem('precoSubtotalcart', atualizaPrecosubtotal);
    localStorage.setItem('cartPrecototaluser-' + user, 0);

    var usersCarrinho = JSON.parse(localStorage.getItem("usersCarrinho"));
    var userIndex = usersCarrinho.indexOf(user);
    usersCarrinho.splice(userIndex, 1);
    localStorage.setItem('usersCarrinho', JSON.stringify(usersCarrinho));

    var qntCarrinho = parseInt(localStorage.getItem('qntCarrinho')) - 1;
    localStorage.setItem('qntCarrinho', qntCarrinho);
    localStorage.removeItem('cartTotalhoras-' + user);

    // remove dev do carrinho
    var row = argument.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateTotal("update");
    if(localStorage.getItem('valorCupom')){
        removeDesconto();
        atualizaCupom();
    }
}


function atualizaCupom(){
    var campoCupom = document.getElementsByClassName('cupom');
    campoCupom[0].value = "SHIPIT";
    addDesconto();
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
    localStorage.removeItem('valorCupom');
    updateTotal('removeCupom');
}

function updateTotal(argument){ // atualiza total usando acoes

    var acao = argument;
    var precoTotalfinal;
    var precoTotalcart = document.getElementsByClassName('preco-total-cart');
    var precoSubtotalcart = localStorage.getItem('precoSubtotalcart');

    var mensagemCupom = document.getElementsByClassName('mensagem-cupom');

    if(acao == "addCupom"){
        var valorCupom = parseInt(precoSubtotalcart)* 0.25;
        localStorage.setItem('valorCupom', valorCupom);
        precoTotalfinal = parseInt(precoSubtotalcart) - valorCupom;
        mensagemCupom[0].innerHTML = "Desconto de R$ " + valorCupom;
    }
    if(acao == "removeCupom"){
        precoTotalfinal = precoSubtotalcart;
        mensagemCupom[0].innerHTML = "";
    }
    if(acao == "update") {
        precoTotalfinal = precoSubtotalcart;
        localStorage.setItem('precoTotalcart', precoTotalfinal);
    }
    precoTotalcart[0].innerHTML = precoTotalfinal;
    document.cookie = 'precoTotalcart=' + precoTotalfinal + '; path=/';
}