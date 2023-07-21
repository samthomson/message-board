import React from 'react';
import ConnectAccount from './ConnectAccount'
import MessageBoardInteraction from './MessageBoardInteraction'


const Main: React.FC = () => {

	return (
		<div>
			<MessageBoardInteraction />
			<ConnectAccount />
		</div>
	);
};

export default Main;
