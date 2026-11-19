import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
# usage: sheet.py <dir> <out_prefix> [cols=3] [thumb_w=500]
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv)>3 else 3; tw = int(sys.argv[4]) if len(sys.argv)>4 else 500
files = sorted(glob.glob(os.path.join(d, "k_*.jpg")))
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
n=0
for i in range(0, len(files), cols):
    ch = files[i:i+cols]; th = int(1920*tw/1080)
    sh = Image.new("RGB", (cols*tw, th), (40,0,0))
    for j,f in enumerate(ch):
        im = Image.open(f).convert("RGB").resize((tw,th), Image.LANCZOS); dr = ImageDraw.Draw(im)
        lab = os.path.basename(f)[2:-4]+"s"; dr.rectangle([0,th-30,110,th], fill=(255,0,80)); dr.text((5,th-28), lab, fill="white", font=font)
        sh.paste(im, (j*tw,0))
    n+=1; p=f"{out}_{n:02d}.jpg"; sh.save(p, quality=88); print(p)
