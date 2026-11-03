// ======================================
// SEMANA 3 - PERSISTÊNCIA DO CARRINHO
// ======================================

// Recuperar carrinho salvo no navegador
let carrinho = JSON.parse(
    localStorage.getItem("techstore_carrinho")
) || [];


// Salvar carrinho no localStorage
function salvarCarrinho() {

    localStorage.setItem(
        "techstore_carrinho",
        JSON.stringify(carrinho)
    );

}


// Adicionar produto ao carrinho
function adicionarCarrinho(id) {

    const produto = produtos.find(
        item => item.id === id
    );

    if (!produto) return;

    const itemExistente = carrinho.find(
        item => item.id === id
    );

    if (itemExistente) {

        itemExistente.quantidade++;

    } else {

        carrinho.push({
            ...produto,
            quantidade: 1
        });

    }

    salvarCarrinho();
    atualizarCarrinho();

}


// Remover produto do carrinho
function removerCarrinho(id) {

    const item = carrinho.find(
        item => item.id === id
    );

    if (!item) return;

    if (item.quantidade > 1) {

        item.quantidade--;

    } else {

        carrinho = carrinho.filter(
            item => item.id !== id
        );

    }

    salvarCarrinho();
    atualizarCarrinho();

}


// Calcular valor total automaticamente
function calcularTotal() {

    return carrinho.reduce(
        (total, item) => {
            return total + item.preco * item.quantidade;
        },
        0
    );

}


// Atualizar carrinho na tela
function atualizarCarrinho() {

    const container =
        document.getElementById("itens-carrinho");

    container.innerHTML = "";

    let quantidadeTotal = 0;

    carrinho.forEach(item => {

        quantidadeTotal += item.quantidade;

        const elemento = document.createElement("div");

        elemento.className = "item-carrinho";

        elemento.innerHTML = `
            <div>
                <h3>${item.nome}</h3>

                <p>
                    Quantidade: ${item.quantidade}
                </p>

                <strong>
                    ${(item.preco * item.quantidade)
                        .toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                </strong>
            </div>

            <button
                onclick="removerCarrinho(${item.id})"
                class="botao-remover"
            >
                Remover
            </button>
        `;

        container.appendChild(elemento);

    });


    // Exibir mensagem se estiver vazio
    if (carrinho.length === 0) {

        container.innerHTML = `
            <p>Seu carrinho está vazio.</p>
        `;

    }


    // Atualizar quantidade de itens
    document.getElementById("contador").textContent =
        quantidadeTotal;

    document.getElementById("total-itens").textContent =
        quantidadeTotal;


    // Atualizar valor total
    document.getElementById("valor-total").textContent =
        calcularTotal().toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

}


// Limpar carrinho
function limparCarrinho() {

    carrinho = [];

    salvarCarrinho();
    atualizarCarrinho();

}


// Inicializar carrinho ao abrir a página
document.getElementById("limpar-carrinho")
    .addEventListener("click", limparCarrinho);

atualizarCarrinho();