import CryptoJS from "crypto-js";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { encryptedQuestion, encryptedOptions, encryptedAnswer } = req.body;
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ error: "Secret key is not defined" });
    }

    try {
      // Déchiffrer la question
      const decryptedQuestionBytes = CryptoJS.AES.decrypt(
        encryptedQuestion,
        secretKey
      );
      const decryptedQuestion = decryptedQuestionBytes.toString(
        CryptoJS.enc.Utf8
      );

      // Déchiffrer les options
      const decryptedOptions = encryptedOptions.map((option) => {
        const bytes = CryptoJS.AES.decrypt(option, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
      });

      // Déchiffrer la réponse
      const decryptedAnswerBytes = CryptoJS.AES.decrypt(
        encryptedAnswer,
        secretKey
      );
      const decryptedAnswer = decryptedAnswerBytes.toString(CryptoJS.enc.Utf8);

      return res
        .status(200)
        .json({ decryptedQuestion, decryptedOptions, decryptedAnswer });
    } catch (error) {
      return res.status(500).json({ error: "Decryption failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
