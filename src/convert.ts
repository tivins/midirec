import { MidiEvent } from "./MidiEvent";
import { Midi } from "@tonejs/midi";

export function convert(recordedEvents: MidiEvent[]) {
    type NoteData = { startTime: number; sustained: boolean };

    const midiFile = new Midi();
    const track = midiFile.addTrack();
    let currentTime = 0;
    let activeNotes: Record<number, NoteData[]> = {};
    let sustainActive = false;

    recordedEvents.forEach(event => {
        currentTime = event.time;
        const [status, note, velocity] = event.data;
        const command = status & 0xf0; // Extraire la commande MIDI

        if (command === 0x90 && velocity > 0) {
            // Note On (avec vélocité > 0)
            if (!activeNotes[note]) activeNotes[note] = [];
            activeNotes[note].push({ startTime: currentTime, sustained: sustainActive });

        } else if ((command === 0x80 || (command === 0x90 && velocity === 0)) && activeNotes[note]?.length) {
            // Note Off ou Note On avec vélocité 0 (équivalent à Note Off)
            if (sustainActive) {
                // Marquer la dernière note comme "sustained" pour qu'elle continue après son Note Off
                activeNotes[note][activeNotes[note].length - 1].sustained = true;
            } else {
                // Jouer toutes les notes enregistrées pour cette touche
                activeNotes[note].forEach(noteData => {
                    track.addNote({
                        midi: note,
                        time: noteData.startTime,
                        duration: currentTime - noteData.startTime
                    });
                });
                delete activeNotes[note];
            }

        } else if (command === 0xB0 && note === 64) {
            // Pédale de sustain (Control Change 64)
            if (velocity > 0) {
                sustainActive = true;
            } else {
                sustainActive = false;
                // Libérer toutes les notes qui étaient maintenues par le sustain
                Object.keys(activeNotes).forEach(n => {
                    const noteNumber = parseInt(n);
                    if (activeNotes[noteNumber]) {
                        activeNotes[noteNumber].forEach(noteData => {
                            track.addNote({
                                midi: noteNumber,
                                time: noteData.startTime,
                                duration: currentTime - noteData.startTime
                            });
                        });
                        delete activeNotes[noteNumber];
                    }
                });
            }
        }
    });

    return midiFile;
}
