const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// Function to generate pairing code
async function generatePairingCode(number) {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", ["SPIDEY-VX/index.js", number]);

    let output = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
      console.log("BOT OUTPUT:", data.toString()); // 👈 Logs everything the bot prints

      // Regex to match code format like ABCD-1234 or PYVL-6VYA
      let match = output.match(/[A-Z0-9]{4}-[A-Z0-9]{4}/i);
      if (match) {
        resolve(match[0].toUpperCase()); // Return code in uppercase
        proc.kill();
      }
    });

    proc.stderr.on("data", (err) => {
      console.error("BOT ERROR:", err.toString());
      // Optional: reject(err.toString());
    });

    proc.on("exit", (code) => {
      if (!output) reject("No output from bot (exit code " + code + ")");
    });
  });
}

// API endpoint
app.post("/pair", async (req, res) => {
  try {
    const number = req.body.number;
    if (!number) return res.status(400).json({ error: "No number provided" });

    const code = await generatePairingCode(number);
    res.json({ pairingCode: code });
  } catch (err) {
    console.error("PAIRING ERROR:", err);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
