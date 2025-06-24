const compositores = [
  { nome: "Frédéric Chopin", id: 10 },
  { nome: "Ludwig van Beethoven", id: 1 },
  { nome: "Clara Schumann", id: 27 },
  { nome: "Robert Schumann", id: 12 },
  { nome: "Johann Sebastian Bach", id: 2 },
  { nome: "Franz Schubert", id: 9 },
  { nome: "Felix Mendelssohn", id: 11 },
  { nome: "Pyotr Ilyich Tchaikovsky", id: 8 }
];

async function buscarObras(compositorID) {
  const url = `https://api.openopus.org/work/list/composer/${compositorID}/all.json`;

  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(`HTTP error! status: ${resposta.status}`);
    }
    const dados = await resposta.json();

    if (dados.status && dados.status.success === "true") {
      return dados.works || [];
    } else {
      console.error(`API retornou falha para compositor ID ${compositorID}`, dados);
      return [];
    }
  } catch (erro) {
    console.error(`Erro ao buscar obras do compositor ID ${compositorID}:`, erro);
    return [];
  }
}

async function mostrarObrasNaPagina() {
  const container = document.getElementById("conteudo");
  container.innerHTML = "";

  for (const compositor of compositores) {
    const divCompositor = document.createElement("div");
    divCompositor.classList.add("compositor");

    const h2 = document.createElement("h2");
    h2.textContent = compositor.nome;
    divCompositor.appendChild(h2);

    const obras = await buscarObras(compositor.id);

    if (obras.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Nenhuma obra encontrada.";
      divCompositor.appendChild(p);
    } else {
      obras.forEach((obra) => {
        const divObra = document.createElement("div");
        divObra.classList.add("obra");

        const titulo = document.createElement("h3");
        titulo.textContent = obra.title;
        divObra.appendChild(titulo);

        const detalhes = document.createElement("p");
        detalhes.innerHTML = `
          <strong>Estilo:</strong> ${obra.genre || "Desconhecido"}<br>
          <strong>Ano:</strong> ${obra.date || "Desconhecido"}<br>
          <strong>Nível:</strong> ${obra.level || "Não informado"}
        `;
        divObra.appendChild(detalhes);

        divCompositor.appendChild(divObra);
      });
    }

    container.appendChild(divCompositor);
  }
}

mostrarObrasNaPagina().catch(console.error);
