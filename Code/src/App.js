import React, {Fragment} from 'react';
import './App.css';

//this is in early versions

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            humanHasDoublejump: false,
            tableRows: [],
            activeCell: {},
            redPeicesTaken: 0,
            BlackPeicesTaken: 0
        };
        this.handleClick = this.handleClick.bind(this);
        this.lookForwardForValidMoves = this.lookForwardForValidMoves.bind(this);
        this.highlightThisCell = this.highlightThisCell.bind(this)
        this.clearHighlightedCells = this.clearHighlightedCells.bind(this);
        this.checkForKinging = this.checkForKinging.bind(this);
        this.newMovePeice = this.newMovePeice.bind(this);
        this.ComputerMakeMove = this.ComputerMakeMove.bind(this);
        this.checkForJumpLeft = this.checkForJumpLeft.bind(this);
        this.logtableStateToConsole = this.logtableStateToConsole.bind(this);
    }
    logtableStateToConsole(){
        console.log(this.state.tableRows);
    }

    checkForKinging(newLocation , isAIMove) {
        if (!isAIMove && newLocation.xPosition === 0) {
            // this represents a kingCondition
            const copyOfTable = [...this.state.tableRows];

            const king = copyOfTable.find(cell => cell.xPosition === newLocation.xPosition && cell.yPosition === newLocation.yPosition);
            const indexOfPeiceToBeKing = copyOfTable.findIndex(cell => cell.xPosition === newLocation.xPosition && cell.yPosition === newLocation.yPosition);

            king.isKing = true;

            king.element = <div className={king.element.props.className}
                                onClick={() => this.handleClick(newLocation.xPosition, newLocation.yPosition)}><span
                className={king.element.props.children.props.className}>K</span></div>
            copyOfTable.splice(indexOfPeiceToBeKing, 1, king);


            this.setState({tableRows: copyOfTable});
        }else if(isAIMove){
            debugger;
            const copyOfTable = [...this.state.tableRows];
            const king = copyOfTable.find(cell => cell.xPosition === newLocation.xPosition && cell.yPosition === newLocation.yPosition);
        }
    }

    async checkForJumpLeft(x, y, cell, direction) {
        let validjump = false
        let jump = {};

        if (direction === 'right') {

            jump = this.state.tableRows.find(cell => cell.xPosition === (x - 2) && cell.yPosition === (y - 2));

            if (jump && jump.peicePresent === false) {
                validjump = true;

            }

        } else if (direction === 'left') {
            jump = this.state.tableRows.find(cell => cell.xPosition === (x - 2) && cell.yPosition === (y + 2));
            if (jump && jump.peicePresent === false) {
                validjump = true;
            }

        }else if (direction === "backleft"){
            jump = this.state.tableRows.find(cell => cell.xPosition === (x+2) && cell.yPosition === (y - 2));
            if (jump && jump.peicePresent === false) {
                validjump = true;

            }

        }else if(direction === "backright"){
            jump = this.state.tableRows.find(cell => cell.xPosition === (x + 2) && cell.yPosition === (y + 2));
            if (jump && jump.peicePresent === false) {
                validjump = true;

            }
        }
        if (validjump) {
            await this.highlightThisCell(jump)
        }
    }


    async ComputerMakeMove() {
        let validMove = false;
        let validJump = false;

        this.state.tableRows.forEach((cell) => {


            if (cell.peicePresent === "redPeice") {

                let leftMove = this.state.tableRows.find(row => row.xPosition === cell.xPosition + 1 && row.yPosition === cell.yPosition - 1);
                let rightMove = this.state.tableRows.find(row => row.xPosition === cell.xPosition + 1 && row.yPosition === cell.yPosition + 1);
                if (leftMove && leftMove.peicePresent === 'blackPeice' && validJump !== true) {
                    // look left for valid jump
                    let landingSpace = this.state.tableRows.find(row => row.xPosition === leftMove.xPosition + 1 && row.yPosition === leftMove.yPosition - 1);

                    if (landingSpace && landingSpace.peicePresent === false) {
                        validJump = true;

                        setTimeout(async () => {
                            await this.newMovePeice(cell, landingSpace, true, true);
                        }, 1000)
                    }
                    return
                } else if (rightMove && rightMove.peicePresent === 'blackPeice' && validJump !== true) {
                    //look right for valid jump
                    let landingSpace = this.state.tableRows.find(row => row.xPosition === rightMove.xPosition + 1 && row.yPosition === rightMove.yPosition + 1);

                    if (landingSpace && landingSpace.peicePresent === false) {
                        validJump = true;


                        setTimeout(async () => {
                            await this.newMovePeice(cell, landingSpace, true, true);
                        }, 1000)
                    }
                    return
                }

            }
        })
        if (!validJump) {
            const pieceToMove = this.state.tableRows.find((origin) => {

                if (origin.peicePresent === 'redPeice') {

                    let rightMove = this.state.tableRows.find(cell => cell.xPosition === (origin.xPosition + 1) && cell.yPosition === (origin.yPosition + 1));
                    let leftMove = this.state.tableRows.find(cell => cell.xPosition === (origin.xPosition + 1) && cell.yPosition === (origin.yPosition - 1));


                    if (leftMove && leftMove.peicePresent === false) {
                        validMove = leftMove;
                    } else if (rightMove && rightMove.peicePresent === false) {
                        validMove = rightMove;
                    }

                }
                if (validMove) {
                    return origin;
                }
            })


            setTimeout(() => {
                this.newMovePeice(pieceToMove, validMove, true)
            }, 1000)

        }


    }

    async newMovePeice(orginalLocation, newLocation, isAiMove = false, isJump) {
        let humanHasDoublejump= false

        const {redPeicesTaken, BlackPeicesTaken} = this.state;
        const copyOfOriginalTableState = [...this.state.tableRows]

        const indexOfOriginalLocation = copyOfOriginalTableState.findIndex(cell => cell.xPosition === orginalLocation.xPosition && cell.yPosition === orginalLocation.yPosition);
        const indexOfNewLocation = copyOfOriginalTableState.findIndex(cell => cell.xPosition === newLocation.xPosition && cell.yPosition === newLocation.yPosition);

        const newOriginLocation = {...copyOfOriginalTableState[indexOfOriginalLocation]};
        newOriginLocation.peicePresent = false;
        newOriginLocation.isKing = false;

        newOriginLocation.element = <div className={orginalLocation.element.props.className}></div>


        const newLocationLocation = {...copyOfOriginalTableState[indexOfNewLocation]};

        newLocationLocation.peicePresent = orginalLocation.peicePresent;

        if (!orginalLocation.isKing) {
            newLocationLocation.element =
                <div onClick={() => this.handleClick(newLocationLocation.xPosition, newLocationLocation.yPosition)}
                     className={newLocation.element.props.className}><span
                    className={orginalLocation.peicePresent}></span>
                </div>
        } else {
            newLocationLocation.isKing = true;
            newLocationLocation.element =
                <div onClick={() => this.handleClick(newLocationLocation.xPosition, newLocationLocation.yPosition)}
                     className={newLocation.element.props.className}><span
                    className={orginalLocation.peicePresent}>K</span>
                </div>
        }


        if (isJump) {
            let indexOfPeiceToRemove = undefined;

                if (newOriginLocation.yPosition > newLocationLocation.yPosition) {
                    //left jump
                    if (!isAiMove) {
                        indexOfPeiceToRemove = this.state.tableRows.findIndex(cell => cell.xPosition === (orginalLocation.xPosition - 1) && cell.yPosition === (orginalLocation.yPosition - 1));
                    } else {
                        indexOfPeiceToRemove = this.state.tableRows.findIndex(cell => cell.xPosition === (orginalLocation.xPosition + 1) && cell.yPosition === (orginalLocation.yPosition - 1));
                    }


                } else {
                    //right jump
                    if (!isAiMove) {
                        indexOfPeiceToRemove = this.state.tableRows.findIndex(cell => cell.xPosition === (orginalLocation.xPosition - 1) && cell.yPosition === (orginalLocation.yPosition + 1));
                    } else {
                        indexOfPeiceToRemove = this.state.tableRows.findIndex(cell => cell.xPosition === (orginalLocation.xPosition + 1) && cell.yPosition === (orginalLocation.yPosition + 1));
                    }


                }
                if(newLocationLocation.isKing){
                if(this.state.activePlayerPeice && this.state.activePlayerPeice.isKing && newLocationLocation.xPosition - newOriginLocation.xPosition === 2 && orginalLocation.yPosition - newLocationLocation.yPosition === 2){
                 //backleft capture
                    indexOfPeiceToRemove = this.state.tableRows.findIndex(cell => cell.xPosition === (orginalLocation.xPosition + 1) && cell.yPosition === (orginalLocation.yPosition - 1));

                }

                if(this.state.activePlayerPeice && this.state.activePlayerPeice.isKing &&newLocationLocation.yPosition - newOriginLocation.yPosition === 2 && orginalLocation.xPosition - newLocationLocation.xPosition === -2){
                    //backright capture
                    indexOfPeiceToRemove = this.state.tableRows.findIndex(cell => cell.xPosition === (orginalLocation.xPosition + 1) && cell.yPosition === (orginalLocation.yPosition + 1));

                }
            }





            let newCell = copyOfOriginalTableState[indexOfPeiceToRemove];
            newCell.peicePresent = false;
            newCell.isKing = false;
            newCell.element = <div onClick={() => this.handleClick(newCell.xPosition, newCell.yPosition)}
                                   className='blackSquare'></div>
            copyOfOriginalTableState.splice(indexOfPeiceToRemove, 1, newCell)


            if (isAiMove) {
                this.setState({BlackPeicesTaken: BlackPeicesTaken + 1})


            } else {
                this.setState({redPeicesTaken: redPeicesTaken + 1})

                let rightMove = this.state.tableRows.find(cell => cell.xPosition === (newLocationLocation.xPosition - 1) && cell.yPosition === (newLocationLocation.yPosition + 1));
                let leftMove =  this.state.tableRows.find(cell => cell.xPosition === (newLocationLocation.xPosition - 1) && cell.yPosition === (newLocationLocation.yPosition - 1));



                if (leftMove && leftMove.peicePresent === 'redPeice') {

                    let landingSpot =  this.state.tableRows.find(cell => cell.xPosition === (newLocationLocation.xPosition - 2) && cell.yPosition === (newLocationLocation.yPosition - 2));

                    if(landingSpot&& landingSpot.peicePresent === false){
                       humanHasDoublejump = true;
                    }

                }

                if (rightMove && rightMove.peicePresent === 'redPeice') {
                    let landingSpot = this.state.tableRows.find(cell => cell.xPosition === (newLocationLocation.xPosition - 2) && cell.yPosition === (newLocationLocation.yPosition + 2));

                    if(landingSpot&& landingSpot.peicePresent === false){
                        humanHasDoublejump = true;
                    }
                }
                if(newLocationLocation.isking){

                }

            }
        }
        copyOfOriginalTableState.splice(indexOfOriginalLocation, 1, newOriginLocation);

        copyOfOriginalTableState.splice(indexOfNewLocation, 1, newLocationLocation);

        this.setState({tableRows: copyOfOriginalTableState, humanHasDoublejump});


        this.checkForKinging(newLocation, isAiMove);
        if (isAiMove === false && !humanHasDoublejump && !this.state.redPeicesTaken.length < 12) {
            this.ComputerMakeMove();
        }
    }

    componentDidMount() {
        const buildTable = [];
        let count = 0
        for (let x = 0; x < 8; x++) {

            for (let y = 0; y < 8; y++) {
                if (x % 2 === 0 && y % 2 === 0) {
                    buildTable.push({
                        status: null,
                        color: 'red',
                        xPosition: x,
                        yPosition: y,
                        peicePresent: false,
                        isKing: false,
                        element:
                            <div onClick={() => this.handleClick(x, y)} className='redSquare'></div>
                    })
                } else if (x % 2 !== 0 && y % 2 !== 0) {

                    buildTable.push({
                        status: null,
                        color: 'red',
                        xPosition: x,
                        yPosition: y,
                        peicePresent: false,
                        isKing: false,
                        element: <div onClick={() => this.handleClick(x, y)} className='redSquare'></div>
                    })
                } else if (x < 3) {
                    buildTable.push({
                        status: null,
                        xPosition: x,
                        color: 'black',
                        yPosition: y,
                        peicePresent: 'redPeice',
                        isKing: false,
                        element: <div className='blackSquare' onClick={() => this.handleClick(x, y)}><span
                            className='redPeice'></span></div>
                    })
                } else if (x > 4 && x < 8) {
                    buildTable.push({
                        status: null,
                        xPosition: x,
                        color: 'black',
                        yPosition: y,
                        peicePresent: 'blackPeice',
                        isKing: false,
                        element: <div className='blackSquare' onClick={() => this.handleClick(x, y)}><span
                            className='blackPeice'> </span></div>
                    })
                } else {
                    buildTable.push({
                        status: null,
                        xPosition: x,
                        color: 'black',
                        yPosition: y,
                        peicePresent: false,
                        element: <div onClick={() => this.handleClick(x, y)} className='blackSquare'></div>
                    })
                }

            }

        }
        this.setState({tableRows: buildTable})
    }


    clearHighlightedCells() {

        let highlightedCells = [];

        this.state.tableRows.forEach((cell) => {

            if (cell.status === 'highLighted') {
                highlightedCells.push({xPosition: cell.xPosition, yPosition: cell.yPosition,});
            }
        });


        let newRows = [...this.state.tableRows];

        highlightedCells.forEach(highlightedCell => {
            let foundCellLocation = this.state.tableRows.findIndex(cell => cell.xPosition === highlightedCell.xPosition && cell.yPosition === highlightedCell.yPosition);
            let updatedCell = this.state.tableRows[foundCellLocation];
            updatedCell.status = null;
            if (updatedCell.color === 'black') {
                updatedCell.element =
                    <div onClick={() => this.handleClick(updatedCell.xPosition, updatedCell.yPosition)}
                         className='blackSquare'></div>
            }
            if (updatedCell.color === 'red') {
                updatedCell.element =
                    <div onClick={() => this.handleClick(updatedCell.xPosition, updatedCell.yPosition)}
                         className='redSquare'></div>
            }


            newRows.splice(foundCellLocation, 1, updatedCell);


        })


        this.setState({tableRows: newRows});

    }

    highlightThisCell(cell) {
        const formattedCell = {...cell};
        formattedCell.status = 'highLighted';
        let targetLocation = this.state.tableRows.findIndex(oldcell => oldcell.xPosition === cell.xPosition && oldcell.yPosition === cell.yPosition);
        const newTableRows = [...this.state.tableRows];
        formattedCell.element =
            <div onClick={() => this.handleClick(formattedCell.xPosition, formattedCell.yPosition, true)}
                 className='highlighted'></div>

        newTableRows.splice(targetLocation, 1, formattedCell);

        this.setState({tableRows: newTableRows});


    }

    async lookForwardForValidMoves(xPosition, yPosition, foundCell) {
        let leftMove = this.state.tableRows.find(cell => cell.xPosition === (xPosition - 1) && cell.yPosition === (yPosition + 1));
        let rightMove = this.state.tableRows.find(cell => cell.xPosition === (xPosition - 1) && cell.yPosition === (yPosition - 1));

        if (leftMove && leftMove.peicePresent === false) {
            await this.highlightThisCell(leftMove)
        }
        if (rightMove && rightMove.peicePresent === false) {
            await this.highlightThisCell(rightMove)
        }

        if (leftMove && leftMove.peicePresent === 'redPeice') {
            this.checkForJumpLeft(xPosition, yPosition, foundCell, 'left');
        }

        if (rightMove && rightMove.peicePresent === 'redPeice') {
            this.checkForJumpLeft(xPosition, yPosition, foundCell, 'right')
        }

        if (foundCell.isKing) {
            const rearLeftMove = this.state.tableRows.find(cell => cell.xPosition === (xPosition + 1) && cell.yPosition === (yPosition - 1));
            const rearRightMove = this.state.tableRows.find(cell => cell.xPosition === (xPosition + 1) && cell.yPosition === (yPosition + 1));

            if (rearLeftMove && rearLeftMove.peicePresent === false) {
                await this.highlightThisCell(rearLeftMove);
            }
            if (rearRightMove && rearRightMove.peicePresent === false) {
                await this.highlightThisCell(rearRightMove);
            }

            if (rearLeftMove && rearLeftMove.peicePresent === 'redPeice') {
                this.checkForJumpLeft(xPosition, yPosition, foundCell, 'backleft');
            }

            if (rearRightMove && rearRightMove.peicePresent === 'redPeice') {
                this.checkForJumpLeft(xPosition, yPosition, foundCell, 'backright')
            }
        }


        this.setState({activePlayerPeice: foundCell})
    }

    async handleClick(xPosition, yPosition, isValidMove = false) {

        let isJump = false;
        let foundCell = this.state.tableRows.find(row => row.xPosition === xPosition && row.yPosition === yPosition);
        await this.clearHighlightedCells();

        if ((this.state.activePlayerPeice && this.state.activePlayerPeice.xPosition - xPosition === 2 && this.state.activePlayerPeice.yPosition - yPosition === 2) ||
            (this.state.activePlayerPeice && this.state.activePlayerPeice.xPosition - xPosition === 2 && this.state.activePlayerPeice.yPosition - yPosition === -2)||
            ((this.state.activePlayerPeice && this.state.activePlayerPeice.isKing && this.state.activePlayerPeice.xPosition - xPosition === -2 && this.state.activePlayerPeice.yPosition - yPosition === -2))||
            ((this.state.activePlayerPeice && this.state.activePlayerPeice.isKing && this.state.activePlayerPeice.yPosition - yPosition === 2 && this.state.activePlayerPeice.xPosition - xPosition === -2))
        ) {


            isJump = true;

        }

        if (isValidMove) {

            this.newMovePeice(this.state.activePlayerPeice, foundCell, false, isJump)
        } else {
            if (foundCell.peicePresent && foundCell.peicePresent === "blackPeice") {

                this.lookForwardForValidMoves(xPosition, yPosition, foundCell);
            }

        }


    }

    render() {
        return (<div>
                <div className="playArea">
                    <div className="TopBanner">
                        <div className="leftText">
                            Red Pieces Taken
                            <br/>
                            <br/>
                            {this.state.redPeicesTaken}
                        </div>
                        <div className="rightText">

                            Black Pieces Taken
                            <br/>
                            <br/>
                            {this.state.BlackPeicesTaken}
                        </div>
                    </div>

                    <div className="grid-container">
                        {
                            this.state.tableRows.map(item => item.element)
                        }

                    </div>{
                    this.state.humanHasDoublejump &&
                    <div className="doubleJumpNotice"> DOUBLE JUMP!</div>
                }

                </div>
            </div>


        );
    }

}

export default App;
