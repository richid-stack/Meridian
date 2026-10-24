# Creates test files for the media tests (photos, invalid and oversized files, audio, PDF, video clips).
# Needs: pip install pillow ; ffmpeg on PATH.  Run:  python3 make_fixtures.py
from PIL import Image, ImageDraw
import wave, struct, math, random, os, subprocess
os.makedirs("fx", exist_ok=True); os.chdir("fx"); random.seed(4)
img=Image.new("RGB",(3600,2400),(30,80,60)); d=ImageDraw.Draw(img)
for i in range(40):
    x=random.randint(0,3000);y=random.randint(0,2000); d.ellipse([x,y,x+random.randint(200,600),y+random.randint(200,400)],outline=(227,179,65),width=12)
img.save("landscape.jpg",quality=92)
p=Image.new("RGB",(1500,2200),(120,60,40)); dp=ImageDraw.Draw(p)
for i in range(30):
    x=random.randint(0,1200);y=random.randint(0,1900); dp.rectangle([x,y,x+random.randint(100,300),y+random.randint(100,300)],outline=(233,239,234),width=10)
p.save("portrait.jpg",quality=90)
a=Image.new("RGBA",(800,800),(0,0,0,0)); ImageDraw.Draw(a).ellipse([100,100,700,700],fill=(227,179,65,255)); a.save("logo.png")
for n,c in [("third",(20,60,90)),("fourth",(90,40,70)),("fifth",(60,90,40))]: Image.new("RGB",(900,700),c).save(n+".jpg")
open("fake.jpg","w").write("this is not an image"); open("huge.jpg","wb").write(os.urandom(21*1024*1024))
w=wave.open("note.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(22050); fr=[]
for i in range(22050*6):
    t=i/22050; env=abs(math.sin(t*2.2))*0.8+0.1; fr.append(struct.pack("<h",int(env*12000*math.sin(2*math.pi*(220+60*math.sin(t))*t))))
w.writeframes(b"".join(fr)); w.close()
open("deck.pdf","wb").write(b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF")
subprocess.run("ffmpeg -loglevel error -y -f lavfi -i testsrc=duration=4:size=640x360:rate=24 -f lavfi -i sine=frequency=440:duration=4 -c:v libvpx -b:v 400k -c:a libvorbis clip.webm",shell=True,check=True)
subprocess.run("ffmpeg -loglevel error -y -f lavfi -i testsrc=duration=200:size=320x180:rate=5 -c:v libvpx -b:v 50k long.webm",shell=True,check=True)
print("fixtures ready")
