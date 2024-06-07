# 🚀 Star Trekker Quiz 🖖

Welcome to the Star Trekker Quiz! Get ready to test your Star Trek knowledge and earn a chance to mint exclusive NFTs! Join us in this exciting journey through the Star Trek universe. 🚀✨

## 🌟 Part 1: Participate in the Quiz!

Do you think you know everything about Star Trek? Prove it! Answer 30 questions correctly to earn a spot on our whitelist. Here's how to get started:

1. **Connect Your Wallet**: Use your Metamask wallet to connect.
2. **Answer the Quiz**: Complete 30 questions without making a single mistake.
3. **Join the Whitelist**: Secure your place to mint a Star Trekker NFT for Free !

Ready to take on the challenge? Head over to our [Star Trekker Quiz](https://crypt0zaurus-star-trekker-landing.netlify.app/) and start now!

## ⚙️ Part 2: Technical Overview

### Project Structure

This project is built with Next.js, React, and various libraries to ensure a seamless and secure user experience. The Smart Contracts are deployed on the Polygon blockchain.

### Key Technologies

- **Next.js**: Our React framework for server-side rendering and generating static websites.
- **React**: The JavaScript library for building user interfaces.
- **RainbowKit**: For an elegant wallet connection experience.
- **Wagmi**: React Hooks for Ethereum.
- **Ethers**: A library for interacting with the Ethereum blockchain.

Thanks to Next.js server side functionality, we can easily manage user sessions and state. This ensures a smooth and secure experience for our users.

### Server-Side Security

Using Next.js' server-side API, we securely store the application's private key to protect the claim whitelist function. Only the dApp can utilize this function of the smart contract. In addition, the claim whitelist fonction is also protected by a server-side generated random signature used by the dApp, different for each claim. The decryption key for the quiz answers is also protected and used server-side.

### Make your Own Web3 quiz !

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Crypt0zauruS/star-trekker-quiz.git
cd star-trekker-quiz
npm install
```

- Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
npm start
```

Feel free to explore the codebase and make your own Web3 quiz! Don't forget to credit the original developer 😀

- Dependencies
  Here's a quick look at our dependencies:

@rainbow-me/rainbowkit: ^2.1.2
@tanstack/react-query: ^5.40.1
@wagmi/core: ^2.10.5
crypto-js: ^4.2.0
ethers: ^6.13.0
next: 14.1.0
react: 18.1.0
react-dom: ^18.3.1
viem: ^2.13.6
wagmi: ^2.9.8

- Usage of Key Libraries
  wagmi: Utilized for managing Ethereum wallet connections and interactions.
  RainbowKit: Provides a polished wallet connection component.
  ethers: Facilitates communication with the Ethereum blockchain.
  @tanstack/react-query: Manages server-state in React applications.

- Contributing
  We welcome contributions! Feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

- License
  This project is licensed under the Creative Commons Attribution 4.0 International License.

Join us in exploring the final frontier with the Star Trekker Quiz! 🖖 Engage and make your mark in the Star Trek universe! 🚀✨

Here is the direct link: [Star Trekker Quiz](https://crypt0zaurus-star-trekker-quiz.vercel.app/)
