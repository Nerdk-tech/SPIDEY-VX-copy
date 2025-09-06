const express = require("express");
const bodyParser = require("body-parser");
const { generatePairingCode } = require("./pair");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/pair", async (req, res) => {
  try {
    const number = req.body.number;
    if (!number) return res.status(400).json({ error: "No number provided" });

    const code = await generatePairingCode(number);
    res.json({ pairingCode: code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));