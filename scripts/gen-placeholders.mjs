import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) {
    crc ^= b;
    for (let i = 0; i < 8; i++)
      crc = crc & 1 ? (0xedb88320 ^ (crc >>> 1)) : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function makePng(r, g, b, w = 64, h = 64) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB color type
  const rowLen = 1 + w * 3;
  const raw = Buffer.alloc(rowLen * h);
  for (let y = 0; y < h; y++) {
    const base = y * rowLen;
    raw[base] = 0; // filter none
    for (let x = 0; x < w; x++) {
      raw[base + 1 + x * 3] = r;
      raw[base + 1 + x * 3 + 1] = g;
      raw[base + 1 + x * 3 + 2] = b;
    }
  }
  const idat = deflateSync(raw);
  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function write(relPath, r, g, b) {
  const full = join(publicDir, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, makePng(r, g, b));
  console.log("wrote", relPath);
}

// NPC — purple for Kael, red for Ryo
write("images/npc/master-kael.png",          124, 58, 237);
write("images/npc/master-kael-proud.png",    200, 100, 20);
write("images/npc/master-kael-surprised.png", 200, 100, 20);
write("images/npc/ryo.png",                  180, 30, 30);
write("images/npc/ryo-shocked.png",          180, 30, 30);

// Backgrounds
write("images/bg/dojo.png",           50, 30, 10);
write("images/bg/training-ground.png", 15, 35, 15);
write("images/bg/night-city.png",      10, 15, 50);
write("images/bg/storm.png",           30, 30, 45);
write("images/bg/mountain.png",        15, 35, 40);
write("images/bg/zenkai.png",          50, 35,  0);
write("images/bg/void.png",             5,  5, 10);

// Characters — saiyan orange, shadow purple, guardian grey
write("images/characters/saiyan-1.png",   200, 80, 20);
write("images/characters/saiyan-2.png",   220, 90, 25);
write("images/characters/saiyan-3.png",   240,110, 30);
write("images/characters/assassin-1.png",  80, 20,160);
write("images/characters/assassin-2.png",  90, 30,180);
write("images/characters/assassin-3.png", 110, 40,200);
write("images/characters/guardian-1.png",  70, 70, 80);
write("images/characters/guardian-2.png",  85, 85, 95);
write("images/characters/guardian-3.png", 100,100,115);

// Enemies — dark red
write("images/enemies/enemy-grunt-1.png",     140, 20, 20);
write("images/enemies/enemy-grunt-2.png",     150, 25, 20);
write("images/enemies/enemy-grunt-3.png",     160, 25, 20);
write("images/enemies/enemy-grunt-4.png",     165, 30, 20);
write("images/enemies/enemy-grunt-5.png",     170, 30, 20);
write("images/enemies/boss-shadow-general.png", 60, 10,100);
write("images/enemies/boss-ryo.png",           180, 20, 20);
write("images/enemies/boss-dark-self.png",      20, 20, 20);

console.log("done");
