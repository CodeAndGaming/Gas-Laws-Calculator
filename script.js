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
            // P1*V1 = P2*V2
            let P1 = getVal("a"), V1 = getVal("b"), P2 = getVal("c"), V2 = getVal("d");
            formulaText += "Boyle's Law:\nP1 × V1 = P2 × V2\n\n";

            if (!P2) {
                formulaText += "Solve for P2: P2 = (P1 × V1) / V2\n\n";
                formulaText += `P2 = (${P1} × ${V1}) / ${V2}\n`;
                r = (P1*V1)/V2;
                formulaText += `P2 = ${r}\n`;
            } else if (!P1) {
                formulaText += "Solve for P1: P1 = (P2 × V2) / V1\n\n";
                r = (P2*V2)/V1;
                formulaText += `P1 = ${r}\n`;
            } else if (!V2) {
                formulaText += "Solve for V2: V2 = (P1 × V1) / P2\n\n";
                r = (P1*V1)/P2;
                formulaText += `V2 = ${r}\n`;
            } else if (!V1) {
                formulaText += "Solve for V1: V1 = (P2 × V2) / P1\n\n";
                r = (P2*V2)/P1;
                formulaText += `V1 = ${r}\n`;
            }
        }

        else if (law === "charles") {
            // V1/T1 = V2/T2
            let V1 = getVal("a"), T1 = getVal("b", true), V2 = getVal("c"), T2 = getVal("d", true);
            formulaText += "Charles' Law:\nV1 / T1 = V2 / T2\n\n";

            if (!V2) {
                formulaText += "Solve for V2: V2 = V1 × (T2 / T1)\n\n";
                r = V1 * (T2 / T1);
                formulaText += `V2 = ${r}\n`;
            } else if (!V1) {
                formulaText += "Solve for V1: V1 = V2 × (T1 / T2)\n\n";
                r = V2 * (T1 / T2);
                formulaText += `V1 = ${r}\n`;
            } else if (!T2) {
                formulaText += "Solve for T2: T2 = V2 × (T1 / V1)\n\n";
                r = V2 * (T1 / V1);
                formulaText += `T2 = ${r} K\n`;
            } else if (!T1) {
                formulaText += "Solve for T1: T1 = V1 × (T2 / V2)\n\n";
                r = V1 * (T2 / V2);
                formulaText += `T1 = ${r} K\n`;
            }
        }

        else if (law === "gay") {
            // P1/T1 = P2/T2
            let P1 = getVal("a"), T1 = getVal("b", true), P2 = getVal("c"), T2 = getVal("d", true);
            formulaText += "Gay-Lussac's Law:\nP1 / T1 = P2 / T2\n\n";

            if (!P2) {
                formulaText += "Solve for P2: P2 = P1 × (T2 / T1)\n\n";
                r = P1 * (T2 / T1);
                formulaText += `P2 = ${r}\n`;
            } else if (!P1) {
                formulaText += "Solve for P1: P1 = P2 × (T1 / T2)\n\n";
                r = P2 * (T1 / T2);
                formulaText += `P1 = ${r}\n`;
            } else if (!T2) {
                formulaText += "Solve for T2: T2 = P2 × (T1 / P1)\n\n";
                r = P2 * (T1 / P1);
                formulaText += `T2 = ${r} K\n`;
            } else if (!T1) {
                formulaText += "Solve for T1: T1 = P1 × (T2 / P2)\n\n";
                r = P1 * (T2 / P2);
                formulaText += `T1 = ${r} K\n`;
            }
        }

        else if (law === "combined") {
            // P1*V1/T1 = P2*V2/T2
            let P1 = getVal("a"), V1 = getVal("b"), T1 = getVal("c", true),
                P2 = getVal("d"), V2 = getVal("e"), T2 = getVal("f", true);
            formulaText += "Combined Gas Law:\n(P1 × V1)/T1 = (P2 × V2)/T2\n\n";

            if (!P2) {
                formulaText += "Solve for P2: P2 = (P1 × V1 × T2) / (V2 × T1)\n\n";
                r = (P1 * V1 * T2) / (V2 * T1);
                formulaText += `P2 = ${r}\n`;
            } else if (!V2) {
                formulaText += "Solve for V2: V2 = (P1 × V1 × T2) / (P2 × T1)\n\n";
                r = (P1 * V1 * T2) / (P2 * T1);
                formulaText += `V2 = ${r}\n`;
            } else if (!T2) {
                formulaText += "Solve for T2: T2 = (P2 × V2 × T1) / (P1 × V1)\n\n";
                r = (P2 * V2 * T1) / (P1 * V1);
                formulaText += `T2 = ${r} K\n`;
            }
        }

        else if (law === "avogadro") {
            // V1/n1 = V2/n2
            let V1 = getVal("a"), n1 = getVal("b"), V2 = getVal("c"), n2 = getVal("d");
            formulaText += "Avogadro's Law:\nV1 / n1 = V2 / n2\n\n";

            if (!V2) {
                formulaText += "Solve for V2: V2 = V1 × (n2 / n1)\n\n";
                r = V1 * (n2 / n1);
                formulaText += `V2 = ${r}\n`;
            } else if (!V1) {
                formulaText += "Solve for V1: V1 = V2 × (n1 / n2)\n\n";
                r = V2 * (n1 / n2);
                formulaText += `V1 = ${r}\n`;
            } else if (!n2) {
                formulaText += "Solve for n2: n2 = n1 × (V2 / V1)\n\n";
                r = n1 * (V2 / V1);
                formulaText += `n2 = ${r}\n`;
            } else if (!n1) {
                formulaText += "Solve for n1: n1 = n2 × (V1 / V2)\n\n";
                r = n2 * (V1 / V2);
                formulaText += `n1 = ${r}\n`;
            }
        }

        else if (law === "dalton") {
            // Ptotal = P1 + P2 + P3
            let P1 = getVal("a"), P2 = getVal("b"), P3 = getVal("c");
            formulaText += "Dalton's Law of Partial Pressure:\nPtotal = P1 + P2 + P3\n\n";

            if (!P3) {
                formulaText += "Solve for P3: P3 = Ptotal - P1 - P2\n\n";
                r = null; // You don't have Ptotal input, optional to add later
                formulaText += `Enter total pressure to calculate P3\n`;
            } else {
                r = P1 + P2 + P3;
                formulaText += `Ptotal = ${P1} + ${P2} + ${P3} = ${r}\n`;
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