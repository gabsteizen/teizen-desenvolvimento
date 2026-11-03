
/* =====================================
   TECHSTORE - JAVASCRIPT
   Catálogo + Carrinho + LocalStorage
===================================== */

// CATÁLOGO DE PRODUTOS

const produtos = [
    {
        id: 1,
        nome: "VisionAR Glass",
        categoria: "Wearables",
        descricao: "Óculos inteligentes com GPS e tradução de idiomas em tempo real.",
        preco: 2499.90,
        imagem: "https://placehold.co/600x400/111a2b/00d9ff?text=VisionAR+Glass"
    },
    {
        id: 2,
        nome: "PulseTouch Pro",
        categoria: "Wearables",
        descricao: "Pulseira inteligente com vibrações direcionais para games.",
        preco: 899.90,
        imagem: "https://placehold.co/600x400/111a2b/00d9ff?text=PulseTouch+Pro"
    },
    {
        id: 3,
        nome: "AuraRing Control",
        categoria: "Wearables",
        descricao: "Anel inteligente que controla dispositivos através de gestos.",
        preco: 599.90,
        imagem: "https://placehold.co/600x400/111a2b/00d9ff?text=AuraRing+Control"
    },
    {
        id: 4,
        nome: "HoloDesk AI",
        categoria: "Casa Inteligente",
        descricao: "Assistente de mesa com projeção holográfica 3D interativa.",
        preco: 3499.90,
        imagem: "https://placehold.co/600x400/111a2b/00d9ff?text=HoloDesk+AI"
    },
    {
        id: 5,
        nome: "HydroSmart",
        categoria: "Casa Inteligente",
        descricao: "Garrafa inteligente com esterilização UV-C e lembrete de hidratação.",
        preco: 349.90,
        imagem: "https://placehold.co/600x400/111a2b/00d9ff?text=HydroSmart"
    },
    {
        id: 6,
        nome: "Orbital Sound",
        categoria: "Áudio Avançado",
        descricao: "Caixa de som flutuante com levitação magnética e indução.",
        preco: 1899.90,
        imagem: "https://placehold.co/600x400/111a2b/00d9ff?text=Orbital+Sound"
    }
];


// =====================================
// ELEMENTOS DO HTML
// =====================================

const gradeProdutos =
    document.getElementById("grade-produtos");

const itensCarrinho =
    document.getElementById("itens-carrinho");

const contador =
    document.getElementById("contador");

const totalItens =
    document.getElementById("total-itens");

const subtotal =
    document.getElementById("subtotal");

const valorTotal =
    document.getElementById("valor-total");

const pesquisa =
    document.getElementById("pesquisa");

const categoria =
    document.getElementById("categoria");

const resultado =
    document.getElementById("resultado");

const botaoLimpar =
    document.getElementById("limpar-carrinho");

const botaoFinalizar =
    document.getElementById("finalizar-compra");


// =====================================
// FORMATAÇÃO DE MOEDA
// =====================================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// =====================================
// SEMANA 2 - CATÁLOGO DINÂMICO
// =====================================

function mostrarProdutos(lista = produtos) {

    gradeProdutos.innerHTML = "";

    resultado.textContent =
        `${lista.length} produto(s) encontrado(s).`;

    if (lista.length === 0) {

        gradeProdutos.innerHTML = `
            <div class="carrinho-vazio">
                <span>⌕</span>
                <p>Nenhum produto encontrado.</p>
            </div>
        `;

        return;
    }

    lista.forEach(produto => {

        const card = document.createElement("article");

        card.className = "produto-card";

        card.innerHTML = `
            <div class="produto-imagem">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                    loading="lazy"
                >

                <span class="tag-produto">
                    ${produto.categoria}
                </span>

            </div>

            <div class="produto-info">

                <h3>${produto.nome}</h3>

                <p>${produto.descricao}</p>

                <div class="produto-rodape">

                    <span class="preco">
                        ${formatarMoeda(produto.preco)}
                    </span>

                    <button
                        class="botao-adicionar"
                        data-id="${produto.id}"
                    >
                        + Adicionar
                    </button>

                </div>

            </div>
        `;

        // Evento do botão de adicionar

        card.querySelector(".botao-adicionar")
            .addEventListener("click", () => {

                adicionarCarrinho(produto.id);

            });

        gradeProdutos.appendChild(card);

    });

}


// =====================================
// PESQUISA E FILTROS
// =====================================

function filtrarProdutos() {

    const textoPesquisa =
        pesquisa.value.trim().toLowerCase();

    const categoriaSelecionada =
        categoria.value;

    const produtosFiltrados = produtos.filter(produto => {

        const correspondeNome =
            produto.nome.toLowerCase()
                .includes(textoPesquisa);

        const correspondeCategoria =
            categoriaSelecionada === "todos" ||
            produto.categoria === categoriaSelecionada;

        return correspondeNome && correspondeCategoria;

    });

    mostrarProdutos(produtosFiltrados);

}

pesquisa.addEventListener("input", filtrarProdutos);

categoria.addEventListener("change", filtrarProdutos);


// =====================================
// SEMANA 3 - PERSISTÊNCIA
// =====================================

// Recupera os dados salvos no navegador

function carregarCarrinho() {

    try {

        const dadosSalvos =
            localStorage.getItem("techstore_carrinho");

        if (!dadosSalvos) {
            return [];
        }

        const dados = JSON.parse(dadosSalvos);

        if (!Array.isArray(dados)) {
            return [];
        }

        return dados.filter(item => {

            const produtoExiste =
                produtos.some(produto => produto.id === item.id);

            return produtoExiste &&
                Number.isInteger(item.quantidade) &&
                item.quantidade > 0;

        });

    } catch (erro) {

        console.error("Erro ao recuperar carrinho:", erro);

        return [];

    }

}


// Carrinho inicial

let carrinho = carregarCarrinho();


// Salva os dados no localStorage

function salvarCarrinho() {

    localStorage.setItem(
        "techstore_carrinho",
        JSON.stringify(carrinho)
    );

}


// =====================================
// ADICIONAR PRODUTOS
// =====================================

function adicionarCarrinho(id) {

    const produto =
        produtos.find(item => item.id === id);

    if (!produto) {
        return;
    }

    const itemExistente =
        carrinho.find(item => item.id === id);

    if (itemExistente) {

        itemExistente.quantidade++;

    } else {

        carrinho.push({

            id: produto.id,

            nome: produto.nome,

            categoria: produto.categoria,

            preco: produto.preco,

            imagem: produto.imagem,

            quantidade: 1

        });

    }

    salvarCarrinho();

    atualizarCarrinho();

}


// =====================================
// REMOVER PRODUTOS
// =====================================

function removerCarrinho(id) {

    const item =
        carrinho.find(item => item.id === id);

    if (!item) {
        return;
    }

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


// =====================================
// REMOVER ITEM COMPLETAMENTE
// =====================================

function excluirProduto(id) {

    carrinho = carrinho.filter(
        item => item.id !== id
    );

    salvarCarrinho();

    atualizarCarrinho();

}


// =====================================
// ATUALIZAÇÃO AUTOMÁTICA DO CARRINHO
// =====================================

function atualizarCarrinho() {

    itensCarrinho.innerHTML = "";

    let quantidadeTotal = 0;

    let valorTotalCarrinho = 0;


    // Verifica se o carrinho está vazio

    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `
            <div class="carrinho-vazio">

                <span>🛒</span>

                <p>
                    Seu carrinho está vazio.
                </p>

                <p>
                    Adicione seus gadgets favoritos!
                </p>

            </div>
        `;

    }


    // Percorre os produtos do carrinho

    carrinho.forEach(item => {

        quantidadeTotal += item.quantidade;

        valorTotalCarrinho +=
            item.preco * item.quantidade;


        const elemento =
            document.createElement("article");

        elemento.className = "item-carrinho";

        elemento.innerHTML = `

            <div class="item-info">

                <img
                    src="${item.imagem}"
                    alt="${item.nome}"
                >

                <div>

                    <h3>${item.nome}</h3>

                    <p>
                        ${formatarMoeda(item.preco)}
                        por unidade
                    </p>

                    <strong class="item-preco">

                        ${formatarMoeda(
                            item.preco * item.quantidade
                        )}

                    </strong>

                </div>

            </div>

            <div class="controles">

                <button
                    class="diminuir"
                    aria-label="Diminuir quantidade"
                >
                    −
                </button>

                <span>${item.quantidade}</span>

                <button
                    class="aumentar"
                    aria-label="Aumentar quantidade"
                >
                    +
                </button>

                <button
                    class="botao-remover"
                >
                    Excluir
                </button>

            </div>

        `;


        // Botão diminuir

        elemento.querySelector(".diminuir")
            .addEventListener("click", () => {

                removerCarrinho(item.id);

            });


        // Botão aumentar

        elemento.querySelector(".aumentar")
            .addEventListener("click", () => {

                adicionarCarrinho(item.id);

            });


        // Botão excluir

        elemento.querySelector(".botao-remover")
            .addEventListener("click", () => {

                excluirProduto(item.id);

            });


        itensCarrinho.appendChild(elemento);

    });


    // Atualiza os valores na tela

    contador.textContent = quantidadeTotal;

    totalItens.textContent = quantidadeTotal;

    subtotal.textContent =
        formatarMoeda(valorTotalCarrinho);

    valorTotal.textContent =
        formatarMoeda(valorTotalCarrinho);

}


// =====================================
// LIMPAR CARRINHO
// =====================================

function limparCarrinho() {

    if (carrinho.length === 0) {

        alert("O carrinho já está vazio!");

        return;

    }

    const confirmar = confirm(
        "Deseja realmente limpar o carrinho?"
    );

    if (confirmar) {

        carrinho = [];

        salvarCarrinho();

        atualizarCarrinho();

    }

}

botaoLimpar.addEventListener(
    "click",
    limparCarrinho
);


// =====================================
// FINALIZAR COMPRA
// =====================================

botaoFinalizar.addEventListener("click", () => {

    if (carrinho.length === 0) {

        alert("Adicione produtos antes de finalizar!");

        return;

    }

    alert(
        "Compra demonstrativa finalizada!\n\n" +
        "Valor total: " + valorTotal.textContent
    );

});


// =====================================
// INICIALIZAÇÃO
// =====================================

mostrarProdutos();

atualizarCarrinho();
