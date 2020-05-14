$(document).ready(function () {
  // Executar funções principais
  var clientes = clientesCadastros();
  var historico = historicoCompras();

  // Funções executadas ao carregar a página
  maiorTotalCompras(clientes, historico);
  maiorCompraUnica(clientes, historico);
  clientesMaisFieis(clientes, historico);
});

function maiorTotalCompras(clientes, historico) {
  // Ordenação do Array
  for (var i = 0; i < clientes.length; i++) {
    var cpfCliente = clientes[i].cpf;
    var valor = 0;

    for (var k = 0; k < historico.length; k++) {
      if (historico[k].cliente == cpfCliente && historico[k].valorTotal >= 0) {
        valor = valor + historico[k].valorTotal;
      };
    };

    clientes[i].valorTotal = valor;
  };

  clientes.sort(ordenarMaiorMenorValorTotal);

  // Append no HTML
  clientes.forEach(function (item, index) {
    $('#clienteValorTotal ul').append('<li class="list-group-item d-flex flex-column align-items-center justify-content-center">' + (index + 1) + 'º ' + item.nome + '<br><span class="card-subtitle text-muted">' + item.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) + '</span></li>');
  });
};

function maiorCompraUnica(clientes, historico) {
  // Ordenação do Array
  for (var i = 0; i < clientes.length; i++) {
    var cpfCliente = clientes[i].cpf;
    var maiorCompra = 0;

    for (var k = 0; k < historico.length; k++) {
      if (historico[k].cliente == cpfCliente && historico[k].valorTotal >= 0 && historico[k].data == '2016') {
        maiorCompra = historico[k].valorTotal;
      };
    };

    clientes[i].maiorCompra = maiorCompra;
  };

  clientes.sort(ordenarMaiorMenorCompraUnica);

  // Append no HTML
  $('#clienteCompraUnica').append('<p class="d-flex mb-0 align-items-center justify-content-center" <strong>' + clientes[0].nome + '&nbsp</strong> possui a maior compra única no último ano (2016),<strong>&nbspPARABÉNS!</strong></p>');
  $('#clienteCompraUnica').append('<p class="d-flex mb-0 align-items-center justify-content-center" <strong> Gastou um total de&nbsp <strong>' + clientes[0].maiorCompra.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) + '</strong>.</p>');
};

function clientesMaisFieis(clientes, historico) {
  // Ordenação do Array
  for (var i = 0; i < clientes.length; i++) {
    var cpfCliente = clientes[i].cpf;
    var cont = 0;

    for (var k = 0; k < historico.length; k++) {
      if (historico[k].cliente == cpfCliente && historico[k].valorTotal >= 0) {
        cont = cont + 1;
      };
    };

    clientes[i].contador = cont;
  };

  clientes.sort(ordenarMaiorMenorClientesFieis);

  // Append no HTML
  clientes.forEach(function (item, index) {
    $('#clientesFieis ul').append('<li class="list-group-item d-flex flex-column align-items-center justify-content-center">' + (index + 1) + 'º ' + item.nome + '<br><span class="card-subtitle text-muted">' + item.contador + ' vezes</span></li>');
  });
}

function recomendarProduto() {
  var clientes = clientesCadastros();
  var historico = historicoCompras();
  var cpf = ''
  var existe = false;
  var validacao = false;

  for (var i = 0; i < clientes.length; i++) {
    if ($('#usrname').val() == clientes[i].nome) {
      cpf = clientes[i].cpf;
      existe = true;

      $('#myModal').fadeOut();
      $('.modal-backdrop').fadeOut();
      break;
    };
  };

  if (existe) {
    for (var k = 0; k < historico.length; k++) {
      if (cpf == historico[k].cliente) {
        $('#cliente').append('Olá ' + $('#usrname').val());
        $('#lista').append('<li><strong>Vinho: </strong>' + historico[k].itens[0].produto);
        $('#lista').append('<li><strong>País: </strong>' + historico[k].itens[0].pais);
        $('#lista').append('<li><strong>Safra: </strong>' + historico[k].itens[0].safra);
        $('#lista').append('<li><strong>Preço: </strong> R$ ' + historico[k].itens[0].preco);
        $('.oferta').fadeIn();

        $('.close').click(function () {
          $('.oferta').fadeOut();
        });

        validacao = true
        break;
      };
    };
  };

  if (!validacao) {
    $('.alert').fadeIn();
  };

  $('#usrname').val('');
  $('#psw').val('');
};

function clientesCadastros() {
  var clientes = [];

  $.ajax(
    {
      type: 'GET',
      url: 'http://www.mocky.io/v2/598b16291100004705515ec5',
      dataType: 'json',
      crossDomain: true,
      async: false,
      success: function (cont) {
        for (var i = 0; i < cont.length; i++) {
          clientes.push(cont[i]);
        };
      }
    });

  return clientes;
};

function historicoCompras() {
  var historico = [];

  $.ajax(
    {
      type: 'GET',
      url: 'http://www.mocky.io/v2/598b16861100004905515ec7',
      dataType: 'json',
      crossDomain: true,
      async: false,
      success: function (cont) {
        for (var i = 0; i < cont.length; i++) {
          historico.push(cont[i]);
        }
      }
    });

  historico.forEach(function (item) {
    var cpf = item.cliente;
    var data = item.data;
    if (cpf.length > 14) {
      data = data.slice(6, 10)
      cpf = cpf.slice(1, 15);
      cpf = cpf.replace(/[^\d]/g, "");
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      item.cliente = cpf;
      item.data = data;
    };
  });

  return historico;
};

function ordenarMaiorMenorValorTotal(a, b) {
  if (a.valorTotal > b.valorTotal) {
    return -1;
  }
  if (a.valorTotal < b.valorTotal) {
    return 1;
  }
  return 0;
}

function ordenarMaiorMenorCompraUnica(a, b) {
  if (a.maiorCompra > b.maiorCompra) {
    return -1;
  }
  if (a.maiorCompra < b.maiorCompra) {
    return 1;
  }
  return 0;
}

function ordenarMaiorMenorClientesFieis(a, b) {
  if (a.contador > b.contador) {
    return -1;
  }
  if (a.contador < b.contador) {
    return 1;
  }
  return 0;
};