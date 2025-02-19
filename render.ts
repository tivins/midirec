import {toWave} from "./src/toWave";

const midiFile = process.argv[2];
const instrument = process.argv[3] ?? null;
const waveFile = midiFile.replace('.mid',`_${new Date().getTime()}.wav`);

toWave(midiFile,waveFile, () => {
    console.log("WAVE file saved: " + waveFile);
}, instrument);