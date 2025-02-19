import {exec} from "child_process";

export function toWave(midiFile: string, waveFile: string, callback: Function) {
    const cmd = `${process.env.FLUID} -ni ${process.env.INSTR} ${midiFile} -F ${waveFile} -r 44100`
    // console.log(cmd);
    exec(cmd, (error: any, stdout: string, stderr: string) => callback());
}