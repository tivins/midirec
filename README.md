# midirec
Recording MIDI and transform to wave/mp3

## Install


```shell
git clone git@github.com:tivins/midirec.git 
cd midirec
npm install
```

## Run
```shell
# plug your MIDI instrument
npm start
# start to play
```

## Convert an existing midi file
```shell
# synopsis
node render.js <midi file> [<soundfount file>]  

# use the default instrument (.env)
node render.js path/to/file.mid

# use the given instrument
node render.js path/to/file.mid path/to/instrument.sf2
```

----

## MIDI info
### Message
```text
Voice Message           Status Byte      Data Byte1          Data Byte2
-------------           -----------   -----------------   -----------------
Note off                      8x      Key number          Note Off velocity
Note on                       9x      Key number          Note on velocity
Polyphonic Key Pressure       Ax      Key number          Amount of pressure
Control Change                Bx      Controller number   Controller value
Program Change                Cx      Program number      None
Channel Pressure              Dx      Pressure value      None            
Pitch Bend                    Ex      MSB                 LSB
```