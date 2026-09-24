window.app = {
    data: [],
    loaded: false
};

async function loadData() {

    if (window.app.loaded) {
        return window.app.data;
    }

    const response = await fetch("matches.json");

    window.app.data = await response.json();
    window.app.loaded = true;

    console.log(
        `Loaded ${window.app.data.length} records`
    );

    return window.app.data;
}