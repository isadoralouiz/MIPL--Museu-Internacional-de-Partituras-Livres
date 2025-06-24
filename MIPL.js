const compositores = [
  { nome: "Frédéric Chopin", id: "chopin" },
  { nome: "Ludwig van Beethoven", id: "beethoven" },
  { nome: "Clara Schumann", id: "clara-schumann" },
  { nome: "Robert Schumann", id: "robert-schumann" },
  { nome: "Johann Sebastian Bach", id: "bach" },
  { nome: "Franz Schubert", id: "schubert" },
  { nome: "Felix Mendelssohn", id: "mendelssohn" },
  { nome: "Pyotr Ilyich Tchaikovsky", id: "tchaikovsky" }
];

async function buscarObras(compositorID) {
  const url = `https://api.openopus.org/work/list/composer/${compositorID}/romantic.json`;

  const resposta = await fetch(url);
  const dados = await resposta.json();

  if (dados.status.success !== "true") {
    console.error(`Erro ao buscar obras de ${compositorID}`);
    return [];
  }

  return dados.works;
}

async function mostrarObrasNaPagina() {
  const container = document.getElementById("conteudo");

  for (const compositor of compositores) {
    const div = document.createElement("div");
    div.classList.add("compositor");

    const h2 = document.createElement("h2");
    h2.textContent = compositor.nome;
    div.appendChild(h2);

    const obras = await buscarObras(compositor.id);

    obras.forEach((obra) => {
      const p = document.createElement("p");
      p.classList.add("obra");
      p.textContent = obra.title;
      div.appendChild(p);
    });

    container.appendChild(div);
  }
}

mostrarObrasNaPagina().catch(console.error);
