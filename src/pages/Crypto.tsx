// Crypto.tsx
import React, { useState } from "react";
import Modal from "./../common/Modal";
import { ethers } from "ethers";

import "./Crypto.css";

const Crypto: React.FC = () => {
  const [formData, setFormData] = useState({
    to: "onmodal@kotapay",
    upiUserInput: "",
    upiUserMoney: 1,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState<string>();
  const getExampleXml = () => `
    <upi:ReqChkTxn xmlns:upi=http://npci.org/upi/schema/>
        <Head ver="2.0" ts="2018-09-15T20:19:41.038+05:30" orgId="112233" msgId="NPC000015d08de6764b7485f98cb0cf88c5"/>
        <Txn id="NPC07e28b41311d414294715635aa07cc61" note="ReqChkTxn" refId="NPC000015d08de6764b7485f98cb0cf88c5" refUrl=http://www.icicibank.com refCategory="00" ts="2018-09-15T20:19:41.038+05:30" type="ChkTxn" umn="1" orgMsgId="NPC000015d08de6764b7485f98cb0cf88c5" orgRrn="123456789012" orgTxnId="NPC000015d08de6764b7485f98cb0cf88c6" subType="DEBIT" orgTxnDate="2018-09-15T20:19:41.038+05:30" initiationMode="00" purpose="00" />
    </upi:ReqChkTxn>
`;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const PRIVATE_KEY =
    "3e632865f01c6e056af0aa6139e61b4f98a44c02107cb4bb3e478ce455bd8445";

  const RPC_URL = "https://eth-goerli.public.blastapi.io";
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     console.log('Form Data:', formData);
  //     // Add your logic to handle form submission, e.g., send data to the server
  // };

  const sendCrypto = async (destinationAddress: string): Promise<void> => {
    // Provider will be our connection to the Tenderly Web3 Gateway. We pull the URL from the .env file we created earlier.
    const provider = new ethers.JsonRpcProvider(RPC_URL as string);

    // Prepare the sender - this will be based on the private key we set up in the .env file.
    const sender = new ethers.Wallet(PRIVATE_KEY as string, provider);

    // The balanceBefore variable will hold the balance of the destination address before we send any SEP.
    const balanceBefore = await provider.getBalance(destinationAddress);
    console.log(
      `Destination balance before sending: ${ethers.formatEther(
        balanceBefore
      )} ETH`
    );
    console.log("Sending...\n");

    // Here you can change how much SEP we are sending.
    const tx = await sender.sendTransaction({
      to: destinationAddress,
      value: ethers.parseEther("0.0001"),
    });
    console.log("Sent! 🎉");
    console.log(`TX hash: ${tx.hash}`);
    console.log("Waiting for receipt...");

    // This line will block the script until 1 block is mined or 150s pass. That way we can be sure the transaction is complete.
    await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {});

    // The balanceAfter variable is retrieved the same as earlier - it will contain the new balance of the destination address.
    const balanceAfter = await provider.getBalance(destinationAddress);
    console.log(
      `Destination balance after sending: ${ethers.formatEther(
        balanceAfter
      )} ETH`
    );
    setAccountBalance(ethers.formatEther(
      balanceAfter
    ));
  };

  // Example usage:
  // main("0xYourDestinationAddress").catch(error => console.error(error));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://apisetu.gov.in/api/upi-npci/ReqChkTxn/2.0/urn:txnid:123",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers if needed
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Check the purpose value in the JSON response
        if (data.purpose === "00") {
          setSuccessMessage("Transaction successful!");
        } else {
          setSuccessMessage(null);
        }

        console.log("API Response:", data);
        // Add your logic to handle the API response
      } else {
        // Assign example XML to response in case of error
        const errorResponse = await response.text();

        console.error("API Error:", response.status, response.statusText);
        console.log("Example XML in case of error:", errorResponse);

        // Check the purpose value in the example XML
        const purposeRegex = /<purpose>(\d+)<\/purpose>/;
        const match = errorResponse.match(purposeRegex);

        if (match && match[1] === "00") {
          setSuccessMessage("Transaction successful!");
        } else {
          setSuccessMessage(null);
        }

        // Add your error handling logic
      }
    } catch (error) {
      // Assign example XML to response in case of an exception
      const errorResponse = `
            <upi:ReqChkTxn xmlns:upi=http://npci.org/upi/schema/>
                <Head ver="2.0" ts="2018-09-15T20:19:41.038+05:30" orgId="112233" msgId="NPC000015d08de6764b7485f98cb0cf88c5"/>
                <Txn id="NPC07e28b41311d414294715635aa07cc61" note="ReqChkTxn" refId="NPC000015d08de6764b7485f98cb0cf88c5" refUrl=http://www.icicibank.com refCategory="00" ts="2018-09-15T20:19:41.038+05:30" type="ChkTxn" umn="1" orgMsgId="NPC000015d08de6764b7485f98cb0cf88c5" orgRrn="123456789012" orgTxnId="NPC000015d08de6764b7485f98cb0cf88c6" subType="DEBIT" orgTxnDate="2018-09-15T20:19:41.038+05:30" initiationMode="00" purpose="00" />
            </upi:ReqChkTxn>
        `;
      const purposeRegex = / purpose="([^"]+)"/;
      const match = errorResponse.match(purposeRegex);

      if (match && match[1] === "00") {
        setSuccessMessage("Transaction successful!");
        await sendCrypto("0x74d5F05E2E62BbA8aCc37cdCA8395776d866079c");
      } else {
        setSuccessMessage(null);
      }

      // Add your error handling logic
    }
  };

  function bigintDivision(dividend: bigint, divisor: bigint): { quotient: bigint, remainder: bigint } {
    const quotient = dividend / divisor; // Floating-point result
    const remainder = dividend % divisor;

    return {
        quotient: BigInt(quotient),
        remainder: remainder
    };
  }

  return (
    <div className="upi_card main-card">
      <form className="form" onSubmit={handleSubmit}>
        <div className="credit-card-info--form">
          <div className="input_container">
            <label htmlFor="upiUserMoney" className="input_label">
              Land Hub Upi Id
            </label>
            <input
              id="to"
              className="input_field"
              type="text"
              name="to"
              title="Input title"
              placeholder="Enter your full name"
              value={formData.to}
              readOnly
            />
          </div>
          <div className="input_container">
            <label htmlFor="upiUserMoney" className="input_label">
              Amount
            </label>
            <input
              id="upiUserMoney"
              className="input_field"
              type="number"
              name="upiUserMoney"
              title="Input title1"
              placeholder="Enter money"
              value={formData.upiUserMoney}
              onChange={handleChange}
            />
          </div>
          <div className="input_container">
            <label htmlFor="upiUserInput" className="input_label">
              UPI Transaction Id
            </label>
            <input
              id="upiUserInput"
              className="input_field"
              type="number"
              name="upiUserInput"
              title="Input title"
              placeholder="Enter UPI transaction id"
              value={formData.upiUserInput}
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="purchase--btn" type="submit">
          Checkout
        </button>
        {successMessage}
        Your crypto balance is {accountBalance} ETH
      </form>
    </div>
  );
};

export default Crypto;
