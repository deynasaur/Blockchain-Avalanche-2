// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {

    address payable public owner;
    uint256 public balance;

    struct Racket {
        string model;
        uint cost;
    }

    mapping(string => Racket) private store;
    mapping(address => string[]) private myRackets;

    event Deposit(uint256 amount);
    event Withdraw(uint256 _withdrawAmount);
    event RacketBought(uint amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;

        store["Yonex Astrox 77 Pro"] = Racket("Yonex Astrox 77 Pro", 1);
        store["RSL Magnum M8"] = Racket("RSL Magnum M8", 1);
        store["Victor DriveX KT I"] = Racket("Victor DriveX KT I", 1);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    function showStore() public view returns (Racket[] memory) {
        Racket[] memory rckt = new Racket[](3);
        rckt[0] = store["Yonex Astrox 77 Pro"];
        rckt[1] = store["RSL Magnum M8"];
        rckt[2] = store["Victor DriveX KT I"];
        return rckt;
    }

    function buyRacket(string memory racketID) public payable {
        Racket memory rckt = store[racketID];

        require(bytes(rckt.model).length != 0, "Racket does not exist.");
        require(msg.value >= rckt.cost * 1 ether, "Insufficient Ether Balance.");

        balance -= rckt.cost;
        myRackets[msg.sender].push(racketID);
        emit RacketBought(rckt.cost);
    }

    function deposit(uint256 _amount) public payable onlyOwner {
        uint _previousBalance = balance;
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }


    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public payable onlyOwner {
        uint _previousBalance = balance;

        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);
    }

    function showMyRackets() public view returns (string[] memory) {
        return myRackets[msg.sender];
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

}
