const bcrypt = require("bcrypt");

(async () => {
  try {
    const password = "Vikram#123"; // your password
    const hash = await bcrypt.hash(password, 10); // 10 = salt rounds
    console.log("Generated Hash:", hash);
  } catch (err) {
    console.error("Error generating hash:", err);
  }
})();
