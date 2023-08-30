// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {Create2Deployer} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/deploy/Create2Deployer.sol";
import {StringToAddress, AddressToString} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/libs/AddressString.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {AxelarExecutableInitializable} from "./AxelarExecutableInitializable.sol";

contract OmniFactory is Initializable, AxelarExecutableInitializable {
    IAxelarGasService public gasService;
    Create2Deployer public create2Deployer;

    event Deployed(
        address indexed deployed,
        bytes creationCode,
        bytes32 salt,
        bytes init
    );

    function initialize(
        address _gateway,
        address _gasReceiver,
        address _create2Deployer
    ) public initializer {
        __AxelarExecutable_init(_gateway);
        gasService = IAxelarGasService(_gasReceiver);
        create2Deployer = Create2Deployer(_create2Deployer);
    }

    function deploy(
        bytes memory creationCode,
        bytes32 salt,
        bytes memory init
    ) public {
        bytes32 computedSalt = keccak256(abi.encodePacked(salt, msg.sender));
        address deployed;
        if (init.length == 0) {
            deployed = create2Deployer.deploy(creationCode, computedSalt);
        } else {
            deployed = create2Deployer.deployAndInit(
                creationCode,
                computedSalt,
                init
            );
        }
        emit Deployed(deployed, creationCode, computedSalt, init);
    }

    function _omniDeploy(
        string memory destinationChain,
        bytes memory creationCode,
        bytes32 salt,
        bytes memory init,
        uint256 value
    ) public payable {
        string memory destinationAddress = AddressToString.toString(
            address(this)
        );
        bytes memory payload = abi.encode(creationCode, salt, init);
        gasService.payNativeGasForContractCall{value: value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function omniDeploy(
        string memory destinationChain,
        bytes memory creationCode,
        bytes32 salt,
        bytes memory init,
        uint256 value
    ) public payable {
        require(value == msg.value, "Invalid value");
        _omniDeploy(destinationChain, creationCode, salt, init, value);
    }

    function omniDeployBatch(
        string[] memory destinationChains,
        bytes[] memory creationCodes,
        bytes32[] memory salts,
        bytes[] memory inits,
        uint256[] memory values
    ) public payable {
        require(
            destinationChains.length == creationCodes.length &&
                creationCodes.length == salts.length &&
                salts.length == inits.length &&
                inits.length == values.length,
            "Invalid input"
        );
        uint256 totalValue;
        for (uint256 i = 0; i < values.length; i++) {
            totalValue += values[i];
        }
        require(totalValue == msg.value, "Invalid value");
        for (uint256 i = 0; i < destinationChains.length; i++) {
            _omniDeploy(
                destinationChains[i],
                creationCodes[i],
                salts[i],
                inits[i],
                values[i]
            );
        }
    }

    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        require(
            StringToAddress.toAddress(sourceAddress_) == address(this),
            "Invalid source address"
        );
        (bytes memory creationCode, bytes32 salt, bytes memory init) = abi
            .decode(payload_, (bytes, bytes32, bytes));
        deploy(creationCode, salt, init);
    }

    function deployedAddress(
        bytes memory creationCode,
        address sender,
        bytes32 salt
    ) public view returns (address) {
        bytes32 computedSalt = keccak256(abi.encodePacked(salt, sender));
        return
            create2Deployer.deployedAddress(
                creationCode,
                address(this),
                computedSalt
            );
    }
}
