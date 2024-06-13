const URL = 'https://datalakepcr.recife.pe.gov.br/webhook/bases_em_atraso'

const headerDate = document.querySelector('.header-date')
const day = new Date().getDate()
const month = new Date().getMonth() + 1
const year = new Date().getFullYear()
headerDate.innerHTML = `${day}/${month}/${year}`

//armazena as informações de bases em atraso
var allLateDates = []
var allDepartments = []

function getLabelByKey(key) {
    const labels = {
        'ASSUNTO': 'Assunto: ',
        'NM_ARQUIVO': 'Nome do arquivo: ',
        'URL_ORIGEM': 'Link para o arquivo de origem: ',
        'NM_ABA_ARQUIVO': 'Nome da aba do arquivo: ',
        'DT_ULT_ATUALIZACAO': 'Última atualização: ',
        'NM_PTO_FOCAL': 'Nome do Ponto Focal: ',
        'CONTATO_PTO_FOCAL': 'Contato do Ponto Focal: ',
        'ORGAO': 'Órgão: ',
        'PERIODICIDADE_COLETA': 'Periodicidade da coleta: ',
        'STATUS': 'Status'
    }
    return labels[key]
}

const periodos = {
    'Diário': 1,
    'Semanal': 7,
    'Mensal': 31,
    'Bimestral': 62,
    'Trimestral': 93,
    'Quadrimestral': 123,
    'Anual': 365,
    'Bianual': 730,
}

function diffDates(dtatual, dtAtualizao) {
    const date1 = new Date(dtAtualizao);
    const date2 = new Date(dtatual);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
}

function buildTemplate(id,orgao, assunto, url, nomeArquivo, abaArquivo, dtAtualizacao, ptFocalNome, ptFocalEmail, status, periodicidade, periodos) {
    let color = 'green'
    status = 'Atualizado'

    const dtAtl = new Date(dtAtualizacao)
    const dtAtual = new Date()

    const dfDates = diffDates(dtAtual, dtAtl)

    if(dfDates > periodos[periodicidade]) {
        status = 'Em atraso'
        color = 'red'
    }
    
    return {
        "lateBase": `
        <h1>${orgao} </h1>
        <p class="id">ID: ${id}</p>
        <div class="title">
            <p>Assunto: </p>
            <a href="${url}" target="_blank" class="subject-text blue-link" >${assunto}</a>
            <a href="${url}" target="_blank" >
                <img class="link-icon" src="./assets/link-icon.png" alt="">
            </a>
        </div>
        <div class="title">
            <p>Nome do arquivo: </p>
            <p class="file-name-text">${nomeArquivo}</p>
        </div>
        <div class="title">
            <p>Nome da aba do arquivo: </p>
            <p class="file-name-text">${abaArquivo}</p>
        </div>
        <div class="title">
            <p>Última atualização: </p>
            <p class="file-name-text">${new Date(dtAtualizacao).toLocaleDateString()}</p>
        </div>
        <div class="title">
            <p>Ponto focal: </p>
            <p class="file-name-text">${ptFocalNome}</p>
            <a class="file-name-text" href="mailto:${ptFocalEmail}">(${ptFocalEmail})</p></a>
        </div>
        <div class="title">
            <p>Status da base: </p>
            <p class="file-name-text">${status}</p>
            <div class="circle ${color}"></div>
        </div>
        <hr>
    `,
    "status": status}
}

const listsElements = document.querySelector('.reports')

fetch(URL)
    .then( res => res.json())
    .then( datas => {
        datas.forEach( item => {
            const { ID_MD5 ,ASSUNTO, NM_ARQUIVO, URL_ORIGEM, NM_ABA_ARQUIVO, DT_ULT_ATUALIZACAO, NM_PTO_FOCAL, CONTATO_PTO_FOCAL, ORGAO, PERIODICIDADE_COLETA } = item
            
            if (!allDepartments.includes(ORGAO)) {
                allDepartments.push(ORGAO)
            }   
            
            const templt = buildTemplate( ID_MD5, ORGAO, ASSUNTO, URL_ORIGEM, NM_ARQUIVO, NM_ABA_ARQUIVO, DT_ULT_ATUALIZACAO, NM_PTO_FOCAL, CONTATO_PTO_FOCAL, "", PERIODICIDADE_COLETA, periodos)
            const status = templt.status
            
            if (status == "Em atraso" ) {
                const li = document.createElement('li')
                li.className = 'list-container'
                li.innerHTML = templt.lateBase
                listsElements.appendChild(li)
            }
        })

})





/**
 *  const li = document.createElement('li')
    li.className = 'list-container'
    li.innerHTML = element
    listsElements.appendChild(li)
 * 
 */