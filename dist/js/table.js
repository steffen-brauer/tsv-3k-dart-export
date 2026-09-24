let table;

window.pages = window.pages || {};

window.pages.table = async function() {
    const data = await loadData();

    const statusValues =
        [...new Set(
            data.map(x => x.active)
        )]
        .filter(Boolean)
        .sort();

    const statusSelect =
        document.getElementById(
            "status-filter"
        );

    statusValues.forEach(status => {

        const option =
            document.createElement("option");

        option.value = status;
        option.textContent = status;

        statusSelect.appendChild(option);

    });

    table = new Tabulator(
        "#table-container",
        {
            data: data,
            layout: "fitDataStretch",
            //height: "700px",
            selectableRows: false,
            pagination: false,
            //paginationSize: 100,
            initialSort: [
                {
                    column: "datePlanned",
                    dir: "asc"
                }
            ],            
            columns: [

                // {
                //     //formatter: "rowSelection",
                //     //titleFormatter: "rowSelection",
                //     width: 50,
                //     hozAlign: "center",
                //     headerSort: false
                // },

                // {
                //     title: "ID",
                //     field: "id",
                //     width: 100
                // },

                {
                    formatter: "datetime",
                    formatterParams:{


                        inputFormat:"yyyy-MM-dd'T'HH:mm:ss.SSSZZ",
                        outputFormat:"dd.MM.yyyy HH:mm",
                        invalidPlaceholder:"(invalid date)",
                        timezone:"Europe/Berlin"
                    },
                    title: "Datum",
                    field: "datePlanned",
                    resizable: false
                },

                {
                    // headerFilter:"list",
                    // headerFilterParams: {valuesLookup:true, clearable:true},
                    title: "Heim",
                    field: "participantHome.displayName",
                    resizable: false,
                    formatter: conditionalTextColor
                },
                {
                    title: "Ergebnis",
                    field: "result",
                    resizable: false
                },

                {
                    title: "Gast",
                    field: "participantAway.displayName",
                    resizable: false,
                    formatter: conditionalTextColor
                },

                // {
                //     title: "Status",
                //     field: "status",
                //     resizable: false
                // },


            ]

        }
    );


    registerFilters();


};


function conditionalTextColor(cell) {

    const value = cell.getValue();

    if (/TSV Danndorf/i.test(value)) {
        cell.getElement().style.color = "red";
        cell.getElement().style.fontWeight = "bold";
    }
    return value;
}




function quickFilter(value, columns) {
    table.setFilter(function(row) {

    const data = row.getData();

    return columns.some(col =>
        String(data[col] || "")
            .toUpperCase()
            .includes(value.toUpperCase())
        );
    });
}


function registerFilters() {

    const globalSearch =
        document.getElementById(
            "global-search"
        );

    globalSearch.addEventListener(
        "keyup",
        function () {

            const value =
                this.value.toLowerCase();

            if (!value) {

                table.clearFilter();

                updateStatistics();

                return;
            }

            table.setFilter(row => {

                return JSON.stringify(row)
                    .toLowerCase()
                    .includes(value);

            });

            updateStatistics();

        }
    );

    const teamFilter =
        document.getElementById(
            "team-filter"
        );

    teamFilter.addEventListener(
        "change",
        function () {

            if (!this.value) {
                table.clearFilter(true);
                return;
            }

            table.setFilter(function(row) {
                return (
                    String(row.participantHome.displayName || "")
                        .includes(this.value) ||
                    String(row.participantAway.displayName || "")
                        .includes(this.value)
                );
            }.bind(this));
        }
    );
}
