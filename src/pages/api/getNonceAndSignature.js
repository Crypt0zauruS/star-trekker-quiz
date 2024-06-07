import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { whitelistQuiz } from "../../components/contract";
import crypto from "crypto";
import { ethers, Contract, Wallet } from "ethers";

export default async (req, res) => {
  if (req.method !== "POST") {
    const { userAddress } = req.body;
    const { addressQuizz, abi } = whitelistQuiz;
    const urlProviderKey = process.env.POLYGON_API_KEY;

    if (!urlProviderKey || !process.env.DAPP_PRIVATE_KEY) {
      return res.status(500).json({ error: "Missing environment variables" });
    }

    try {
      const dAppPrivateKey = process.env.DAPP_PRIVATE_KEY;
      const client = createPublicClient({
        chain: polygon,
        transport: http(urlProviderKey),
      });
      const provider = new ethers.BrowserProvider(client);
      const wallet = new Wallet(dAppPrivateKey, provider);
      const contract = new Contract(addressQuizz, abi, provider);
      // Fetch nonce from the blockchain
      const userNonce = await contract.nonces(userAddress);
      // Generate a secure random value
      const randomValue = crypto.randomBytes(32).toString("hex");
      // Create message and sign it
      const message = ethers.solidityPackedKeccak256(
        ["address", "address", "uint256", "string"],
        [userAddress, addressQuizz, Number(userNonce), randomValue]
      );
      const messageBytes = ethers.getBytes(message);
      const signature = await wallet.signMessage(messageBytes);
      // export to the frontend
      res
        .status(200)
        .json({ nonce: Number(userNonce), signature, randomValue });
    } catch (error) {
      console.error("Error fetching nonce and signature:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
