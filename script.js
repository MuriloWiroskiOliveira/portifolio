// ==============================
// MENU MOBILE
// ==============================

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');

    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
});


// Fecha o menu depois que a pessoa escolhe uma seção.
navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navigation.classList.remove('open');

        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '☰';
    });
});


// ==============================
// ANO DO RODAPÉ
// ==============================

document.querySelector('#year').textContent = new Date().getFullYear();


// ==============================
// PROJETOS DO GITHUB
// ==============================

const GITHUB_USERNAME = 'MuriloWiroskiOliveira';

const projectsContainer = document.querySelector('#github-projects');
const projectCount = document.querySelector('#project-count');


// Busca os repositórios públicos do GitHub
async function loadGitHubProjects() {

    try {

        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`
        );

        if (!response.ok) {
            throw new Error('Não foi possível acessar o GitHub.');
        }

        const repositories = await response.json();

        // Remove repositórios que são forks
        const projects = repositories.filter(
            repository => !repository.fork
        );

        projectCount.textContent = `${projects.length} PUBLICADOS`;

        // Caso não exista nenhum projeto
        if (projects.length === 0) {

            projectsContainer.innerHTML = `
                <div class="projects-loading">
                    <div class="loading-icon">{ }</div>
                    <h3>Nenhum projeto publicado ainda.</h3>
                    <p>
                        Novos projetos aparecerão aqui automaticamente
                        quando forem publicados no GitHub.
                    </p>
                </div>
            `;

            return;
        }


        // Cria os cards
        projectsContainer.innerHTML = projects
            .map(createProjectCard)
            .join('');


    } catch (error) {

        console.error('Erro ao carregar projetos:', error);

        projectCount.textContent = 'ERRO';

        projectsContainer.innerHTML = `
            <div class="projects-loading">
                <div class="loading-icon">!</div>
                <h3>Não foi possível carregar os projetos.</h3>
                <p>
                    Tente novamente mais tarde ou acesse diretamente
                    meu GitHub.
                </p>

                <a
                    href="https://github.com/${GITHUB_USERNAME}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-link"
                >
                    Acessar GitHub ↗
                </a>
            </div>
        `;
    }
}


// Cria o HTML de cada projeto
function createProjectCard(repository) {

    const description =
        repository.description ||
        'Projeto desenvolvido durante minha jornada de aprendizado em tecnologia.';

    const language =
        repository.language ||
        'Código';


    return `
        <article class="project-card">

            <div class="project-card-top">

                <span class="project-icon">
                    { }
                </span>

                <span class="project-language">
                    ${language}
                </span>

            </div>


            <div class="project-card-content">

                <h3>${repository.name}</h3>

                <p>
                    ${description}
                </p>

            </div>


            <div class="project-card-bottom">

                <div class="project-stats">

                    <span>
                        ★ ${repository.stargazers_count}
                    </span>

                    <span>
                        ⑂ ${repository.forks_count}
                    </span>

                </div>


                <a
                    href="${repository.html_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >
                    GitHub ↗
                </a>

            </div>

        </article>
    `;
}


// Inicia o carregamento
loadGitHubProjects();