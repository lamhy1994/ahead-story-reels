# Numeric checks on a finished episode. Usage: python3 qa.py out/name.mp4 <expected frames>
import sys, json, re, subprocess, numpy as np
F, NF = sys.argv[1], int(sys.argv[2]); bad = []
pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_frames:format=duration,size", "-of", "json", F], capture_output=True, text=True).stdout)
v = [s for s in pr["streams"] if s["codec_type"] == "video"][0]
print(f"file: {float(pr['format']['duration']):.2f} s, {int(pr['format']['size'])/1e6:.1f} MB, {v['width']}x{v['height']} @ {v['r_frame_rate']}, {v['nb_frames']} frames")
if (v["width"], v["height"]) != (1080, 1920): bad.append("size is not 1080x1920")
if int(v["nb_frames"]) != NF: bad.append(f"frame count {v['nb_frames']} != {NF}")
lo = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", F, "-vn", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", lo)[-1]); PK = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", lo)[-1])
print(f"loudness {I} LUFS, true peak {PK} dBFS")
if abs(I + 14) > 1: bad.append(f"loudness {I} LUFS (want -14 ±1)")
if PK > -1: bad.append(f"true peak {PK} dBFS (want <= -1)")
w, h = 216, 384
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", F, "-vf", f"scale={w}:{h},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32); d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
cuts = [round(i / 30, 2) for i in np.where(d > 45)[0]]; print("hard cuts:", cuts or "none")
for b in range(240, len(fr), 240):
    nb = np.r_[d[b - 6:b - 1], d[b:b + 5]]
    if d[b - 1] > max(nb.max() * 1.6, nb.mean() + 0.3): bad.append(f"segment join at {b/30:.1f}s jumps ({d[b-1]:.2f} vs {nb.max():.2f}); re-render the segments on both sides from the same code")
run = 0; worst = 0
for x in d: run = run + 1 if x < 0.03 else 0; worst = max(worst, run)
if worst > 20: bad.append(f"picture frozen for {worst/30:.1f}s")
sd = fr[:, 120:330, 20:196].std(axis=(1, 2)); flat = sorted(set(np.round(np.where(sd < 6)[0] / 30, 1).tolist()))
if flat: bad.append(f"nearly flat frames (camera inside something?) at {flat[:12]}")
slow = min((float(d[i:i + 60].mean()), round(i / 30, 1)) for i in range(0, len(d) - 60, 15))
print(f"median change per frame {np.median(d):.2f}; calmest 2 s starts at {slow[1]} s ({slow[0]:.2f})")
print("RESULT:", "PASS" if not bad else "FAIL"); [print(" -", b) for b in bad]
sys.exit(1 if bad else 0)
