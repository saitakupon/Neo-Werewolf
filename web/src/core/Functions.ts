import wolf from "../assets/cards/were-wolf.svg";
import crazy from "../assets/cards/crazy.svg";
import red from "../assets/cards/villager-red.svg";
import blue from "../assets/cards/villager-blue.svg";
import yellow from "../assets/cards/villager-yellow.svg";

export const getCard = (name: string): string => {
    let card: string = "";
    switch (name) {
        case "人狼":
            card = wolf;
            break;
        case "狂人":
            card = crazy;
            break;
        case "村人(赤色)":
            card = red;
            break;
        case "村人(青色)":
            card = blue;
            break;
        case "村人(黄色)":
            card = yellow;
            break;
    }
    return card;
}
