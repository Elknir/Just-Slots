import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;
    private mask: PIXI.Graphics;


    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        // DONE : Create mask to hide symbols going outside
        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0xFFFFFF);
        this.mask.drawRect(0, 0, symbolCount * symbolSize, symbolSize);
        this.mask.endFill();
        this.container.mask = this.mask;
        this.container.addChild(this.mask);

        this.createSymbols();
    }

    private createSymbols(): void {
        // Create symbols for the reel, arranged horizontally
        for (let i = 0; i < this.symbolCount; i++) {
            const symbol = this.createRandomSymbol();
            symbol.x = i * this.symbolSize;
            this.symbols.push(symbol);
            this.container.addChild(symbol);
        }

    }

    private createRandomSymbol(): PIXI.Sprite {

        // DONE
        // TODO:Get a random symbol texture
        const randomIndex = Math.floor(Math.random() * SYMBOL_TEXTURES.length);
        const textureName = SYMBOL_TEXTURES[randomIndex];

        // DONE
        // TODO:Create a sprite with the texture
        const texture = AssetLoader.getTexture(textureName);

        //Have uniform symbol sizes
        const sprite = new PIXI.Sprite(texture);
        sprite.width = this.symbolSize;
        sprite.height = this.symbolSize;


        return sprite;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        // DONE
        // TODO:Move symbols horizontally
        for (const symbol of this.symbols) {
            symbol.x -= this.speed * delta;

            // if symbol is out on the left side put it back on the right side
            if (symbol.x <  -this.symbolSize) {
                symbol.x = (this.symbolCount - 1) * this.symbolSize;

                // new TODO: change to new random symbols
                const randomIndex = Math.floor(Math.random() * SYMBOL_TEXTURES.length);
                symbol.texture = AssetLoader.getTexture(SYMBOL_TEXTURES[randomIndex]);
            }
        }


        // If we're stopping, slow down the reel
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }


    private snapToGrid(): void {
        //DONE
        // TODO: Snap symbols to horizontal grid positions
        for (const symbol of this.symbols) {
            const snappedX = Math.round(symbol.x / this.symbolSize) * this.symbolSize;
            symbol.x = snappedX;
        }
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
    }
}
