// File: @ensdomains/resolver/contracts/Resolver.sol
pragma solidity >=0.4.24;

interface ETHRegistrarController {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

pragma solidity >= 0.7.0 < 0.9.0;

import "./Strings.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract audioBound is ERC721Enumerable, Ownable, AccessControl {

    using strings for *;
    using Counters for Counters.Counter;
    Counters.Counter public tokenId;

    // Metadata variables
    mapping(string => string) metadataURIMap;
    mapping (uint32 => bool) genreIdIsIn;

    // The ENS registry
    ETHRegistrarController public ens;

    // DID system
    string private ensSuffix = ".eth";

    // audioBound pass price
    uint256 private purchasePrice = 30000000000000000 wei;
    uint256 private whitelistPurchasePrice = 28500000000000000 wei;

    // audioBound pass purchase status
    enum NFTPurchaseStatus{ AVAILABLE, PURCHASED, SONGIFIED, REDEEMED }

    // Domain name length requirement
    uint256 private maxDomainNameLength = 1000;
    uint256 private minDomainNameLength = 4;

    // Whitelist
    // Track the number of whitelisted addresses.
    uint256 public numberOfAddressesWhitelisted;
    // To store our addresses, we need to create a mapping that will receive the users' addresses and return if they are whitelisted or not.
    mapping(address => bool) whitelistedAddresses;

    // Log event for indexing
    event LogAudioBoundPassCreated(uint256 indexed audioBoundPassId, address indexed ownerWalletAddress, string ensDomain, uint32 genre);
    event LogAudioBoundNftCreated(uint256 indexed audioBoundNftId, address indexed ownerWalletAddress, string ensDomain, string metadataUri);
    event LogSongifyCompleted(uint256 indexed audioBoundPassId);

    // contract paused
    bool public paused = false;

    // Mapping from domain name to its purchased status
    mapping(string => NFTPurchaseStatus) private purchaseStatus;

    // Mapping from domain name to a token id
    mapping(string => uint256) private domainNameToTokenId;

    constructor(
        ETHRegistrarController _ens,
        string memory name,
        string memory symbol,
        address adminAccount
    )
    ERC721(name, symbol)
    {
        ens = _ens;
        _setupRole(DEFAULT_ADMIN_ROLE, adminAccount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Role control
    modifier onlyMember() {
        require(isMember(msg.sender), "Restricted to members.");
        _;
    }

    function isMember(address account) public virtual view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function addMember(address account) public virtual onlyOwner {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function leaveCommunity() public virtual {
        renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Internal helper function
    function domainToHashKey(string memory domainName) internal view returns (uint256) {
        strings.slice memory domainSlice = domainName.toSlice();
        require(domainSlice.endsWith(ensSuffix.toSlice()), "Wrong ENS suffix.");
        string memory ensPrefix = domainSlice.split(ensSuffix.toSlice()).toString();
        bytes32 label = keccak256(bytes(ensPrefix));
        uint256 hashKey = uint256(label);
        return hashKey;
    }

    function setPurchaseStatus(string memory domainName, NFTPurchaseStatus status) internal {
        purchaseStatus[domainName] = status;
    }

    // Whitelist
    function addUserAddressToWhitelist(address _addressToWhitelist)
        public
        onlyMember
    {
        // Validate the caller is not already part of the whitelist.
        require(
            !whitelistedAddresses[_addressToWhitelist],
            "Error: Sender already been whitelisted"
        );

        // Set whitelist boolean to true.
        whitelistedAddresses[_addressToWhitelist] = true;
        // Increasing the count
        numberOfAddressesWhitelisted += 1;
    }

    // Group whitelist
    function addGroupUserAddressToWhitelist(address[] memory whitelistAddressMap)
        public
        onlyMember
    {
        for (uint i=0; i<whitelistAddressMap.length; i++) {
            address whitelistAddress = whitelistAddressMap[i];
            // Validate the caller is not already part of the whitelist.
            if(whitelistedAddresses[whitelistAddress]) {
                continue;
            }
            // Set whitelist boolean to true.
            whitelistedAddresses[whitelistAddress] = true;
            // Increasing the count
            numberOfAddressesWhitelisted += 1;
        }
    }


    // Is the user whitelisted?
    function isWhitelisted(address _whitelistedAddress)
        public
        view
        returns (bool)
    {
        // Verifying if the user has been whitelisted
        return whitelistedAddresses[_whitelistedAddress];
    }

    // Remove user from whitelist
    function removeUserAddressFromWhitelist(address _addressToRemove)
        public
        onlyMember
    {
        // Validate the caller is already part of the whitelist.
        require(
            whitelistedAddresses[_addressToRemove],
            "Error: Sender is not whitelisted"
        );

        // Set whitelist boolean to false.
        whitelistedAddresses[_addressToRemove] = false;

        // This will decrease the number of whitelisted addresses.
        numberOfAddressesWhitelisted -= 1;
    }

    // Remove users from whitelist
    function removeGroupUserAddressToWhitelist(address[] memory addressToRemoveMap)
        public
        onlyMember
    {
        for (uint i=0; i<addressToRemoveMap.length; i++) {
            address removeAddress = addressToRemoveMap[i];
            // Validate the caller is not already part of the whitelist.
            if(!whitelistedAddresses[removeAddress]) {
                continue;
            }
            // Set whitelist boolean to false.
            whitelistedAddresses[removeAddress] = false;
            // This will decrease the number of whitelisted addresses.
            numberOfAddressesWhitelisted -= 1;
        }
    }

    // Get the number of whitelisted addresses
    function getNumberOfWhitelistedAddresses() public view returns (uint256) {
        return numberOfAddressesWhitelisted;
    }

    // Purchase audioBound pass and audioBound NFT
    function purchaseAudioBoundPass(string calldata domainName, uint32 genreId) external payable {
        require(!paused, "The contract has been paused");

        // The length of the domain name should within the range
        require(domainName.toSlice().len() <= maxDomainNameLength, "Name of the domain is too long.");
        require(domainName.toSlice().len() > minDomainNameLength, "Name of the domain is too short.");

        // Revert if the genre type is invalid
        require(genreIdIsIn[genreId], "Genre id is invalid.");

        // Revert the transaction if the amount is insufficient
        if(isWhitelisted(msg.sender)) {
            require(msg.value >= whitelistPurchasePrice, "Insufficient amount.");
        } else {
            require(msg.value >= purchasePrice, "Insufficient amount.");
        }

        // Revert the transaction if the audioBound pass has been purchased
        require(getPurchaseStatus(domainName) != NFTPurchaseStatus.REDEEMED, "This domain has been purchased.");
        require(getPurchaseStatus(domainName) != NFTPurchaseStatus.SONGIFIED, "This audioBound pass has been purchased.");
        require(getPurchaseStatus(domainName) != NFTPurchaseStatus.PURCHASED, "This audioBound pass has been purchased.");

        // Revert if the domain name doesn't belong to message sender
//        uint256 hashKey = domainToHashKey(domainName);
//        require(msg.sender == ens.ownerOf(hashKey),  "You are not the owner of this ENS domain.");

        setPurchaseStatus(domainName, NFTPurchaseStatus.PURCHASED);
        tokenId.increment();
        uint256 newItemId = tokenId.current();
        domainNameToTokenId[domainName] = newItemId;
        emit LogAudioBoundPassCreated(newItemId, msg.sender, domainName, genreId);
    }

    function setMetadata(string[] memory domainMap, string[] memory metadataMap) public onlyMember {
        require(domainMap.length == metadataMap.length, "The number of domain and metadata doesn't match.");
        for (uint i=0; i<domainMap.length; i++) {
            string memory domainName = domainMap[i];
            string memory metadataURI = metadataMap[i];
            if(getPurchaseStatus(domainName) != NFTPurchaseStatus.PURCHASED) {
                continue;
            }
            metadataURIMap[domainName] = metadataURI;
            setPurchaseStatus(domainName, NFTPurchaseStatus.SONGIFIED);
            emit LogSongifyCompleted(domainNameToTokenId[domainName]);
        }
    }

    function redeemAudioBoundNFT(string memory domainName) external {
        require(!paused, "The contract has been paused");

        // Revert if the audioBound pass has not been purchased
        require(getPurchaseStatus(domainName) == NFTPurchaseStatus.SONGIFIED,  "Please wait for your audioBound NFT to be songified or you already redeemed.");

        // Revert if the domain name doesn't belong to message sender
//        uint256 hashKey = domainToHashKey(domainName);
//        require(msg.sender == ens.ownerOf(hashKey),  "You are not the owner of this ENS domain.");

        // Mint audioBound NFT
        uint256 tokenId = domainNameToTokenId[domainName];
        _safeMint(msg.sender, tokenId);
        setPurchaseStatus(domainName, NFTPurchaseStatus.REDEEMED);
        emit LogAudioBoundNftCreated(tokenId, msg.sender, domainName, metadataURIMap[domainName]);
    }

    // Get functions
    function getPurchsePrice() external view returns (uint256) {
        return purchasePrice;
    }

    function getMetadataByDomain(string memory domainName) external view returns (string memory) {
        require(purchaseStatus[domainName] == NFTPurchaseStatus.REDEEMED,
            "The audioBound NFT hasn't been generated yet.");
        return metadataURIMap[domainName];
    }

    function getTokenIdByDomain(string memory domainName) external view returns (uint256) {
        require(getPurchaseStatus(domainName) == NFTPurchaseStatus.REDEEMED,  "The domain hasn't been purchased yet.");
        return domainNameToTokenId[domainName];
    }

    function getAudioBoundPassIdByDomain(string memory domainName) external view returns (uint256) {
        require(getPurchaseStatus(domainName) == NFTPurchaseStatus.PURCHASED,  "The audioBound pass hasn't been purchased or has already redeemed.");
        return domainNameToTokenId[domainName];
    }

    function checkStatus(string memory domainName) external view returns (string memory) {
        if(getPurchaseStatus(domainName) == NFTPurchaseStatus.PURCHASED) {
            return "PURCHASED";
        } else if (getPurchaseStatus(domainName) == NFTPurchaseStatus.SONGIFIED) {
            return "SONGIFIED";
        } else if (getPurchaseStatus(domainName) == NFTPurchaseStatus.REDEEMED) {
            return "REDEEMED";
        }
        return "AVAILABLE";
    }

    function getPurchaseStatus(string memory domainName) public view returns (NFTPurchaseStatus) {
        return purchaseStatus[domainName];
    }

    function getAudioBoundGenre(uint32 index) external view returns (bool) {
        return genreIdIsIn[index];
    }

    function setPurchasePrice(uint256 newPrice) public onlyMember {
        purchasePrice = newPrice;
    }

    function addAudioBoundGenre(uint32 index) public onlyMember {
        require(!genreIdIsIn[index], "This genre id already exists");
        genreIdIsIn[index] = true;
    }

    function disableAudioBoundGenre(uint32 index) public onlyMember {
        require(genreIdIsIn[index], "This genre id doesn't exist");
        genreIdIsIn[index] = false;
    }

    function pause(bool state) public onlyOwner {
        paused = state;
    }

    function withdraw() public payable onlyOwner {
        // This will payout the owner 100% of the contract balance.
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }
}