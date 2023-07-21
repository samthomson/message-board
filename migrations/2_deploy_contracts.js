const MyContract = artifacts.require("MessageBoard");

module.exports = function (deployer) {
	deployer.deploy(MyContract);
};