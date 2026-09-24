let table;

window.pages = window.pages || {};

const TSV_RED = "#be2828";


window.pages.table = async function () {

    const data = await loadData();


    /* =========================================
       Status Filter
       ========================================= */

    const statusValues = [
        ...new Set(
            data
                .map(x => x.active)
        )
    ]
        .filter(Boolean)
        .sort();


    const statusSelect =
        document.getElementById("status-filter");


    if (statusSelect) {

        statusValues.forEach(status => {

            const option =
                document.createElement("option");

            option.value = status;
            option.textContent = status;

            statusSelect.appendChild(option);

        });

    }


    /* =========================================
       Tabulator
       ========================================= */

    table = new Tabulator(
        "#table-container",
        {

            data: data,

            layout: "fitDataStretch",

            selectableRows: false,

            pagination: false,


            /* ---------------------------------
               Sorting
               --------------------------------- */

            initialSort: [
                {
                    column: "datePlanned",
                    dir: "asc"
                }
            ],


            /* ---------------------------------
               Columns
               --------------------------------- */

            columns: [

                {
                    title: "Datum",
                    field: "datePlanned",

                    formatter: "datetime",

                    formatterParams: {

                        inputFormat:
                            "yyyy-MM-dd'T'HH:mm:ss.SSSZZ",

                        outputFormat:
                            "dd.MM.yyyy HH:mm",

                        invalidPlaceholder:
                            "(ungültiges Datum)",

                        timezone:
                            "Europe/Berlin"
                    },

                    resizable: false
                },


                {
                    title: "Event",
                    field: "event.name",

                    resizable: false
                },


                {
                    title: "Runde",
                    field: "round.name",

                    resizable: false
                },


                {
                    title: "Heim",
                    field: "participantHome.displayName",

                    resizable: false,

                    formatter:
                        conditionalTextColor
                },


                {
                    title: "Ergebnis",
                    field: "result",

                    resizable: false,

                    formatter:
                        resultFormatter
                },


                {
                    title: "Gast",
                    field: "participantAway.displayName",

                    resizable: false,

                    formatter:
                        conditionalTextColor
                }

            ]

        }
    );


    /* =========================================
       Filters
       ========================================= */

    registerFilters();

};


/* =============================================
   TSV Team hervorheben
   ============================================= */

function conditionalTextColor(cell) {

    const value = cell.getValue();

    if (!value) {
        return "";
    }


    const element =
        cell.getElement();


    if (/TSV Danndorf/i.test(String(value))) {

        element.style.color = TSV_RED;

        element.style.fontWeight = "700";

    }


    return value;
}


/* =============================================
   Ergebnis formatieren
   ============================================= */

function resultFormatter(cell) {

    const value = cell.getValue();

    if (!value) {
        return "";
    }

    return value;
}


/* =============================================
   Quick Filter
   ============================================= */

function quickFilter(value, columns) {

    if (!table) {
        return;
    }


    if (!value) {

        table.clearFilter();

        return;
    }


    const searchValue =
        value.toUpperCase();


    table.setFilter(function (row) {

        const data =
            row.getData();


        return columns.some(col => {

            return String(
                data[col] || ""
            )
                .toUpperCase()
                .includes(searchValue);

        });

    });

}


/* =============================================
   Register Filters
   ============================================= */

function registerFilters() {


    /* -----------------------------------------
       Global Search
       ----------------------------------------- */

    const globalSearch =
        document.getElementById(
            "global-search"
        );


    if (globalSearch) {

        globalSearch.addEventListener(
            "keyup",
            function () {

                const value =
                    this.value
                        .trim()
                        .toLowerCase();


                if (!value) {

                    table.clearFilter();

                    if (
                        typeof updateStatistics ===
                        "function"
                    ) {
                        updateStatistics();
                    }

                    return;
                }


                table.setFilter(function (row) {

                    return JSON.stringify(
                        row.getData()
                    )
                        .toLowerCase()
                        .includes(value);

                });


                if (
                    typeof updateStatistics ===
                    "function"
                ) {
                    updateStatistics();
                }

            }
        );

    }


    /* -----------------------------------------
       Team Filter
       ----------------------------------------- */

    const teamFilter =
        document.getElementById(
            "team-filter"
        );


    if (teamFilter) {

        teamFilter.addEventListener(
            "change",
            function () {

                const value =
                    this.value;


                if (!value) {

                    table.clearFilter(true);

                    if (
                        typeof updateStatistics ===
                        "function"
                    ) {
                        updateStatistics();
                    }

                    return;
                }


                table.setFilter(function (row) {

                    const data =
                        row.getData();


                    const home =
                        String(
                            data.participantHome
                                ?.displayName || ""
                        );


                    const away =
                        String(
                            data.participantAway
                                ?.displayName || ""
                        );


                    return (
                        home === value ||
                        away === value
                    );

                });


                if (
                    typeof updateStatistics ===
                    "function"
                ) {
                    updateStatistics();
                }

            }
        );

    }

}