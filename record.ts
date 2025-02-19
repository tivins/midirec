import fs from 'fs';
import 'dotenv/config'
import {MidiEvent} from "./src/MidiEvent";
import {record} from "./src/record";
import {convert} from "./src/convert";
import {toWave} from "./src/toWave";
import {exec} from "child_process";


try {
    const baseFilename = `${process.env.OUTPUT}/record-midi-${new Date().getTime()}`;
    record((events: MidiEvent[], streamPath:string) => {
        const jsonFilename = `${baseFilename}.json`;
        const midiFilename = `${baseFilename}.mid`;
        const waveFilename = `${baseFilename}.wav`;
        const mpegFilename = `${baseFilename}.mp3`;

        fs.writeFileSync(jsonFilename, JSON.stringify(events));
        console.log(`JSON file saved: ${jsonFilename}`);
        const midi = convert(events);

        fs.writeFileSync(midiFilename, Buffer.from(midi.toArray()));
        console.log(`MIDI file saved: ${midiFilename}`);

        toWave(midiFilename,waveFilename, () => {
            console.log(`WAVE file saved: ${waveFilename}`);

            exec(`"${process.env.FFMPEG}" -i "${waveFilename}" -b:a 192k "${mpegFilename}"`, (error: any,stdout:string,stderr:string) => {
                console.log(`MPEG file saved: ${mpegFilename}`);
            })
        })


    })
}
catch (e:Error|any) {
   console.error("Exception: " + e.message);
}