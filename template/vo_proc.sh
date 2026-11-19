#!/bin/bash
# voice polish (no pitch shift): 48 kHz mono, gentle EQ, light compression, safety limiter
ffmpeg -v error -y -i audio/vo_final.wav -af "aresample=48000,highpass=f=70,equalizer=f=160:t=q:w=1.0:g=1.5,equalizer=f=350:t=q:w=1.2:g=-1.5,equalizer=f=3200:t=q:w=1.0:g=2.5,highshelf=f=9000:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=3,alimiter=limit=0.93" -ac 1 -ar 48000 audio/vo_proc.wav
