// URLs testadas e 100% funcionais sem restrição de CORS
const videos = [
    {
        id: 1,
        titulo: "Animação Big Buck Bunny",
        canal: "Blender Open Studio",
        categoria: "Jogos",
        views: "1.5 mi de views",
        foto: "https://picsum.photos/40/40?random=1",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        likes: 2400,
        inscrito: false,
        comentarios: ["Animação clássica!", "Vídeo leve e funcional."]
    },
    {
        id: 2,
        titulo: "A flor desabrochando - Natureza",
        canal: "MDN Visuals",
        categoria: "Programação",
        views: "890 mil views",
        foto: "https://picsum.photos/40/40?random=2",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        likes: 1200,
        inscrito: false,
        comentarios: ["Carregou instantaneamente!"]
    },
    {
        id: 3,
        titulo: "Clipe Curto de Exemplo",
        canal: "Media Lab",
        categoria: "Música",
        views: "3.2 mi de views",
        foto: "https://picsum.photos/40/40?random=3",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        likes: 5400,
        inscrito: false,
        comentarios: ["Sem travamentos."]
    },
    {
        id: 4,
        titulo: "Lapse de Flores no Campo",
        canal: "Green World",
        categoria: "Debates",
        views: "450 mil views",
        foto: "https://picsum.photos/40/40?random=4",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        likes: 980,
        inscrito: false,
        comentarios: ["Muito legal."]
    },
    {
        id: 5,
        titulo: "Vídeo de Teste para Web",
        canal: "Web Dev Team",
        categoria: "Podcasts",
        views: "670 mil views",
        foto: "https://picsum.photos/40/40?random=5",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        likes: 1800,
        inscrito: false,
        comentarios: ["Perfeito!"]
    },
    {
        id: 6,
        titulo: "Time-lapse de Jardim",
        canal: "Nature TV",
        categoria: "Jogos",
        views: "2.1 mi de views",
        foto: "https://picsum.photos/40/40?random=6",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        likes: 4100,
        inscrito: false,
        comentarios: ["Funcionou direto."]
    }
];

let videoAtual = null;
let usuarioLogado = null;

const gridVideos = document.getElementById('gridVideos');
const campoBusca = document.getElementById('campoBusca');

function renderizar(lista) {
    if (!gridVideos) return;
    gridVideos.innerHTML = '';

    if (lista.length === 0) {
        gridVideos.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa;">Nenhum vídeo encontrado.</p>';
        return;
    }

    lista.forEach(v => {
        const card = document.createElement('article');
        card.className = 'card-video';
        card.onclick = () => carregarPlayer(v);
        card.innerHTML = `
            <div class="thumb-box">
                <video src="${v.src}#t=0.1" preload="metadata" muted></video>
            </div>
            <div class="card-info">
                <img src="${v.foto}" class="canal-img" alt="Canal">
                <div>
                    <div class="video-titulo">${v.titulo}</div>
                    <div class="video-canal">${v.canal}</div>
                    <div class="video-meta">${v.views} • 👍 ${v.likes}</div>
                </div>
            </div>
        `;
        gridVideos.appendChild(card);
    });
}

function carregarPlayer(v) {
    videoAtual = v;
    const player = document.getElementById('videoPrincipal');
    if (!player) return;

    player.src = v.src;
    document.getElementById('tituloDestaque').innerText = v.titulo;
    document.getElementById('canalDestaque').innerText = v.canal;
    document.getElementById('fotoCanalDestaque').src = v.foto;
    document.getElementById('qtdLikes').innerText = v.likes;

    atualizarBotaoInscricao();
    renderizarComentarios();

    document.getElementById('playerDestaque').style.display = 'block';

    const chkAutoplay = document.getElementById('chkAutoplay');
    if (chkAutoplay && chkAutoplay.checked) {
        player.play().catch(() => console.log("Autoplay bloqueado"));
    } else {
        player.play();
    }

    document.querySelector('.conteudo-principal').scrollTo({ top: 0, behavior: 'smooth' });
}

function fecharPlayer() {
    const player = document.getElementById('videoPrincipal');
    if (player) {
        player.pause();
        player.src = '';
    }
    document.getElementById('playerDestaque').style.display = 'none';
}

function darLike() {
    if (!videoAtual) return;
    videoAtual.likes++;
    document.getElementById('qtdLikes').innerText = videoAtual.likes;
    renderizar(videos);
}

function alternarInscricao() {
    if (!videoAtual) return;
    videoAtual.inscrito = !videoAtual.inscrito;
    atualizarBotaoInscricao();
}

function atualizarBotaoInscricao() {
    const btn = document.getElementById('btnInscrever');
    if (!btn || !videoAtual) return;

    if (videoAtual.inscrito) {
        btn.innerText = "Inscrito";
        btn.classList.add('inscrito');
    } else {
        btn.innerText = "Inscrever-se";
        btn.classList.remove('inscrito');
    }
}

function adicionarComentario() {
    const campo = document.getElementById('inComentario');
    if (!campo || !campo.value.trim() || !videoAtual) return;

    const autor = usuarioLogado ? usuarioLogado : "Usuário Anônimo";
    videoAtual.comentarios.push(`${autor}: ${campo.value}`);
    campo.value = '';
    renderizarComentarios();
}

function renderizarComentarios() {
    const lista = document.getElementById('listaComentarios');
    if (!lista || !videoAtual) return;

    lista.innerHTML = '';
    document.getElementById('totalComentarios').innerText = videoAtual.comentarios.length;

    videoAtual.comentarios.forEach(c => {
        const div = document.createElement('div');
        div.className = 'item-comentario';
        div.innerHTML = c.replace(/^([^:]+):/, '<strong>$1:</strong>');
        lista.appendChild(div);
    });
}

function fazerLogin() {
    const user = document.getElementById('inUsuario').value;
    if (!user) return alert("Digite um nome de usuário!");

    usuarioLogado = user;
    document.getElementById('btnConta').innerText = user;
    fecharModais();
}

function abrirModal() { document.getElementById('modalAdd').style.display = 'flex'; }
function abrirModalConta() { document.getElementById('modalConta').style.display = 'flex'; }
function abrirModalConfig() { document.getElementById('modalConfig').style.display = 'flex'; }

function fecharModais() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function salvarVideo() {
    const titulo = document.getElementById('inTitulo').value;
    const canal = document.getElementById('inCanal').value;
    const url = document.getElementById('inUrl').value;
    const cat = document.getElementById('inCat').value;

    if (!titulo || !canal || !url) return alert('Preencha todos os campos!');

    const novoVideo = {
        id: Date.now(),
        titulo: titulo,
        canal: canal,
        categoria: cat,
        views: "1 visualização",
        foto: `https://picsum.photos/40/40?random=${Date.now()}`,
        src: url,
        likes: 0,
        inscrito: false,
        comentarios: []
    };

    videos.unshift(novoVideo);
    renderizar(videos);
    fecharModais();
}

function filtrarCategoria(cat, elemento) {
    document.querySelectorAll('.side-item').forEach(b => b.classList.remove('ativo'));
    if (elemento) elemento.classList.add('ativo');

    if (cat === 'Tudo') {
        renderizar(videos);
    } else {
        renderizar(videos.filter(v => v.categoria === cat));
    }
}

if (campoBusca) {
    campoBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        renderizar(videos.filter(v =>
            v.titulo.toLowerCase().includes(termo) ||
            v.canal.toLowerCase().includes(termo)
        ));
    });
}

function resetarVisao() {
    fecharPlayer();
    if (campoBusca) campoBusca.value = '';
    const primeiroItem = document.querySelector('.side-item');
    filtrarCategoria('Tudo', primeiroItem);
}

renderizar(videos);