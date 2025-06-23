const proxyCORS = 'https://api.allorigins.win/raw?url=';

const compositores = [
  "Frédéric Chopin",
  "Ludwig van Beethoven",
  "Pyotr Ilyich Tchaikovsky",
  "Robert Schumann",
  "Franz Schubert",
  "Johann Sebastian Bach",
  "Felix Mendelssohn",
  "Clara Schumann",
  "Ernesto Nazareth",
  "Zequinha de Abreu",
  "Chiquinha Gonzaga"
];

async function buscarPartiturasDoCompositor(nomeCompositor) {
  let listaPartituras = [];
  let tokenContinuidade = null;

  do {
    let urlAPI = `https://imslp.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${encodeURIComponent(nomeCompositor)}&cmlimit=50&origin=*`;
    if (tokenContinuidade) urlAPI += `&cmcontinue=${tokenContinuidade}`;

    const resposta = await fetch(proxyCORS + encodeURIComponent(urlAPI));
    const texto = await resposta.text();

    let dados;
    try {
      dados = JSON.parse(texto);
    } catch (e) {
      console.error(`Erro ao parsear JSON para ${nomeCompositor}:`, e);
      break;
    }

    listaPartituras = listaPartituras.concat(dados.query.categorymembers);
    tokenContinuidade = dados.continue ? dados.continue.cmcontinue : null;

  } while (tokenContinuidade);

  return listaPartituras;
}

async function mostrarPartiturasNaPagina() {
  const container = document.getElementById('conteudo');

  for (const compositor of compositores) {
    const divCompositor = document.createElement('div');
    divCompositor.classList.add('compositor');

    const h2 = document.createElement('h2');
    h2.textContent = compositor;
    divCompositor.appendChild(h2);

    const partituras = await buscarPartiturasDoCompositor(compositor);

    partituras.forEach(partitura => {
      const p = document.createElement('p');
      p.classList.add('partitura');
      p.textContent = partitura.title;
      divCompositor.appendChild(p);
    });

    container.appendChild(divCompositor);
  }
}

mostrarPartiturasNaPagina().catch(console.error);
