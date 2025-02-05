let replaceExportButton = () => { 
    let exportBtn = document.getElementsByClassName('export-btn')[0]

    if (exportBtn === undefined) return

    let newExportBtn = exportBtn.cloneNode(true)
    
    exportBtn.remove()

    newExportBtn.addEventListener('click', exportVisibleTable)
    newExportBtn.getElementsByClassName('icon-lock')[0].remove()

    document.getElementsByClassName('stats-export-container')[0].appendChild(newExportBtn)
    document.getElementsByClassName('stats-export-container')[0].children[1].remove()
}

const exportVisibleTable = () => {
    document.querySelectorAll(".icon-sort").forEach(el => el.remove())
    let table = document.getElementById('screener-table')
    let headers = table.getElementsByTagName('th')
    let rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr')

    let csvContent = "data:text/csv;charset=utf-8,"

    let headerRow = []
    headerRow.push('S.No.')

    for (let i = 1; i < headers.length - 1; i++) {
        headerRow.push(headers[i].innerText)
    }

    csvContent += headerRow.join(',') + '\r\n'
    let rowsCount = rows.length

    for (let i = 0; i < rowsCount; i++) {
        let row = []
        for (let j = 0; j < headerRow.length; j++) {
            console.log(rows[i].children[j].innerText)
            row.push(`"${rows[i].children[j].innerText}"`)
        }

        csvContent += row.join(',') + '\r\n'
    }

    let encodedUri = encodeURI(csvContent)
    let link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "tickertape-table-export.csv")
    document.body.appendChild(link)

    link.click()
}

let addObserver = () => {
    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(added_node) {
                if (added_node.classList.contains('stocks-table')) {
                    replaceExportButton()
                }
            });
        });
    });

    let tableContainer = document.getElementsByClassName("screen-panel-container")[0]
    if(!tableContainer) {
        window.setTimeout(addObserver, 500);
        return;
    }

    observer.observe(tableContainer, { subtree: false, childList: true });
}

let addAppObserver = () => {
    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(added_node) {
                if (added_node.classList.contains('screener-container')) {
                    replaceExportButton()
                    addObserver()
                }
            });
        });
    });

    let appContainer = document.getElementById("app-container")
    if(!appContainer) {
        window.setTimeout(addAppObserver, 500);
        return;
    }

    observer.observe(appContainer, { subtree: false, childList: true });
}

let main = () => {
    replaceExportButton()
    addAppObserver()
    addObserver()
}
    

main()
