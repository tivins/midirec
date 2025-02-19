import {exec} from "child_process";
import 'dotenv/config'

export function toWave(midiFile: string, waveFile: string, callback: Function, instrument: string|null = null) {
    const cmd = `"${process.env.FLUID}" -ni "${instrument ?? process.env.INSTR}" "${midiFile}" -F "${waveFile}" -r 44100`
    // console.log(cmd);
    exec(cmd, (error: any, stdout: string, stderr: string) => {
        // console.log("Error: " + error);
        // console.log("Stdout: " + stdout);
        // console.log("Stderr: " + stderr);
        callback()
    });
}