let deck = [];
import * as d3 from "d3";
import { MtgService } from "./mtgService";
import { ManaCost } from "./widgets/manaCost";
import { ManaColor } from "./widgets/manaColor";

document.addEventListener("DOMContentLoaded", setup);

function setup() {
    const mtg = new MtgService();
    mtg.loadCards().then(cards => populateCardList(cards));

    // 初始化 ManaCost 小部件
    const manaCost = new ManaCost();
    const manaCostContainer = document.getElementById("manaCostWidgetContainer");
    const manaCostData = [
        { cost: 1, count: 8 },
        { cost: 2, count: 12 },
        { cost: 3, count: 15 },
        { cost: 4, count: 10 },
        { cost: 5, count: 6 },
        { cost: 6, count: 4 },
        { cost: '7+', count: 3 }
    ];
    manaCost.build(manaCostData, manaCostContainer);

    // 初始化 ManaColor 小部件
    const manaColor = new ManaColor();
    const manaColorContainer = document.getElementById("manaColorWidgetContainer");
    const manaColorData = [
        { color: 'White', count: 15 },
        { color: 'Blue', count: 12 },
        { color: 'Black', count: 8 },
        { color: 'Red', count: 10 },
        { color: 'Green', count: 22 },
        { color: 'Colorless', count: 7 }
    ];
    manaColor.build(manaColorData, manaColorContainer);
}

function populateCardList(cards) {
    const cardListContainer = document.getElementById("cardListContainer");
    cardListContainer.innerHTML = "";
    const list = document.createElement("ul");
    cards.forEach(card => {
        const listItem = document.createElement("li");
        listItem.innerHTML = card.name;
        // 绑定点击事件
        listItem.onclick = () => showCardDetails(card);
        list.appendChild(listItem);
    });
    cardListContainer.appendChild(list);
}

function showCardDetails(card) {
    const cardViewContainer = document.getElementById("cardViewContainer");
    cardViewContainer.innerHTML = `
        <h2>${card.name}</h2>
        <p>${card.text || "No description available."}</p>
        <p><strong>Mana Cost:</strong> ${card.manaCost || "N/A"}</p>
        <p><strong>Type:</strong> ${card.type || "N/A"}</p>
        <button id="addToDeckButton">Add to Deck</button>
    `;

    // 绑定按钮点击事件
    const addToDeckButton = document.getElementById("addToDeckButton");
    addToDeckButton.onclick = () => addToDeck(card);
}

function addToDeck(card) {
    const deckViewContainer = document.getElementById("deckViewContainer");

    const deckCard = document.createElement("div");
    deckCard.classList.add("deck-card");
    deckCard.innerHTML = `
        <p><strong>${card.name}</strong></p>
        <p>${card.type || "N/A"}</p>
        <button class="removeFromDeckButton">Remove</button>
    `;

    const removeButton = deckCard.querySelector(".removeFromDeckButton");
    removeButton.onclick = () => {
        deck = deck.filter(c => c !== card);
        deckViewContainer.removeChild(deckCard);
        updateStats();
    };

    deck.push(card);
    deckViewContainer.appendChild(deckCard);
    updateStats();
}
function updateStats() {
    const manaCostData = {};
    const manaColorData = {};

    deck.forEach(card => {
        const manaCost = card.manaCost || "N/A";
        if (manaCost !== "N/A") {
            manaCost.split('').forEach(cost => {
                if (!isNaN(cost)) {
                    manaCostData[cost] = (manaCostData[cost] || 0) + 1;
                }
            });
        }

        const colors = card.colors || ["Colorless"];
        colors.forEach(color => {
            manaColorData[color] = (manaColorData[color] || 0) + 1;
        });
    });

    const formattedManaCost = Object.entries(manaCostData).map(([cost, count]) => ({
        cost,
        count
    }));

    const formattedManaColor = Object.entries(manaColorData).map(([color, count]) => ({
        color,
        count
    }));

    const manaCost = new ManaCost();
    const manaCostContainer = document.getElementById("manaCostWidgetContainer");
    manaCostContainer.innerHTML = "";
    manaCost.build(formattedManaCost, manaCostContainer);

    const manaColor = new ManaColor();
    const manaColorContainer = document.getElementById("manaColorWidgetContainer");
    manaColorContainer.innerHTML = "";
    manaColor.build(formattedManaColor, manaColorContainer);
}

