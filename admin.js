const menuItems = document.querySelectorAll(".sidebar li");
const pageTitle = document.getElementById("pageTitle");
const content = document.getElementById("content");

console.log("LWPL ADMIN JS LOADED");


menuItems.forEach(function(item) {

    item.addEventListener("click", function() {

        menuItems.forEach(function(menu) {
            menu.classList.remove("active");
        });

        this.classList.add("active");

        const page = this.dataset.page;

        pageTitle.textContent = this.textContent.trim();


        if (page === "dashboard") {

            content.innerHTML = `
                <div class="card">
                    <h3>🏆 Dashboard</h3>
                    <p>Welcome to Lamu West Premier League.</p>
                </div>
            `;

        }


        else if (page === "teams") {

            content.innerHTML = `
                <div class="card">
                    <h3>⚽ Teams Management</h3>
                    <p>Teams section is ready.</p>
                </div>
            `;

        }


        else if (page === "players") {

            content.innerHTML = `
                <div class="card">

                    <h3>👕 Players Management</h3>

                    <p>
                        Manage Lamu West Premier League players.
                    </p>

                    <br>

                    <button id="addPlayerBtn">
                        ➕ Add Player
                    </button>

                </div>
            `;


            document
                .getElementById("addPlayerBtn")
                .addEventListener("click", function() {

                    alert("✅ Player button is working!");

                });

        }


        else if (page === "fixtures") {

            content.innerHTML = `
                <div class="card">
                    <h3>📅 Fixtures</h3>
                    <p>Fixtures management coming soon.</p>
                </div>
            `;

        }


        else if (page === "results") {

            content.innerHTML = `
                <div class="card">
                    <h3>🥅 Results</h3>
                    <p>Results management coming soon.</p>
                </div>
            `;

        }


        else if (page === "scorers") {

            content.innerHTML = `
                <div class="card">
                    <h3>⚽ Top Scorers</h3>
                    <p>Top scorers management coming soon.</p>
                </div>
            `;

        }


        else if (page === "logos") {

            content.innerHTML = `
                <div class="card">
                    <h3>🖼️ Team Logos</h3>
                    <p>Team logos management coming soon.</p>
                </div>
            `;

        }


        else if (page === "lineups") {

            content.innerHTML = `
                <div class="card">
                    <h3>📋 Lineups</h3>
                    <p>Lineup builder coming soon.</p>
                </div>
            `;

        }


        else if (page === "settings") {

            content.innerHTML = `
                <div class="card">
                    <h3>⚙️ Settings</h3>
                    <p>League settings coming soon.</p>
                </div>
            `;

        }

    });

});
