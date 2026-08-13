console.log("LWPL ADMIN JS LOADED");

const menuItems = document.querySelectorAll(".sidebar li");
const pageTitle = document.getElementById("pageTitle");
const content = document.getElementById("content");

menuItems.forEach(item => {

    item.addEventListener("click", function () {

        const page = this.dataset.page;

        pageTitle.textContent = this.textContent.trim();

        if (page === "dashboard") {
            content.innerHTML = `
                <div class="card">
                    <h3>🏆 Dashboard</h3>
                    <p>Dashboard is working.</p>
                </div>
            `;
        }

        if (page === "teams") {
            content.innerHTML = `
                <div class="card">
                    <h3>⚽ Teams</h3>
                    <p>Teams JavaScript is working.</p>
                </div>
            `;
        }

        if (page === "players") {
            content.innerHTML = `
                <div class="card">
                    <h3>👕 Players</h3>
                    <p>Players JavaScript is working.</p>
                </div>
            `;
        }

        if (page === "fixtures") {
            content.innerHTML = `
                <div class="card">
                    <h3>📅 Fixtures</h3>
                    <p>Fixtures JavaScript is working.</p>
                </div>
            `;
        }

        if (page === "results") {
            content.innerHTML = `
                <div class="card">
                    <h3>🥅 Results</h3>
                    <p>Results JavaScript is working.</p>
                </div>
            `;
        }

        if (page === "scorers") {
            content.innerHTML = `
                <div class="card">
                    <h3>⚽ Top Scorers</h3>
                    <p>Top Scorers JavaScript is working.</p>
                </div>
            `;
        }

        if (page === "logos") {
            content.innerHTML = `
                <div class="card">
                    <h3>🖼️ Team Logos</h3>
                    <p>Team Logos JavaScript is working.</p>
                </div>
            `;
        }

        if (page === "lineups") {
            content.innerHTML = `
                <div class="card">
                    <h3>📋 Lineups</h3>
                    <p>Lineups JavaScript is working.</p>
                </div>
            `;
        }

        if (page === "settings") {
            content.innerHTML = `
                <div class="card">
                    <h3>⚙️ Settings</h3>
                    <p>Settings JavaScript is working.</p>
                </div>
            `;
        }

    });

});

console.log("LWPL MENU READY");
