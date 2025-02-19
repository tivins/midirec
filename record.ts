import fs from 'fs';
import 'dotenv/config'
import {MidiEvent} from "./src/MidiEvent";
import {record} from "./src/record";
import {convert} from "./src/convert";
import {toWave} from "./src/toWave";


try {
    const baseFilename = `${process.env.OUTPUT}/record-midi-${new Date().getTime()}`;
    record((events: MidiEvent[]) => {
        const jsonFilename = `${baseFilename}.json`;
        const midiFilename = `${baseFilename}.mid`;
        const waveFilename = `${baseFilename}.wav`;

        fs.writeFileSync(jsonFilename, JSON.stringify(events));
        console.log(`JSON file saved: ${jsonFilename}`);
        const midi = convert(events);

        fs.writeFileSync(midiFilename, Buffer.from(midi.toArray()));
        console.log(`MIDI file saved: ${midiFilename}`);

        toWave(midiFilename,waveFilename, () => {
            console.log(`WAVE file saved: ${waveFilename}`);
        })
    })
}
catch (e) {
    console.error(e);
}