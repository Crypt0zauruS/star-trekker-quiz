import { useState, useEffect, useCallback, use } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { whitelistQuiz } from "./../components/contract";
import { useEthersSigner } from "./../components/ethersProvider";

const useWhitelistStatus = (config: any) => {
  const { abi, addressQuizz } = whitelistQuiz;
  const { address } = useAccount();
  const signer = useEthersSigner();
  const [quizContract, setQuizContract] = useState<ethers.Contract | undefined>(
    undefined
  );
  const [isUmbrellaWhitelisted, setIsUmbrellaWhitelisted] = useState<
    boolean | undefined
  >(false);
  const [isQuizWhitelisted, setIsQuizWhitelisted] = useState<
    boolean | undefined
  >(false);
  const [numAddressesWhitelisted, setNumAddressesWhitelisted] = useState<
    number | undefined
  >(0);
  const [maxAddressesWhitelisted, setMaxAddressesWhitelisted] = useState<
    number | undefined
  >(0);
  const [remainingAddresses, setRemainingAddresses] = useState<
    number | undefined
  >(0);
  const [paused, setPaused] = useState<boolean | undefined>(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && signer) {
      console.log("Creating contract instance...");
      const contractQuiz = new ethers.Contract(addressQuizz, abi, signer);
      setQuizContract(contractQuiz);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, address]);

  const handleCheckUmbrella = useCallback(async () => {
    if (quizContract && address) {
      try {
        setLoading(true);

        const maxAddresses = await quizContract.maxWhitelistedAddresses();
        const checkUmbrella = await quizContract.checkWhitelistUmbrella(
          address
        );
        const numAddresses = await quizContract.numAddressesWhitelisted();
        const checkQuiz = await quizContract.whitelistedAddresses(address);

        typeof Number(maxAddresses) === "number"
          ? setMaxAddressesWhitelisted(Number(maxAddresses))
          : setMaxAddressesWhitelisted(undefined);

        setIsUmbrellaWhitelisted(checkUmbrella);

        typeof Number(numAddresses) === "number"
          ? setNumAddressesWhitelisted(Number(numAddresses))
          : setNumAddressesWhitelisted(undefined);

        typeof checkQuiz === "boolean"
          ? setIsQuizWhitelisted(checkQuiz)
          : setIsQuizWhitelisted(undefined);
        const remainingAddresses = Number(maxAddresses) - Number(numAddresses);
        remainingAddresses && remainingAddresses >= 0
          ? setRemainingAddresses(remainingAddresses)
          : setRemainingAddresses(undefined);
      } catch (error) {
        console.error("Error checking whitelist status: ", error);
        // Reset state to default values in case of error
        setIsUmbrellaWhitelisted(false);
        setIsQuizWhitelisted(false);
        setNumAddressesWhitelisted(0);
        setMaxAddressesWhitelisted(0);
        setRemainingAddresses(0);
      } finally {
        setLoading(false);
      }
    }
  }, [quizContract, address]);

  const handleReadPaused = useCallback(async () => {
    try {
      const result: any = await readContract(config, {
        abi: abi,
        address: `0x${addressQuizz.replace(/^0x/, "")}`,
        functionName: "_paused",
      });
      setPaused(result);
    } catch (error) {
      console.error("Error reading contract state:", error);
    }
  }, [config]);

  useEffect(() => {
    if (quizContract && address) {
      handleCheckUmbrella();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizContract, address, handleCheckUmbrella]);

  useEffect(
    () => {
      handleReadPaused();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config]
  );

  return {
    quizContract,
    isUmbrellaWhitelisted,
    isQuizWhitelisted,
    numAddressesWhitelisted,
    maxAddressesWhitelisted,
    remainingAddresses,
    loading,
    paused,
  };
};

export default useWhitelistStatus;
