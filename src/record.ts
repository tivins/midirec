import midi from "midi";
import {MidiEvent} from "./MidiEvent";
import fs from "fs";

class MIDIInfo {
    static statusName(status:number): string {
        switch(status) {
            case 0x80: return "Note off";
            case 0x90: return "Note on";
            case 0xA0: return "Polyphonic Key Pressure";
            case 0xB0: return "Control Change";
        }
        return "unknown_" + status;
    }
}

export function record(callback: Function) {

    const toHex = (n:number) => {
        let str = n.toString(16).toUpperCase();
        return (str.length === 1 ? '0' : '') + str;
    }

    const input = new midi.Input

    if (input.getPortCount() === 0) {
        throw new Error('No MIDI device found');
    }

    console.log(`Recording from: ${input.getPortName(0)}`);

    const filePath = '.stream-buffer';
    // const writeStream = fs.createWriteStream(filePath, { flags: "w" });

    const events: MidiEvent[] = [];
    const startTime = process.hrtime();
    input.on('message', (deltaTime, message) => {
        const diff = process.hrtime(startTime);
        const absoluteTime = diff[0] + diff[1] / 1e9;

        const [status, note, velocity] = message;
        const command = status & 0xf0;
        console.log(`${deltaTime.toFixed(5)} - command=${toHex(command)} status=${toHex(status)} ${MIDIInfo.statusName(status)} note=${toHex(note)} velocity=${toHex(velocity)}`);

        if (note === 108) {
            input.closePort();
            console.log('End of recording.');
            callback(events, filePath);
        }
        const event: MidiEvent = { time: absoluteTime, data: message };
        // writeStream.write(JSON.stringify(event) + "\n");
        events.push(event);
    });

    // input.ignoreTypes(false, false, false);
    input.openPort(0);
}