import midi from "midi";
import {MidiEvent} from "./MidiEvent";

export function record(callback: Function) {

    const input = new midi.Input

    if (input.getPortCount() === 0) {
        throw new Error('No MIDI device found');
    }

    console.log(`Recording from: ${input.getPortName(0)}`);

    const events: MidiEvent[] = [];

    input.on('message', (deltaTime, message) => {

        const [status, note, velocity] = message;
        const command = status & 0xf0;

        console.log(`${deltaTime.toFixed(5)} - command=${command.toString(16)} status=${status.toString(16)} note=${note.toString(16)} velocity=${velocity.toString(16)}`);

        if (note === 108) {
            input.closePort();
            console.log('End of recording.');
            callback(events);
        }

        events.push({time: deltaTime, data: message});
    });

    // input.ignoreTypes(false, false, false);
    input.openPort(0);
}