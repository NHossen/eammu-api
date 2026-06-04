const fs = require("fs");
const path = require("path");
const https = require("https");

const countries = [
 "ad", "ae", "af", "ag", "al", "am", "ao", "ar", "at", "au", "az", "ba", "bb", "bd", "be", "bf",
    "bg", "bh", "bi", "bj", "bn", "bo", "br", "bs", "bt", "bw", "by", "bz", "ca", "cd", "cf", "cg",
    "ch", "ci", "cl", "cm", "cn", "co", "cr", "cu", "cv", "cy", "cz", "de", "dj", "dk", "dm", "do",
    "dz", "ec", "ee", "eg", "er", "es", "et", "fi", "fj", "fm", "fr", "ga", "gb", "gd", "ge", "gh",
    "gm", "gn", "gq", "gr", "gt", "gw", "gy", "hk", "hn", "hr", "ht", "hu", "id", "ie", "il", "in",
    "iq", "ir", "is", "it", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw",
    "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me",
    "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mr", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na",
    "ne", "ng", "ni", "nl", "no", "np", "nr", "nz", "om", "pa", "pe", "pg", "ph", "pk", "pl", "ps",
    "pt", "pw", "py", "qa", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "si", "sk",
    "sl", "sm", "sn", "so", "sr", "ss", "st", "sv", "sy", "sz", "td", "tg", "th", "tj", "tl", "tm",
    "tn", "to", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "us", "uy", "uz", "va", "vc", "ve", "vn",
    "vu", "ws", "ye", "za", "zm", "zw" , "bm","gi","je"
];

const folder = path.join(__dirname, "../public/passports");

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

function downloadImage(code) {
  return new Promise((resolve) => {
    const url = `https://img.passportindex.org/countries/thum/${code}.png`;

    const filePath = path.join(folder, `${code}.png`);

    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
        Accept: "image/png,image/*;q=0.8,*/*;q=0.5",
        Referer: "https://www.passportindex.org/",
      },
    };

    https
      .get(url, options, (response) => {
        if (response.statusCode !== 200) {
          console.log(`❌ Failed ${code} : ${response.statusCode}`);
          resolve();
          return;
        }

        const file = fs.createWriteStream(filePath);

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`✅ Downloaded ${code}.png`);
          resolve();
        });
      })
      .on("error", (err) => {
        console.log(`❌ Error ${code}:`, err.message);
        resolve();
      });
  });
}

async function start() {
  for (const code of countries) {
    await downloadImage(code);
  }

  console.log("🎉 DONE");
}

start();