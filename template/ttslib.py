import warnings; warnings.filterwarnings("ignore")
import espeakng_loader
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library(espeakng_loader.get_library_path())
try: EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
except Exception as e:
    import os; os.environ["ESPEAK_DATA_PATH"] = espeakng_loader.get_data_path()
import numpy as np
from scipy import signal
from kokoro import KPipeline
_p = None
def pipe():
    global _p
    if _p is None: _p = KPipeline(lang_code='a')
    return _p
def f0_stats(x, sr):
    sos = signal.butter(4, [60,1000], btype="band", fs=sr, output="sos"); v = signal.sosfiltfilt(sos, x)
    w=int(0.04*sr); h=int(0.01*sr); out=[]
    for i in range(0,len(v)-w,h):
        seg=v[i:i+w]*np.hanning(w)
        if np.sum(seg**2)<1e-3: continue
        ac=signal.correlate(seg,seg,mode="full")[w-1:]; ac/=ac[0]+1e-12
        lo,hi=int(sr/350),int(sr/60); k=lo+np.argmax(ac[lo:hi])
        if ac[k]>0.55: out.append(sr/k)
    out=np.array(out)
    return (float(np.median(out)), float(np.percentile(out,10)), float(np.percentile(out,90))) if len(out) else (0,0,0)
def synth(text, voice, speed):
    chunks=[]; toks=[]; off=0.0
    for r in pipe()(text, voice=voice, speed=speed):
        a=r.audio.numpy(); 
        for t in (r.tokens or []):
            if t.start_ts is not None and t.end_ts is not None: toks.append((t.text, off+float(t.start_ts), off+float(t.end_ts)))
            else: toks.append((t.text, None, None))
        chunks.append(a); off += len(a)/24000
    return np.concatenate(chunks), toks
