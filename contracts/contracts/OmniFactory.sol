// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {StringToAddress, AddressToString} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/libs/AddressString.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {AxelarExecutableInitializable} from "./AxelarExecutableInitializable.sol";
import {ICREATE3Factory} from "./ICREATE3Factory.sol";



// OmniFactory should be deployed to the same address across all networks
contract OmniFactory is Initializable, AxelarExecutableInitializable {
    IAxelarGasService public gasService;
    ICREATE3Factory public create3Factory;

    event Deployed(address indexed deployed);

    // constructor is not used here to make OmniFactory address same across all networks
    function initialize(
        address _gateway,
        address _gasReceiver,
        address _create3Factory
    ) public initializer {
        AxelarExecutableInitializable.initialize(_gateway);
        gasService = IAxelarGasService(_gasReceiver);
        create3Factory = ICREATE3Factory(_create3Factory);
    }

    // It can have init code for the deployed contract is the contract uses proxy pattern, but it is not used in this demo
    function deploy(
        bytes32 salt,
        bytes memory creationCode
    ) public {
        address deployed = create3Factory.deploy(salt, creationCode);
        emit Deployed(deployed);
    }

    function omniDeploy(
        string memory destinationChain,
        bytes32 salt,
        bytes memory creationCode
    ) public payable {
        string memory destinationAddress = AddressToString.toString(address(this));
        bytes memory payload = abi.encode(salt, creationCode);
        gasService.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        // To ensure the source address is the same as the OmniFactory address
        // This is possible because the OmniFactory address is the same across all networks and it has same bytecode
        // We are not checking the sourceChain because it is not possible to fake the sourceChain in the current implementation
        require(StringToAddress.toAddress(sourceAddress_) == address(this), "Invalid source address");  
        (bytes32 salt, bytes memory creationCode) = abi.decode(payload_, (bytes32, bytes));
        deploy(salt, creationCode);
    }
}
