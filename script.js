let activeInput = null;

const laws = [
    "boyle",
    "charles",
    "gay",
    "combined",
    "avogadro",
    "dalton"
];

const lawNames = {
    boyle: "Boyle's Law",
    charles: "Charles' Law",
    gay: "Gay-Lussac's Law",
    combined: "Combined Gas Law",
    avogadro: "Avogadro's Law",
    dalton: "Dalton's Law"
};

function init() {
    const select = document.getElementById("lawSelect");

    laws.forEach(l => {
        const opt = document.createElement("option");
        opt.value = l;
        opt.textContent = lawNames[l];
        select.appendChild(opt);
    });

    select.addEventListener("change", changeLaw);

    changeLaw();
    createKeypad();
}

function toggleTheme() {
    document.body.classList.toggle("light");
}

function createInput(id, label, isTemp=false) {
    return `
    <div class="input-row">
        <label>${label}</label>
        <input id="${id}">
        ${isTemp ? `
        <select id="${id}Unit" class="unit">
            <option value="K">K</option>
            <option value="C">°C</option>
        </select>` : ``}
    </div>`;
}

function changeLaw() {
    const law = document.getElementById("lawSelect").value;
    const inputs = document.getElementById("inputs");

    if (law === "boyle") {
        inputs.innerHTML =
            createInput("a","P1") +
            createInput("b","V1") +
            createInput("c","P2") +
            createInput("d","V2");
    }

    else if (law === "charles") {
        inputs.innerHTML =
            createInput("a","V1") +
            createInput("b","T1",true) +
            createInput("c","V2") +
            createInput("d","T2",true);
    }

    else if (law === "gay") {
        inputs.innerHTML =
            createInput("a","P1") +
            createInput("b","T1",true) +
            createInput("c","P2") +
            createInput("d","T2",true);
    }

    else if (law === "combined") {
        inputs.innerHTML =
            createInput("a","P1") +
            createInput("b","V1") +
            createInput("c","T1",true) +
            createInput("d","P2") +
            createInput("e","V2") +
            createInput("f","T2",true);
    }

    else if (law === "avogadro") {
        inputs.innerHTML =
            createInput("a","V1") +
            createInput("b","n1") +
            createInput("c","V2") +
            createInput("d","n2");
    }

    else if (law === "dalton") {
        inputs.innerHTML =
            createInput("a","P1") +
            createInput("b","P2") +
            createInput("c","P3");
    }

    attachListeners();
}

function toKelvin(value, unit) {
    return unit === "C" ? value + 273.15 : value;
}

function getVal(id, isTemp=false) {
    const input = document.getElementById(id);
    if (!input || input.value === "") return null;

    let value = parseFloat(input.value);

    if (isTemp) {
        const unit = document.getElementById(id+"Unit").value;
        value = toKelvin(value, unit);
    }

    return value;
}

function calculate() {

    const law = document.getElementById("lawSelect").value;
    let formulaText = "";
    let r;

    try {

        if (law === "boyle") {

            let P1=getVal("a"), V1=getVal("b"), P2=getVal("c"), V2=getVal("d");

            formulaText += "Boyle's Law:\n";
            formulaText += "P1 × V1 = P2 × V2\n\n";

            if (!P2) {

                formulaText += "Solve for P2\n";
                formulaText += "P2 = (P1 × V1) / V2\n\n";

                formulaText += "Substitute values:\n";
                formulaText += `P2 = (${P1} × ${V1}) / ${V2}\n\n`;

                r = (P1*V1)/V2;

                formulaText += `P2 = ${r}\n`;

            }
        }

        document.getElementById("result").innerText =
            r ? "Answer: " + r.toFixed(4) : "Fill one blank.";

        document.getElementById("formulaBox").innerText = formulaText;

    } catch {
        document.getElementById("result").innerText = "Invalid input.";
        document.getElementById("formulaBox").innerText = "";
    }
}

/* KEYPAD */

function createKeypad() {
    const keypad = document.getElementById("keypad");

    const keys = [
        "7","8","9",
        "4","5","6",
        "1","2","3",
        "C","0","."
    ];

    keys.forEach(k => {
        const btn = document.createElement("button");
        btn.textContent = k;

        if (k === "C") btn.classList.add("clear");

        btn.onclick = () => handleKey(k);
        keypad.appendChild(btn);
    });
}

function handleKey(key) {

    if (key === "C") {
        document.querySelectorAll("input").forEach(input => input.value = "");
        document.getElementById("result").innerText = "";
        const firstInput = document.querySelector("input");
        if (firstInput) {
            firstInput.focus();
            activeInput = firstInput;
        }
        return;
    }

    if (!activeInput) {
        const firstInput = document.querySelector("input");
        if (firstInput) {
            firstInput.focus();
            activeInput = firstInput;
        } else return;
    }

    activeInput.value += key;
}

function attachListeners() {
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("focus", () => activeInput = input);
    });
}

init();