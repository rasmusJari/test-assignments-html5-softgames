import {FancyButton} from "@pixi/ui";
import {Sprite} from "pixi.js";

export function createFancyButton(text: string, defaultSprite: Sprite, hoverSprite: Sprite, pressSprite: Sprite, animation: any , onPress: () => void) : FancyButton {
    const button = new FancyButton({
        text,
        padding: 10,
        defaultView: defaultSprite,
        hoverView: hoverSprite,
        pressedView: pressSprite,
        animations: animation
    });

    button.onPress.connect(onPress);

    button.position.set(
        window.innerWidth * 0.5,
        window.innerHeight * 0.6
    );

    return button;
}