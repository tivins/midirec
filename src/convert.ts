import {MidiEvent} from "./MidiEvent";
import {Midi} from "@tonejs/midi";

export function convert(recordedEvents: MidiEvent[]) {
    type NoteData = { startTime: number; sustained: boolean };

    const midiFile = new Midi();
    const track = midiFile.addTrack();
    let currentTime = 0;
    let activeNotes: Record<any, NoteData> = {};
    let sustainActive = false;

    recordedEvents.forEach(event => {
        currentTime += event.time;
        const [status, note, velocity] = event.data;
        const command = status & 0xf0; // Extraire la commande MIDI

        if (command === 0x90 && velocity > 0) {
            // Note On (avec vélocité > 0)
            activeNotes[note] = {startTime: currentTime, sustained: false};
        } else if ((command === 0x80 || (command === 0x90 && velocity === 0)) && activeNotes[note]) {
            // Note Off ou Note On avec vélocité 0 (équivalent à Note Off)
            if (sustainActive) {
                activeNotes[note].sustained = true; // La note est soutenue
            } else {
                // Ajouter la note avec sa durée
                track.addNote({
                    midi: note,
                    time: activeNotes[note].startTime,
                    duration: currentTime - activeNotes[note].startTime
                });
                delete activeNotes[note];
            }
        } else if (command === 0xB0 && note === 64) {
            // Pédale de sustain (Control Change 64)
            sustainActive = velocity >= 64; // Active si vélocité >= 64
            if (!sustainActive) {
                // Relâcher toutes les notes soutenues
                Object.keys(activeNotes).forEach(n => {
                    if (activeNotes[n].sustained) {
                        track.addNote({
                            midi: parseInt(n),
                            time: activeNotes[n].startTime,
                            duration: currentTime - activeNotes[n].startTime
                        });
                        delete activeNotes[n];
                    }
                });
            }
        }
    });
    return midiFile;
}