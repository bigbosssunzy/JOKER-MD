const settings = {
  prefix: ".", // 👈 This stays as a property inside the object
  packname: '🤡𝙄 𝙖𝙢 𝙟𝙤𝙠𝙚𝙧!🤡',
  author: '‎',
  botName: "🤡𝙄 𝙖𝙢 𝙟𝙤𝙠𝙚𝙧!🤡",
  botOwner: '🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™',
  ownerNumber: '2347086057694',
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  commandMode: "public",
  maxStoreMessages: 20, 
  storeWriteInterval: 10000,
  description: "This is a bot for managing group commands and automating tasks.",
  version: "3.0.6",
  updateZipUrl: "",
};

// 👇 ADD THIS LINE HERE (Outside the curly braces)
global.prefix = settings.prefix; 

module.exports = settings;