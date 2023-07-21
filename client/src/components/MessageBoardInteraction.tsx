import React from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core'


const contractAddress = '0x6FBA242B801B2C665a556bcb176AdE630A4022cb';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "messages",
		"outputs": [
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			}
		],
		"name": "writeMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMessagesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	}
]

const MessageBoardInteraction: React.FC = () => {

	const { library, account } = useWeb3React();



	const [messagesCount, setMessagesCount] = React.useState<undefined | number>(undefined)
	const [messages, setMessages] = React.useState<string[]>([])
	const [messageInput, setMessageInput] = React.useState<string>('')

	const refreshMessageCount = React.useCallback(async () => {
		const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());

		// replace 'myMethod' with the name of your contract's method you want to call
		const messageCount = Number(await contract.getMessagesCount())
		setMessagesCount(messageCount);
	}, [library])

	const fetchMessages = React.useCallback(async () => {
		const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());

		const messagesPromises = Array(messagesCount).fill('loading...').map((_, i) => contract.messages(i));

		const messages = await Promise.all(messagesPromises);

		setMessages(messages);
	}, [library, messagesCount]);

	React.useEffect(() => {
		if (library && account) {
			refreshMessageCount()
		}
	}, [library, account, refreshMessageCount])


	React.useEffect(() => {
		if (messagesCount !== undefined && messagesCount > 0) {
			fetchMessages()
		}
	}, [fetchMessages, messagesCount])

	const storeMessage = async () => {
		const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());
		const tx = await contract.writeMessage(messageInput);
		await tx.wait();
	}

	return (
		<>
			<div>
				<h1>Message count: {!!messagesCount ? messagesCount : '0'}</h1>
				{messages.map((message, key) => <div key={key}>{message}</div>)}
			</div>
			<hr />
			<input type="text" value={messageInput} onChange={e => setMessageInput(e.currentTarget.value)} />
			<button onClick={storeMessage}>store message</button>
		</>
	);
};

export default MessageBoardInteraction;
