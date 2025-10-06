// TODO: Implement sound player using the "howler" package
import { Howl, Howler } from 'howler';

// Types pour gérer les sons
interface SoundMap {
    [key: string]: Howl;
}

export const sound = {
    sounds: {} as SoundMap,

    add: (alias: string, url: string): void => {
        try {
            //Check if sound exist
            if (sound.sounds[alias]) {
                console.warn(`Sound ${alias} already exists, skipping...`);
                return;
            }

            // Create new howl & preload it
            sound.sounds[alias] = new Howl({
                src: [url],
                preload: true,
                html5: true,
                onload: () => {
                    console.log(`Sound loaded successfully: ${alias}`);
                },
                onloaderror: (id, error) => {
                    console.error(`Failed to load sound: ${alias}`, error);
                },
                onplayerror: (id, error) => {
                    console.error(`Failed to play sound: ${alias}`, error);
                    // Reset if error
                    sound.sounds[alias].stop();
                }
            });

            console.log(`Sound added: ${alias} from ${url}`);
        } catch (error) {
            console.error(`Error adding sound ${alias}:`, error);
        }
    },

    play: (alias: string): void => {
        try {
            if (sound.sounds[alias]) {
                // Check if loaded
                if (sound.sounds[alias].state() === 'loaded') {
                    sound.sounds[alias].play();
                    console.log(`Playing sound: ${alias}`);
                }
                // Wait if not loaded
                else {
                    // Attendre que le son soit chargé puis le jouer
                    sound.sounds[alias].once('load', () => {
                        sound.sounds[alias].play();
                    });
                }
            } else {
                console.warn(`Sound not found: ${alias}`);
                // Play a default sound if not found
                const defaultSounds = Object.keys(sound.sounds);
                if (defaultSounds.length > 0) {
                    const fallbackSound = sound.sounds[defaultSounds[0]];
                    fallbackSound.play();
                    console.log(`Playing fallback sound: ${defaultSounds[0]}`);
                }
            }
        } catch (error) {
            console.error(`Error playing sound ${alias}:`, error);
        }
    },

    // DONE: Stop sound function
    stop: (alias: string): void => {
        if (sound.sounds[alias]) {
            sound.sounds[alias].stop();
        }
    },

};