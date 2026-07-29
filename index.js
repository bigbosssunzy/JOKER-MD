/**
 * 🤡🃏𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑🃏🤡 - A WhatsApp Bot
 * Copyright (c) 2026 🦊⃟ᴛᷦ𝐡ͧ𝐜ᷡ𝐜ᷦ𝐜ꙷ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 * - Pair Code implementation inspired by TechGod143 & DGXEON
 */

// ==========================================
// 🌐 EXPRESS WEB SERVER (Render & Panel Compatibility)
// ==========================================
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🤡🃏 𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑 🃏🤡 - WhatsApp Bot is Online and Active!');
});

app.listen(PORT, () => {
    console.log(`🌐 Web server is running and listening on port ${PORT}`);
});

// ==========================================
// 🚀 PRODUCTION & DISK FLUSH PERFORMANCE ENVIRONMENT
// ==========================================
process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
process.env.PUPPETEER_CACHE_DIR = process.env.PUPPETEER_CACHE_DIR || '/tmp/puppeteer_cache_disabled';

// ==========================================
// 🧹 AGGRESSIVE CONSOLE LOG NOISE FILTER
// ==========================================
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const forbiddenPatternsConsole = [
  'closing session', 'closing open session', 'sessionentry', 'prekey bundle',
  'pendingprekey', '_chains', 'registrationid', 'currentratchet', 'chainkey',
  'ratchet', 'signal protocol', 'ephemeralkeypair', 'indexinfo', 'basekey', 'ratchetkey'
];

const filterLog = (originalMethod) => (...args) => {
  const message = args.map(a => typeof a === 'string' ? a : typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ').toLowerCase();
  if (!forbiddenPatternsConsole.some(pattern => message.includes(pattern))) {
    originalMethod.apply(console, args);
  }
};
console.log = filterLog(originalConsoleLog);
console.error = filterLog(originalConsoleError);
console.warn = filterLog(originalConsoleWarn);

// ==========================================
// 📦 DEPENDENCIES & CORE PACKAGES
// ==========================================
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const zlib = require('zlib')
const os = require('os')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const { handleStatusUpdate } = require('./commands/autostatus');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')

const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./lib/myfunc')

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// ==========================================
// 📥 AUTOMATED DYNAMIC COMMAND LOADER ENGINE
// ==========================================
global.commands = new Map();

function loadCommands() {
    const commandsDir = path.join(process.cwd(), 'commands');
    
    if (!fs.existsSync(commandsDir)) {
        fs.mkdirSync(commandsDir, { recursive: true });
    }

    const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    console.log(chalk.red.bold(`\n📦 Indexing Command Repositories...`));
    global.commands.clear(); 

    for (const file of files) {
        try {
            const filePath = path.join(commandsDir, file);
            delete require.cache[require.resolve(filePath)]; 
            const command = require(filePath);

            if (command.name) {
                global.commands.set(command.name.toLowerCase(), command);
                
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => {
                        global.commands.set(alias.toLowerCase(), command);
                    });
                }
            }
        } catch (error) {
            console.error(chalk.red(`❌ Failed to load file ${file}:`), error);
        }
    }
    console.log(chalk.green(`✅ Loaded ${global.commands.size} execution endpoints successfully.`));
}

// Import lightweight store & settings
const store = require('./lib/lightweight_store')
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

const processedMessages = new Set();
setInterval(() => processedMessages.clear(), 5 * 60 * 1000);

setInterval(() => {
    if (global.gc) global.gc()
}, 60_000)

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high (>400MB), restarting bot...')
        process.exit(1)
    }
}, 30_000);

(() => {
  try {
    const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer');
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
  } catch (err) {}
})();

let phoneNumber = "911234567890"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "🤡🃏𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑🃏🤡"
global.themeemoji = "•"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) return new Promise((resolve) => rl.question(text, resolve))
    return Promise.resolve(settings.ownerNumber || phoneNumber)
}

const isSystemJid = (jid) => {
    if (!jid) return true;
    if (jid === 'status@broadcast') return false; // Allow status broadcasts through
    return jid.includes('@broadcast') || jid.includes('status.broadcast') || jid.includes('@newsletter');
};

async function startXeonBotInc() {
    try {
        loadCommands();

        // Automatically create session folder if missing
        const sessionFolder = `./session`;
        if (!fs.existsSync(sessionFolder)) {
            fs.mkdirSync(sessionFolder, { recursive: true });
        }
        const sessionFile = path.join(sessionFolder, 'creds.json');

        if (settings.sessionID && settings.sessionID.startsWith('KnightBot!')) {
            try {
                const [header, b64data] = settings.sessionID.split('!');
                if (header === 'KnightBot' && b64data) {
                    const cleanB64 = b64data.replace('...', '');
                    const compressedData = Buffer.from(cleanB64, 'base64');
                    const decompressedData = zlib.gunzipSync(compressedData);
                    
                    fs.writeFileSync(sessionFile, decompressedData, 'utf8');
                    console.log('📡 Session : 🔑 Retrieved from Custom Compressed Token String');
                }
            } catch (e) {
                console.error('📡 Session Parsing Failure: Falling back to standard workflow.', e.message);
            }
        }

        let { version, isLatest } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)
        const msgRetryCounterCache = new NodeCache()

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: false,
            syncFullHistory: false,
            downloadHistory: false,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        })

        XeonBotInc.ev.on('creds.update', saveCreds)
        store.bind(XeonBotInc.ev)

        let lastActivity = Date.now();
        const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

        const watchdogInterval = setInterval(async () => {
            if (Date.now() - lastActivity > INACTIVITY_TIMEOUT && XeonBotInc.ws?.readyState === 1) {
                console.log('⚠️ Engine detected dead socket link. Forcing reconnect cycle...');
                await XeonBotInc.end(undefined, undefined, { reason: 'inactive' });
                clearInterval(watchdogInterval);
                setTimeout(() => startXeonBotInc(), 5000);
            }
        }, 5 * 60 * 1000);

        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            try {
                if (chatUpdate.type !== 'notify') return;

                const mek = chatUpdate.messages[0]
                if (!mek || !mek.message || !mek.key?.id) return
                
                const chatId = mek.key.remoteJid;
                const time = new Date().toLocaleTimeString();

                // Handle incoming WhatsApp Status Updates with custom name display
                if (chatId === 'status@broadcast') {
                    const poster = mek.key.participant || mek.participant || 'Unknown';
                    const posterNumber = poster.split('@')[0];
                    let posterName = 'Unknown User';
                    try {
                        posterName = await XeonBotInc.getName(poster) || mek.pushName || `+${posterNumber}`;
                    } catch (e) {
                        posterName = mek.pushName || `+${posterNumber}`;
                    }

                    console.log(chalk.yellowBright(`\n📱 status post by ${posterName} at ${time}`));
                    
                    // Trigger AutoStatus View & Reaction Handler
                    await handleStatusUpdate(XeonBotInc, chatUpdate);
                    
                    console.log(chalk.greenBright(`👁️ [AUTO-VIEW SUCCESS] Bot viewed & processed status from ${posterName}\n`));
                    return;
                }

                if (!chatId || isSystemJid(chatId)) return;

                if (processedMessages.has(mek.key.id)) return;
                if (mek.messageTimestamp) {
                    const messageAge = Date.now() - (mek.messageTimestamp * 1000);
                    if (messageAge > 5 * 60 * 1000) return;
                }
                processedMessages.add(mek.key.id);
                lastActivity = Date.now();

                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                
                const isGroup = chatId.endsWith('@g.us');
                const fromMe = mek.key.fromMe;
                const senderNumber = (mek.key.participant || mek.key.remoteJid).split('@')[0];
                const pushName = mek.pushName || 'Unknown User';
                const chatType = isGroup ? 'GROUP CHAT' : 'PRIVATE DM';

                const cleanText = mek.message?.conversation || 
                                  mek.message?.extendedTextMessage?.text || 
                                  mek.message?.imageMessage?.caption || 
                                  mek.message?.videoMessage?.caption || '';

                let contentSummary = cleanText;
                if (mek.message?.imageMessage) contentSummary = `🖼️ [Photo] ${cleanText}`.trim();
                if (mek.message?.videoMessage) contentSummary = `🎥 [Video] ${cleanText}`.trim();
                if (mek.message?.stickerMessage) contentSummary = `🎨 [Sticker]`;
                if (mek.message?.audioMessage) contentSummary = `🎵 [Audio/Voice Note]`;
                if (mek.message?.documentMessage) contentSummary = `📁 [Document: ${mek.message.documentMessage.fileName || 'File'}]`;

                if (fromMe) {
                    console.log(
                        chalk.cyan(`\n--- 📤 MESSAGE SENT ---`) +
                        chalk.white(`\n💬 Chat Type : `) + chalk.green(chatType) +
                        chalk.white(`\n👤 Receiver  : `) + chalk.yellow(chatId.split('@')[0]) +
                        chalk.white('\n🕒 Time      : ') + chalk.gray(time) +
                        chalk.white(`\n📝 Message   : `) + chalk.greenBright(contentSummary || '[System/Media Message]') +
                        chalk.cyan(`\n-----------------------\n`)
                    );
                } else {
                    console.log(
                        chalk.magenta(`\n--- 📥 MESSAGE RECEIVED ---`) +
                        chalk.white(`\n💬 Chat Type : `) + chalk.green(chatType) +
                        chalk.white(`\n👤 Sender    : `) + chalk.yellow(pushName) +
                        chalk.white(`\n📱 Number    : `) + chalk.yellowBright(`+${senderNumber}`) +
                        chalk.white('\n🕒 Time      : ') + chalk.gray(time) +
                        chalk.white(`\n📝 Message   : `) + chalk.cyanBright(contentSummary || '[Media/Empty]') +
                        chalk.magenta(`\n---------------------------\n`)
                    );
                }

                if (!XeonBotInc.public && !mek.key.fromMe) return;
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

                if (XeonBotInc?.msgRetryCounterCache) XeonBotInc.msgRetryCounterCache.clear()

                handleMessages(XeonBotInc, chatUpdate, true).catch(err => {
                    if (!err.message?.includes('rate-overlimit')) console.error("Error in handleMessages:", err.message);
                });

                setImmediate(async () => {
                    if (settings.autoRead && chatId.endsWith('@g.us')) {
                        try { await XeonBotInc.readMessages([mek.key]); } catch (e) {}
                    }
                });

            } catch (err) {
                console.error("Error in messages.upsert:", err)
            }
        })

        XeonBotInc.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }

        XeonBotInc.ev.on('contacts.update', update => {
            for (let contact of update) {
                let id = XeonBotInc.decodeJid(contact.id)
                if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
            }
        })

        XeonBotInc.getName = (jid, withoutContact = false) => {
            let id = XeonBotInc.decodeJid(jid)
            withoutContact = XeonBotInc.withoutContact || withoutContact
            let v
            if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
                v = store.contacts[id] || {}
                if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
                resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
            })
            else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ? XeonBotInc.user : (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
        }

        XeonBotInc.public = true
        XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

        if (pairingCode && !XeonBotInc.authState.creds.registered) {
            if (useMobile) throw new Error('Cannot use pairing code with mobile api')

            let phoneNumber = global.phoneNumber || await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 6281376552730: `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

            setTimeout(async () => {
                try {
                    let code = await XeonBotInc.requestPairingCode(phoneNumber)
                    code = code?.match(/.{1,4}/g)?.join("-") || code
                    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
                } catch (error) {
                    console.error('Error requesting pairing code:', error)
                }
            }, 3000)
        }

        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s
            
            if (qr) console.log(chalk.yellow('📱 QR Code generated.'))
            if (connection === 'connecting') console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            
            if (connection == "open") {
                console.clear();
                console.log(chalk.red.bold(`
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@   @@@@@@   @@@@@@@@@@@@@@
       @@@@@@@@@@@@       @@@@       @@@@@@@@@@@
       @@@@@@@@@@   ▄▄▄   @@@@   ▄▄▄   @@@@@@@@@
       @@@@@@@@@   █░░░█   @@   █░░░█   @@@@@@@@
       @@@@@@@@    █░░░█        █░░░█    @@@@@@@
       @@@@@@@@     ▀▀▀   ▄██▄   ▀▀▀     @@@@@@@
       @@@@@@@@@         ██████         @@@@@@@@
       @@@@@@@@@@▄       ▀████▀       ▄@@@@@@@@@
       @@@@@@@@@@@@▄▄              ▄▄@@@@@@@@@@@
       @@@@@@@@@@@@@@@@▄▄▄▄▄▄▄▄▄▄@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

       ██╗  ██╗ ██████╗ ██╗  ██╗███████╗██████╗  
       ██║  ██║██╔═══██╗██║ ██╔╝██╔════╝██╔══██╗ 
       ███████║██║   ██║█████╔╝ █████╗  ██████╔╝ 
       ╚════██║██║   ██║██╔═██╗ ██╔══╝  ██╔══██╗ 
            ██║╚██████╔╝██║  ██╗███████╗██║  ██║ 
            ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ 
                `));
                console.log(chalk.red.bold(`       [ 🤡 Joker WhatsApp Bot is Now Online! 🤡 ]\n`));
                console.log(chalk.cyan(`< ================================================== >`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} YT CHANNEL : ghost in the machine`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} GITHUB     : bigbosssunzy`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} CREDIT     : 🦊⃟ᴛᷦ𝐡ͧ𝐜ᷡ𝐜ᷦ𝐜ꙷ✮⃝🇧𝖎ौ🇧ө͜͡ss𝄟⃝🎧™`))
                console.log(chalk.green(`${global.themeemoji || '•'} STATUS     : Connected Successfully! ✅`))
                console.log(chalk.cyan(`< ================================================== >\n`))

                try {
                    const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
                    const rawBotNumber = XeonBotInc.user.id.split(':')[0];
                    const currentPrefix = settings.prefix || global.prefix || '.';

                    const connectMessage = `* 🤡🃏𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑🃏🤡 SUCCESSFULLY!*\n\n` +
                        `⏰ *Time:* ${new Date().toLocaleString()}\n` +
                        `⚡ *Current Prefix:* ${currentPrefix}\n` +
                        `👑 *Owner:* +${rawBotNumber}\n` +
                        `👨‍💻 *Creator:* +2347086057694\n` +
                        `✅ *Status:* Online and Ready!\n\n` +
                        `✅ Make sure to join below channel`;

                    const messageOptions = {
                        text: connectMessage,
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363428288475430@newsletter',
                                newsletterName: '🤡🃏𝐈 𝐀𝐌 𝐉𝐎Κ𝐄𝐑🃏🤡',
                                serverMessageId: -1
                            }
                        }
                    };

                    await XeonBotInc.sendMessage(botNumber, messageOptions);
                } catch (error) {
                    console.error('Error sending auto-connect confirmation message:', error.message)
                }
            }

            if (connection === 'close') {
                clearInterval(watchdogInterval);
                const statusCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut

                if (statusCode === 515 || statusCode === 503 || statusCode === 408) {
                    console.log(chalk.yellow(`⚠️ Stream down (${statusCode}). Quietly spinning up automatic reconnect...`));
                } else {
                    console.log(chalk.red(`Connection closed. Status: ${statusCode}, Reconnecting: ${shouldReconnect}`))
                }
                
                if (statusCode === DisconnectReason.loggedOut) {
                    try {
                        rmSync(sessionFolder, { recursive: true, force: true })
                        console.log(chalk.yellow('Session wiped due to explicit logout. Re-authenticate.'))
                    } catch (e) {}
                }
                
                if (shouldReconnect) {
                    await delay(3000)
                    startXeonBotInc()
                }
            }
        })

        const antiCallNotified = new Set();
        XeonBotInc.ev.on('call', async (calls) => {
            try {
                const { readState } = require('./commands/anticall');
                if (!readState().enabled) return;
                for (const call of calls) {
                    if (!call.from) continue;
                    if (!antiCallNotified.has(call.from)) {
                        antiCallNotified.add(call.from);
                        setTimeout(() => antiCallNotified.delete(call.from), 60000);
                        await XeonBotInc.sendMessage(call.from, { text: 'Anticall active.' });
                    }
                    setTimeout(async () => { try { await XeonBotInc.updateBlockStatus(call.from, 'block'); } catch {} }, 800);
                }
            } catch (e) {}
        });

        XeonBotInc.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(XeonBotInc, update);
        });

        XeonBotInc.ev.on('error', (error) => {
            const statusCode = error?.output?.statusCode;
            if (statusCode === 515 || statusCode === 503 || statusCode === 408) return;
            console.error('Socket error intercepted:', error.message || error);
        });

        return XeonBotInc
    } catch (error) {
        console.error('Error in primary start loop:', error)
        await delay(5000)
        startXeonBotInc()
    }
}

const handleFatalSpaceDeficit = (err, context) => {
  if (err.code === 'ENOSPC' || err.errno === -28 || err.message?.includes('no space left on device')) {
    console.error(`⚠️ ENOSPC Disk Full Error in ${context}. Attempting temporary assets purge...`);
    try {
        const { cleanupOldFiles } = require('./utils/cleanup');
        cleanupOldFiles();
    } catch (e) {
        try { rmSync('/tmp', { recursive: true, force: true }); } catch (x) {}
    }
    console.warn('⚠️ Cleanup pass executed. Bot recovering runtime safely.');
    return true;
  }
  return false;
};

process.on('uncaughtException', (err) => {
    if (handleFatalSpaceDeficit(err, 'Uncaught Exception')) return;
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    if (handleFatalSpaceDeficit(err, 'Unhandled Promise Rejection')) return;
    if (err.message && err.message.includes('rate-overlimit')) return;
    console.error('Unhandled Rejection:', err);
});

startXeonBotInc().catch(error => {
    console.error('Fatal entry-point crash:', error)
    process.exit(1)
})
