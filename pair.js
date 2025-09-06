const { spawn } = require("child_process");

async function generatePairingCode(number) {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", ["SPIDEY-VX/index.js", number]);

    let output = "";
    proc.stdout.on("data", (data) => {
      output += data.toString();

      // Look for pairing code format like ABCD-1234
      let match = output.match(/[A-Z0-9]{4}-[A-Z0-9]{4}/);
      if (match) {
        resolve(match[0]);
        proc.kill();
      }
    });

    proc.stderr.on("data", (err) => reject(err.toString()));
    proc.on("exit", (code) => {
      if (!output) reject("No output from bot (exit code " + code + ")");
    });
  });
}

module.exports = { generatePairingCode };