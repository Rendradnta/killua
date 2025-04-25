/* If You Copy, Don`t Delete This Credit!!! 
  Don`t Sell This Script Or I Take Immediately 
  Yang Jual Script Ini Report/Hangusin Aja Akunnya Atau Pukulin ae orangnya
  Move To Pairing Code
  Buat Yg Nggk muncul Codenya Itu Disebabkan Oleh Banyaknya Plugins
  Jika Ingin Mengambil Sesi, Backup Semua File Plugins & Hapus Semua File Plugins
  Setelah Sudah Kalian Bisa Mengembalikan Semua File Pluginsnya Agar Bisa Dipakai
  Regards from YanXiao ♡
*/

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

import './config.js'; // Pastikan global.conn dan global.nomorown sudah diatur di sini

import path, { join } from 'path';
import { platform } from 'process';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).argv;

import { spawn } from 'child_process';
import lodash from 'lodash';
import syntaxerror from 'syntax-error';
import chalk from 'chalk';
import { tmpdir } from 'os';
import readline from 'readline';
import { format } from 'util';
import pino from 'pino';
import ws from 'ws';
import { Boom } from '@hapi/boom';

const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  PHONENUMBER_MCC,
} = await import('@adiwajshing/baileys');
import { Low, JSONFile } from 'lowdb';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import cloudDBAdapter from './lib/cloudDBAdapter.js';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';

const { CONNECTING } = ws;
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.API = (name, path = '/', query = {}, apikeyqueryname) =>
  (name in global.APIs ? global.APIs[name] : name) +
  path +
  (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '');

global.timestamp = {
  start: new Date(),
};

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp(
  '^[' +
    (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') +
    ']'
);

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '')
    ? new cloudDBAdapter(opts['db'])
    : /mongodb(\+srv)?:\/\//i.test(opts['db'])
    ? opts['mongodbv2']
      ? new mongoDBV2(opts['db'])
      : new mongoDB(opts['db'])
    : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
);
global.DATABASE = global.db; // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (db.READ) return new Promise((resolve) =>
    setInterval(async function () {
      if (!db.READ) {
        clearInterval(this);
        resolve(db.data == null ? global.loadDatabase() : db.data);
      }
    }, 1 * 1000)
  );
  if (db.data !== null) return;
  db.READ = true;
  await db.read().catch(console.error);
  db.READ = null;
  db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(db.data || {}),
  };
  global.db.chain = chain(db.data);
};
loadDatabase();

global.msg = new Low(new JSONFile('./database/topmessage.json'))
global.MSGDATABASE = global.msg // alias biar kalau mau backward compatible

global.loadMsgDatabase = async function loadMsgDatabase() {
  if (msg.READ) return new Promise((resolve) =>
    setInterval(async function () {
      if (!msg.READ) {
        clearInterval(this)
        resolve(msg.data == null ? global.loadMsgDatabase() : msg.data)
      }
    }, 1 * 1000)
  )
  if (msg.data !== null) return
  msg.READ = true
  await msg.read().catch(console.error)
  msg.READ = null
  msg.data = {
    ...(msg.data || {}),
  }
}
await loadMsgDatabase()


const usePairingCode = !process.argv.includes('--use-pairing-code');
const useMobile = process.argv.includes('--mobile');

var question = function (text) {
  return new Promise(function (resolve) {
    rl.question(text, resolve);
  });
};
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Define global handler variable here to fix the reference error
global.handler = {};
global.isInit = true;

const { version, isLatest } = await fetchLatestBaileysVersion();
const { state, saveCreds } = await useMultiFileAuthState('./sessions');
const connectionOptions = {
  version,
  logger: pino({ level: 'silent' }),
  printQRInTerminal: !usePairingCode,
  browser: ['Mac OS', 'safari', '5.1.10'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino().child({
      level: 'silent',
      stream: 'store',
    })),
  },
  getMessage: async (key) => {
    const messageData = await store.loadMessage(key.remoteJid, key.id);
    return messageData?.message || undefined;
  },
  generateHighQualityLinkPreview: true,
  patchMessageBeforeSending: (message) => {
    const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
    if (requiresPatch) {
      message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 2,
              deviceListMetadata: {},
            },
            ...message,
          },
        },
      };
    }
    return message;
  },
  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 0,
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
  markOnlineOnConnect: true,
};

global.conn = makeWASocket(connectionOptions);
conn.isInit = false;
conn.connectAttempts = 0;
const maxReconnectAttempts = 10;

if (usePairingCode && !conn.authState.creds.registered) {
  if (useMobile) throw new Error('Cannot use pairing code with mobile api');
  const { registration } = { registration: {} };
  let phoneNumber = global.pairing;
  console.log(chalk.bgWhite(chalk.blue('Generating code...')));
  setTimeout(async () => {
    let code = await conn.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join('-') || code;
    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)));
  }, 3000);
}

// New function for handling auto reconnection with exponential backoff
async function autoReconnect() {
  // Increment connection attempts
  global.conn.connectAttempts = (global.conn.connectAttempts || 0) + 1;
  
  // Calculate delay with exponential backoff (1s, 2s, 4s, 8s...)
  // with a maximum of 60 seconds between attempts
  const delay = Math.min(1000 * Math.pow(2, global.conn.connectAttempts - 1), 60000);
  
  console.log(chalk.yellow(`Mencoba menyambung ulang dalam ${delay/1000} detik... (Percobaan ke-${global.conn.connectAttempts})`));
  
  // Notify owner if multiple reconnection attempts are occurring
  if (global.conn.connectAttempts === 3 || global.conn.connectAttempts === 7) {
    try {
      await conn.sendMessage(global.nomorown + "@s.whatsapp.net", {
        text: `⚠️ Bot sedang mengalami masalah koneksi (Percobaan ke-${global.conn.connectAttempts})`
      });
    } catch {}
  }
  
  // If too many reconnection attempts, notify and restart process
  if (global.conn.connectAttempts > maxReconnectAttempts) {
    console.log(chalk.red(`Gagal menyambung setelah ${maxReconnectAttempts} percobaan, mencoba restart bot...`));
    try {
      await conn.sendMessage(global.nomorown + "@s.whatsapp.net", {
        text: `🔄 Bot direstart otomatis karena gagal menyambung setelah ${maxReconnectAttempts} percobaan.`
      });
    } catch {}
    
    // Force process restart
    process.exit(1);
  }
  
  // Wait for the calculated delay
  setTimeout(async () => {
    console.log(chalk.green('Mencoba menyambung ulang...'));
    await global.reloadHandler(true);
  }, delay);
}

async function resetLimit() {
  try {
    let list = Object.entries(global.db.data.users);
    let lim = 25; // Nilai limit default yang ingin di-reset

    list.map(([user, data], i) => {
      if (data.limit <= lim) {
        data.limit = lim;
      }
    });

    console.log(`Success Auto Reset Limit`);
  } finally {
    setInterval(() => resetLimit(), 1 * 86400000);
  }
}

if (!opts['test']) {
  (await import('./server.js')).default(PORT);
  setInterval(async () => {
    if (global.db.data) await global.db.write().catch(console.error);
    if (global.msg.data) await global.db.write().catch(console.error);
  }, 60 * 1000);
}

function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && Date.now() - stats.mtimeMs >= 1000 * 60 * 3) return unlinkSync(file); // 3 minutes
    return false;
  });
}

async function clearSessions(folder = './sessions') {
  try {
    const filenames = await readdirSync(folder);
    const deletedFiles = await Promise.all(
      filenames.map(async (file) => {
        try {
          const filePath = path.join(folder, file);
          const stats = await statSync(filePath);
          if (stats.isFile() && file !== 'creds.json') {
            await unlinkSync(filePath);
            console.log('Deleted session:'.main, filePath.info);
            return filePath;
          }
        } catch (err) {
          console.error(`Error processing ${file}: ${err.message}`);
        }
      })
    );
    return deletedFiles.filter((file) => file !== null);
  } catch (err) {
    console.error(`Error in Clear Sessions: ${err.message}`);
    return [];
  } finally {
    setTimeout(() => clearSessions(folder), 1 * 3600000); // 1 Hours
  }
}

async function connectionUpdate(update) {
  const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;

  if (isNewLogin) {
    conn.isInit = true;
  }

  if (connection == 'connecting') {
    console.log(chalk.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'));
  } else if (connection == 'open') {
    console.log(chalk.green('✅ Tersambung'));
    // Reset reconnect attempt counter when successfully connected
    conn.connectAttempts = 0;
  }

  if (isOnline == true) {
    console.log(chalk.green('Status Aktif'));
  } else if (isOnline == false) {
    console.log(chalk.red('Status Mati'));
  }

  if (receivedPendingNotifications) {
    console.log(chalk.yellow('Menunggu Pesan Baru'));
    conn.sendMessage("6285877162760@s.whatsapp.net", { text: `*BOT SUCCES CONNECT*\n\n> *Username:* ${global.username}\n> *Owner:* ${global.nomorown}\n\n_Script ini di jual terbatas dan memiliki security, jika menemukan ada yang menjual dengan harga yang lebih murah, mohon hubungi pemilik script, untuk infonya scriptnya ada di bawah_`,
     footer: "Renzy - 2025",
     buttons: [ 
         { buttonId: `.sc`,
          buttonText: {
              displayText: '📃 SCRIPT BOT'
          }, type: 1 }
     ],
     headerType: 1,
     viewOnce: true
    });
  }

  if (connection == 'close') {
    console.log(chalk.red('⏱️ Koneksi terputus & mencoba menyambung ulang...'));
    
    // Check if logged out or if there's another error
    let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    console.log('Disconnect reason:', reason);
    
    if (reason === DisconnectReason.loggedOut) {
      console.log(chalk.red('Session telah expired, harap buat session baru'));
      // Optionally notify owner about session expiry
      try {
        await conn.sendMessage(global.nomorown + "@s.whatsapp.net", {
          text: "❌ Session telah expired, bot memerlukan session baru."
        });
      } catch {}
      process.exit(1);
    } else {
      // If not logged out, attempt to reconnect with exponential backoff
      await autoReconnect();
    }
  }

  global.timestamp.connect = new Date();

  if (global.db.data == null) {
    await global.loadDatabase();
  }
}

global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(Handler || {}).length) global.handler = Handler;
  } catch (e) {
    console.error(e);
  }
  if (restatConn) {
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch {}
    conn.ev.removeAllListeners();
    
    // Add a watchdog timer for connection
    let connectionTimer = setTimeout(() => {
      console.log(chalk.red('Connection timed out, retrying...'));
      autoReconnect();
    }, 30000); // 30 second timeout
    
    global.conn = makeWASocket(connectionOptions, { chats: oldChats });
    
    // Clear the watchdog timer if connection is successful
    conn.ev.on('connection.update', (update) => {
      if (update.connection === 'open') {
        clearTimeout(connectionTimer);
      }
    });
    
    global.isInit = true;
  }
  
  // Rest of the reloadHandler function remains the same
  if (!global.isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('group-participants.update', conn.participantsUpdate);
    conn.ev.off('groups.update', conn.groupsUpdate);
    conn.ev.off('message.delete', conn.onDelete);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

  conn.welcome = '❖━━━━━━[ Selamat Datang ]━━━━━━❖\n\n┏––––––━━━━━━━━•\n│☘︎ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Hallo @user)\n├[ Intro ]—\n│ NAMA: \n│ USIA: \n│ JENIS KELAMIN:\n┗––––––━━┅┅┅\n\n––––––┅┅ DESKRIPSI ┅┅––––––\n@desc';
  conn.bye = '❖━━━━━━[ Meninggalkan ]━━━━━━❖\n𝚂𝚊𝚢𝚘𝚗𝚊𝚛𝚊𝚊 @user 👋😃';
  conn.spromote = '@user Sekarang jadi admin!';
  conn.sdemote = '@user Sekarang bukan lagi admin!';
  conn.sDesc = 'Deskripsi telah diubah menjadi \n@desc';
  conn.sSubject = 'Judul grup telah diubah menjadi \n@subject';
  conn.sIcon = 'Icon grup telah diubah!';
  conn.sRevoke = 'Link group telah diubah ke \n@revoke';
  conn.sAnnounceOn = 'Group telah di tutup!\nsekarang hanya admin yang dapat mengirim pesan.';
  conn.sAnnounceOff = 'Group telah di buka!\nsekarang semua peserta dapat mengirim pesan.';
  conn.sRestrictOn = 'Edit Info Grup di ubah ke hanya admin!';
  conn.sRestrictOff = 'Edit Info Grup di ubah ke semua peserta!';

  conn.handler = handler.handler.bind(global.conn);
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
  conn.onDelete = handler.deleteUpdate.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn);

  conn.ev.on('call', async (call) => {
    console.log('Panggilan diterima:', call);
    if (call.status === 'ringing') {
      await conn.rejectCall(call.id);
      console.log('Panggilan ditolak');
    }
  });
  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('group-participants.update', conn.participantsUpdate);
  conn.ev.on('groups.update', conn.groupsUpdate);
  conn.ev.on('message.delete', conn.onDelete);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);
  global.isInit = false;
  return true;
};

// Add a heartbeat mechanism to detect connection issues
setInterval(async () => {
  if (global.conn?.user && global.conn.ws.readyState === ws.OPEN) {
    try {
      // Ping the server to check connection
      await global.conn.sendPresenceUpdate('available', global.conn.user.id);
    } catch (err) {
      console.error('Heartbeat check failed:', err);
      // If ping fails, try to reconnect
      if (global.conn.ws.readyState !== ws.CONNECTING) {
        console.log(chalk.yellow('Connection heartbeat failed, reconnecting...'));
        await autoReconnect();
      }
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function filesInit() {
  const pluginSubfolders = readdirSync(pluginFolder, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Load plugins dari folder utama
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(e);
      delete global.plugins[filename];
    }
  }

  // Load plugins dari subfolder
  for (const subfolder of pluginSubfolders) {
    const subfolderPath = join(pluginFolder, subfolder);
    for (let filename of readdirSync(subfolderPath).filter(pluginFilter)) {
      try {
        let file = global.__filename(join(subfolderPath, filename));
        const module = await import(file);
        global.plugins[`${subfolder}/${filename}`] = module.default || module;
      } catch (e) {
        conn.logger.error(e);
        delete global.plugins[`${subfolder}/${filename}`];
      }
    }
  }
}

filesInit().then(() => console.log(Object.keys(global.plugins))).catch(console.error);

global.reload = async (eventType, filename, subfolder = '') => {
  if (pluginFilter(filename)) {
    let dir;
    let pluginPath;
    
    if (subfolder) {
      dir = global.__filename(join(pluginFolder, subfolder, filename), true);
      pluginPath = `${subfolder}/${filename}`;
    } else {
      dir = global.__filename(join(pluginFolder, filename), true);
      pluginPath = filename;
    }

    if (pluginPath in global.plugins) {
      if (existsSync(dir)) {
        conn.logger.info(`Reloading plugin '${pluginPath}'`);
        delete require.cache[require.resolve(dir)];
      } else {
        conn.logger.warn(`Deleted plugin '${pluginPath}'`);
        return delete global.plugins[pluginPath];
      }
    } else {
      conn.logger.info(`Loading new plugin '${pluginPath}'`);
    }

    try {
      const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
      global.plugins[pluginPath] = module.default || module;
      console.log(chalk.green(`Plugin '${pluginPath}' reloaded successfully.`));

      // Kirim notifikasi ke pemilik bot
      if (global.conn && global.nomorown) {
        await conn.sendMessage(global.nomorown + "@s.whatsapp.net", {
          text: `Plugin '${pluginPath}' berhasil di-reload.`,
        }).catch((err) => {
          console.error(chalk.red(`Gagal mengirim notifikasi: ${err.message}`));
        });
      }
    } catch (e) {
      conn.logger.error(`Error reloading plugin '${pluginPath}':`, e);

      // Kirim notifikasi error ke pemilik bot
      if (global.conn && global.nomorown) {
        await conn.sendMessage(global.nomorown + "@s.whatsapp.net", {
          text: `Gagal reload plugin '${pluginPath}': ${e.message}`,
        }).catch((err) => {
          console.error(chalk.red(`Gagal mengirim notifikasi: ${err.message}`));
        });
      }
    }
  }
};

const watchPluginFolder = (folder, subfolder = '') => {
  watch(folder, (eventType, filename) => {
    if (filename && pluginFilter(filename)) {
      global.reload(eventType, filename, subfolder).catch((err) => {
        console.error(chalk.red(`Failed to reload plugin '${subfolder ? `${subfolder}/${filename}` : filename}':`, err));
      });
    }
  });
};

// Memantau folder utama plugins
watchPluginFolder(pluginFolder);

// Memantau subfolder di dalam plugins
const pluginSubfolders = readdirSync(pluginFolder, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

for (const subfolder of pluginSubfolders) {
  const subfolderPath = join(pluginFolder, subfolder);
  watchPluginFolder(subfolderPath, subfolder);
}

await global.reloadHandler();

// Add error handling for process-wide exceptions to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Try to notify owner
  try {
    if (global.conn && global.conn.user && global.nomorown) {
      global.conn.sendMessage(global.nomorown + "@s.whatsapp.net", {
        text: `❌ Bot mengalami error: ${err.message}\n\nBot akan mencoba tetap berjalan.`
      });
    }
  } catch {}
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Tidak perlu exit process karena kita ingin bot tetap berjalan
});

async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version']),
  ].map((p) => {
    return Promise.race([
      new Promise((resolve) => {
        p.on('close', (code) => {
          resolve(code !== 127);
        });
      }),
      new Promise((resolve) => {
        p.on('error', (_) => resolve(false));
      }),
    ]);
  }));

  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  console.log(test);

  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find,
  };

  Object.freeze(global.support);

  if (!s.ffmpeg) {
    conn.logger.warn(`Silahkan install ffmpeg terlebih dahulu agar bisa mengirim video`);
  }

  if (s.ffmpeg && !s.ffmpegWebp) {
    conn.logger.warn('Sticker Mungkin Tidak Beranimasi tanpa libwebp di ffmpeg (--enable-libwebp while compiling ffmpeg)');
  }

  if (!s.convert && !s.magick && !s.gm) {
    conn.logger.warn('Fitur Stiker Mungkin Tidak Bekerja Tanpa imagemagick dan libwebp di ffmpeg belum terinstall (pkg install imagemagick)');
  }
}

_quickTest()
  .then(() => conn.logger.info('☑️ Quick Test Done , nama file session ~> creds.json'))
  .catch(console.error);