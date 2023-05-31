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
    let headers = table.getElementsByClassName('header-col')
    let columns = table.getElementsByClassName('data-col')

    let csvContent = "data:text/csv;charset=utf-8,"

    let headerRow = []
    headerRow.push('S.No.')

    for (let i = 1; i < headers.length; i++) {
        headerRow.push(headers[i].innerText)
    }

    csvContent += headerRow.join(',') + '\r\n'
    rowsCount = columns[0].getElementsByClassName('screener-cell').length

    for (let i = 0; i < rowsCount; i++) {
        let row = []
        
        for (let j = 0; j < headers.length; j++) {
            row.push(`"${columns[j].getElementsByClassName('screener-cell')[i].innerText}"`)
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

let main = () => {
    replaceExportButton()
    addObserver()
}
    

main()
