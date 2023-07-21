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

	const isConnected = !!account;
	const myAddress = account

	const [messagesCount, setMessagesCount] = React.useState<undefined | number>(undefined)
	const [messages, setMessages] = React.useState<{ author: string, content: string }[]>([])
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
		if (library) {
			refreshMessageCount()
		}
	}, [library, refreshMessageCount])


	React.useEffect(() => {
		if (messagesCount !== undefined && messagesCount > 0) {
			fetchMessages()
		}
	}, [fetchMessages, messagesCount])

	const onStoreMessage = async (event: { preventDefault: () => void; }) => {
		event.preventDefault();
		const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());
		const tx = await contract.writeMessage(messageInput);
		await tx.wait();
	}

	return (
		<>
			<div>
				<h1>Message board</h1>
				<h4>{!!messagesCount ? messagesCount.toLocaleString() : '0'} message(s)</h4>
				{library === undefined && <>[We use your wallet to call the network, so connect it to see messages.]</>}
				{!!messagesCount && <>
					<table>
						<thead><th>from</th><th>message</th></thead>

						{messages.map((message, key) => <tr key={key}>
							<td>
								<span
									style={
										myAddress === message.author ? { textDecoration: 'underline' } : {}
									}
								>{message.author}
								</span>


								<strong></strong></td>
							<td>{message.content}</td>
						</tr>)}
					</table>
				</>}
			</div>
			<hr />
			{
				isConnected && <>
					<form onSubmit={onStoreMessage}>
						<input type="text" value={messageInput} onChange={e => setMessageInput(e.currentTarget.value)} />
						<button type="submit">store message (as {account})</button>
					</form>
				</>
			}
			{
				!isConnected && <>
					<div>[you must connect your wallet to post a message]<br /><br /></div>
				</>
			}
		</>
	);
};

export default MessageBoardInteraction;
