// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AttestaCertificate
 * @dev ERC-721 NFT contract for legal agreement certificates
 *
 * Features:
 * - Mints certificate NFTs for finalized agreements
 * - Stores metadata URI pointing to IPFS/Arweave
 * - Tracks agreement IDs and content hashes on-chain
 * - Multi-chain proof verification
 * - Pausable for emergency stops
 * - ReentrancyGuard for security
 * - Owner-only minting and management
 */
contract AttestaCertificate is
    ERC721,
    ERC721URIStorage,
    Ownable,
    Pausable,
    ReentrancyGuard
{
    uint256 private _nextTokenId = 1;

    // Mapping from token ID to agreement ID
    mapping(uint256 => string) public tokenToAgreementId;

    // Mapping from token ID to content hash
    mapping(uint256 => bytes32) public tokenToContentHash;

    // Mapping from agreement ID to token ID (prevents duplicate mints)
    mapping(string => uint256) public agreementIdToToken;

    // Mapping from token ID to ICP canister ID
    mapping(uint256 => string) public tokenToIcpCanister;

    // Mapping from token ID to Constellation DAG hash
    mapping(uint256 => string) public tokenToConstellationDag;

    // Events
    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string agreementId,
        bytes32 contentHash
    );

    event MultiChainProofAdded(
        uint256 indexed tokenId,
        string icpCanisterId,
        string constellationDagHash
    );

    constructor()
        ERC721("Attesta Certificate", "ATTESTA")
        Ownable(msg.sender)
    {
        // Token IDs start at 1
    }

    /**
     * @dev Mint a new certificate NFT
     * @param to Address to mint the certificate to
     * @param agreementId Unique agreement identifier
     * @param contentHash Hash of the agreement content
     * @param tokenURI IPFS or Arweave URI for metadata
     * @return tokenId The ID of the minted token
     */
    function mintCertificate(
        address to,
        string memory agreementId,
        bytes32 contentHash,
        string memory tokenURI
    ) public onlyOwner whenNotPaused nonReentrant returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(agreementId).length > 0, "Agreement ID cannot be empty");
        require(
            agreementIdToToken[agreementId] == 0,
            "Certificate already minted for this agreement"
        );

        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        tokenToAgreementId[tokenId] = agreementId;
        tokenToContentHash[tokenId] = contentHash;
        agreementIdToToken[agreementId] = tokenId;

        emit CertificateMinted(tokenId, to, agreementId, contentHash);

        return tokenId;
    }

    /**
     * @dev Add multi-chain proof data to existing certificate
     * @param tokenId Token ID of the certificate
     * @param icpCanisterId ICP canister ID storing the agreement
     * @param constellationDagHash Constellation DAG hash
     */
    function addMultiChainProof(
        uint256 tokenId,
        string memory icpCanisterId,
        string memory constellationDagHash
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        tokenToIcpCanister[tokenId] = icpCanisterId;
        tokenToConstellationDag[tokenId] = constellationDagHash;

        emit MultiChainProofAdded(tokenId, icpCanisterId, constellationDagHash);
    }

    /**
     * @dev Verify certificate authenticity
     * @param tokenId Token ID to verify
     * @param contentHash Expected content hash
     * @return bool True if certificate is valid
     */
    function verifyCertificate(
        uint256 tokenId,
        bytes32 contentHash
    ) public view returns (bool) {
        return tokenToContentHash[tokenId] == contentHash;
    }

    /**
     * @dev Get certificate details
     * @param tokenId Token ID
     * @return agreementId Agreement identifier
     * @return contentHash Content hash
     * @return owner Certificate owner
     * @return icpCanisterId ICP canister ID
     * @return constellationDag Constellation DAG hash
     */
    function getCertificateDetails(uint256 tokenId)
        public
        view
        returns (
            string memory agreementId,
            bytes32 contentHash,
            address owner,
            string memory icpCanisterId,
            string memory constellationDag
        )
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        return (
            tokenToAgreementId[tokenId],
            tokenToContentHash[tokenId],
            ownerOf(tokenId),
            tokenToIcpCanister[tokenId],
            tokenToConstellationDag[tokenId]
        );
    }

    /**
     * @dev Get total number of certificates minted
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    /**
     * @dev Pause contract (emergency stop)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override _update to add pausable functionality to transfers
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override whenNotPaused returns (address) {
        return super._update(to, tokenId, auth);
    }
}