  function calcularPorcentagemConclusao(planoLeitura) {
    const dataAtual = new Date();
    const diaDoAno = Math.ceil((dataAtual - new Date(dataAtual.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000));
    const diasFaltando = planoLeitura.length - (diaDoAno % planoLeitura.length);
    const porcentagemConclusao = ((diaDoAno - 1) / planoLeitura.length) * 100; // Subtrai 1 para considerar que o dia atual ainda não foi concluído
    return { porcentagem: porcentagemConclusao, diasFaltando: diasFaltando };
  }
  
  // Verifica se o plano de leitura já está no armazenamento local
  const planoLeituraArmazenado = localStorage.getItem('planoLeitura');
  
  // Se não estiver, gera e salva o plano de leitura
  if (!planoLeituraArmazenado) {
    const totalCapitulos = 1189;
    const diasNoAno = 365;
    const capitulosPorDia = 3;
    const diasParaLerBiblia = Math.ceil(totalCapitulos / capitulosPorDia);
    const diasPorBloco = Math.ceil(diasParaLerBiblia / diasNoAno);
    const planoDeLeitura = [];
  
    let inicio = 1;
  
    for (let dia = 1; dia <= diasNoAno; dia++) {
      let capitulosParaDia = capitulosPorDia;
  
      if (dia === diasNoAno) {
        // Último dia pode ter menos capítulos para ajustar ao total
        capitulosParaDia = totalCapitulos - inicio + 1;
      }
  
      const sequenciaCapitulos = Array.from({ length: capitulosParaDia }, (_, i) => inicio + i);
  
      // Adiciona a referência das passagens no plano de leitura
      const referencias = sequenciaCapitulos.map(capitulo => `Gênesis ${capitulo}`);
  
      planoDeLeitura.push({
        dia: dia,
        sequencia: sequenciaCapitulos,
        referencia: referencias
      });
  
      inicio += capitulosParaDia;
    }
  
    try {
      localStorage.setItem('planoLeitura', JSON.stringify(planoDeLeitura));
      console.log('Plano de leitura gerado e armazenado com sucesso.');
    } catch (error) {
      console.error('Erro ao armazenar o plano de leitura no Local Storage:', error);
    }
  }
  
  //fun
  function mostrarDiario() {
    window.location.href = 'diario.html';
  }
  
  function carregarPlanoLeitura() {
    const planoLeitura = JSON.parse(localStorage.getItem('planoLeitura')) || [];
    const barraDeProgresso = document.getElementById('barraDeProgresso');
  
    if (!barraDeProgresso) {
      console.error('Elemento barraDeProgresso não encontrado.');
      return;
    }
  
    if (planoLeitura.length === 0) {
      barraDeProgresso.innerHTML = '<p>Plano de leitura não disponível</p>';
      return;
    }
  
    const { porcentagem, diasFaltando } = calcularPorcentagemConclusao(planoLeitura);
  
    barraDeProgresso.innerHTML = `<p>Conclusão: ${porcentagem.toFixed(2)}% (${diasFaltando} dias restantes)</p>`;
  }
  
  // Chama a função para carregar o plano de leitura quando o script é executado
  carregarPlanoLeitura();
  

  
  function carregarAnotacoes() {
    const anotacoesSalvas = JSON.parse(localStorage.getItem('anotacoes')) || [];
    const anotacoesContainer = document.getElementById('anotacoesContainer');
  
    if (anotacoesSalvas.length === 0) {
      anotacoesContainer.innerHTML = '<p>Sem anotações</p>';
      return;
    }
  
    // Ordena as anotações por data (da mais recente para a mais antiga)
    anotacoesSalvas.sort((a, b) => new Date(b.data) - new Date(a.data));
  
    let htmlAnotacoes = '<h2>Diário de Leitura</h2>';
    anotacoesSalvas.forEach((anotacao, index) => {
      htmlAnotacoes += `
        <div class="anotacao">
          <p><strong>${anotacao.data} - ${anotacao.referencia}:</strong> ${anotacao.texto}</p>
          <button class="editar" onclick="editarAnotacao(${index})">Editar</button>
          <button class="apagar" onclick="apagarAnotacao(${index})">Apagar</button>
        </div>
      `;
    });
  
    anotacoesContainer.innerHTML = htmlAnotacoes;
  }
  
  function salvarAnotacao() {
    const anotacao = document.getElementById('anotacaoDoDia').value;
    const dataAtual = new Date().toLocaleDateString();
    const referenciaPassagem = prompt('Informe a referência da passagem do dia (ex: João 3:16):');
  
    if (referenciaPassagem === null || referenciaPassagem.trim() === '') {
      alert('A referência da passagem é obrigatória.');
      return;
    }
  
    const anotacoesSalvas = JSON.parse(localStorage.getItem('anotacoes')) || [];
  
    const novaAnotacao = {
      data: dataAtual,
      referencia: referenciaPassagem,
      texto: anotacao
    };
  
    anotacoesSalvas.push(novaAnotacao);
    localStorage.setItem('anotacoes', JSON.stringify(anotacoesSalvas));
  
    alert('Anotação salva com sucesso!');
    carregarAnotacoes(); // Recarrega as anotações após salvar
    limparCaixaDeTexto(); // Limpa a caixa de texto
  }
  
  function editarAnotacao(index) {
    const anotacoesSalvas = JSON.parse(localStorage.getItem('anotacoes')) || [];
    const anotacaoParaEditar = anotacoesSalvas[index];
  
    const novoTexto = prompt('Edite sua anotação:', anotacaoParaEditar.texto);
  
    if (novoTexto !== null) {
      anotacaoParaEditar.texto = novoTexto;
      localStorage.setItem('anotacoes', JSON.stringify(anotacoesSalvas));
      carregarAnotacoes(); // Recarrega as anotações após editar
    }
  }
  
  function apagarAnotacao(index) {
    const anotacoesSalvas = JSON.parse(localStorage.getItem('anotacoes')) || [];
  
    // Remove a anotação pelo índice
    anotacoesSalvas.splice(index, 1);
  
    // Atualiza o armazenamento local
    localStorage.setItem('anotacoes', JSON.stringify(anotacoesSalvas));
  
    // Recarrega as anotações após apagar
    carregarAnotacoes();
  }
  
  function limparCaixaDeTexto() {
    document.getElementById('anotacaoDoDia').value = '';
  }
  
  function voltarParaPaginaPrincipal() {
    window.location.href = 'index.html';
  }
  
  // Carrega o plano de leitura, a barra de progresso e as anotações ao carregar a página
  carregarAnotacoes();
  
  // Importe o módulo de autenticação do Firebase
  import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


// Inicialize o Firebase
const auth = getAuth();
signInWithPopup(auth, new GoogleAuthProvider())
  .then((result) => {
    // Login com sucesso
    const user = result.user;
    console.log("Usuário autenticado:", user);
  })
  .catch((error) => {
    // Trate erros de autenticação
    console.error("Erro de autenticação:", error);
  });


function loginComGoogle() {
  signInWithPopup(auth, new GoogleAuthProvider())
    .then((result) => {
      // Login com sucesso
      const user = result.user;
      console.log("Usuário autenticado com Google:", user);
    })
    .catch((error) => {
      // Trate erros de autenticação
      console.error("Erro de autenticação com Google:", error);
    });
}
}
