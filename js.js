function insert(num) {
    const screen = document.form1.textview;
    if (screen.value === "Error") {
        screen.value = "";
    }
    screen.value += num;
}

function clearScreen() {
    document.form1.textview.value = "";
}

function backspace() {
    const screen = document.form1.textview;
    screen.value = screen.value.slice(0, -1);
}

function equal() {
    const screen = document.form1.textview;
    if (!screen.value) return;

    try {
        const result = eval(screen.value);
        screen.value = Number.isFinite(result) ? result : "Error";
    } catch {
        screen.value = "Error";
    }
}

let pacmanInMotion = false;
const ghostColors = ["#4cd4ec", "#b57aff", "#ffb454", "#9be564", "#f04e91"];
const GHOST_RUN_DURATIONS = [1.5, 1.8, 2.1, 2.6, 3.5, 5, 6];
let ghostColorIndex = 0;
let previousGhostRunDuration = null;
let remainingGhostRunDurations = [];

function startPacman() {
    const animationLayer = document.querySelector(".display-animation");
    if (pacmanInMotion) return;

    pacmanInMotion = true;
    const ghost = document.createElement("div");
    ghost.className = "ghost";
    ghost.style.setProperty("--ghost-color", ghostColors[ghostColorIndex]);

    if (remainingGhostRunDurations.length === 0) {
        remainingGhostRunDurations = GHOST_RUN_DURATIONS.filter(
            (duration) => duration !== previousGhostRunDuration
        );
    }
    const randomDurationIndex = Math.floor(
        Math.random() * remainingGhostRunDurations.length
    );
    const ghostRunDuration = remainingGhostRunDurations.splice(
        randomDurationIndex,
        1
    )[0];
    previousGhostRunDuration = ghostRunDuration;
    ghost.style.animationDuration = `${ghostRunDuration}s, 0.28s`;
    ghostColorIndex = (ghostColorIndex + 1) % ghostColors.length;
    animationLayer.appendChild(ghost);

    ghost.addEventListener("animationend", (event) => {
        if (event.animationName === "ghost-run" && !ghost.classList.contains("is-eaten")) {
            ghost.remove();
        }
    });

    const pacman = document.createElement("div");
    pacman.className = "pacman";
    animationLayer.appendChild(pacman);

    function checkForGhostCatch() {
        if (!pacman.isConnected || !ghost.isConnected) return;

        const pacmanBounds = pacman.getBoundingClientRect();
        const ghostBounds = ghost.getBoundingClientRect();
        if (pacmanBounds.right >= ghostBounds.left + 5) {
            ghost.classList.add("is-eaten");
            return;
        }

        window.requestAnimationFrame(checkForGhostCatch);
    }

    window.requestAnimationFrame(checkForGhostCatch);

    pacman.addEventListener("animationend", (event) => {
        if (event.animationName !== "pacman-run") return;
        pacman.remove();
        ghost.remove();
        pacmanInMotion = false;
    });
}