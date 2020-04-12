import React, {Fragment} from 'react';
import logo from './logo.svg';
import CheckerBoard from './CheckerBoard'
import './App.css';
//this is in early versions

class App extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      tableRows: [],
      activeCell:{},
    };
    this.handleClick =this.handleClick.bind(this);
    this.lookForwardForValidMoves = this.lookForwardForValidMoves.bind(this);
    this.highlightThisCell = this.highlightThisCell.bind(this)
    this.clearHighlightedCells = this.clearHighlightedCells.bind(this);
    this.movePeice = this.movePeice.bind(this);
    this.newMovePeice = this.newMovePeice.bind(this);
    this.ComputerMakeMove=this.ComputerMakeMove.bind(this);
   }



  ComputerMakeMove(){
    let validMove=false;
    const pieceToMove = this.state.tableRows.find((origin)=>{

    if(origin.peicePresent === 'redPeice'){

      let rightMove = this.state.tableRows.find(cell => cell.xPosition === (origin.xPosition +1) && cell.yPosition === (origin.yPosition +1));
      let leftMove = this.state.tableRows.find(cell => cell.xPosition === (origin.xPosition +1) && cell.yPosition === (origin.yPosition -1));


      if(leftMove && leftMove.peicePresent ===false){
        validMove=leftMove;
      }else if (rightMove&& rightMove.peicePresent === false){
        validMove=rightMove;
      }

    }
    if(validMove){
      return origin;
    }
    })

  setTimeout(()=>{this.newMovePeice(pieceToMove,validMove)}, 1000)


  }

  newMovePeice(orginalLocation, newLocation){

    const copyOfOriginalTableState = [...this.state.tableRows]

    const indexOfOriginalLocation = copyOfOriginalTableState.findIndex(cell => cell.xPosition=== orginalLocation.xPosition && cell.yPosition === orginalLocation.yPosition);
    const indexOfNewLocation = copyOfOriginalTableState.findIndex(cell => cell.xPosition === newLocation.xPosition && cell.yPosition === newLocation.yPosition);

    const newOriginLocation = {...copyOfOriginalTableState[indexOfOriginalLocation]};
    newOriginLocation.peicePresent=false;
    newOriginLocation.element =<div className={orginalLocation.element.props.className}></div>


    const newLocationLocation = {...copyOfOriginalTableState[indexOfNewLocation]};
    newLocationLocation.peicePresent= orginalLocation.peicePresent;


    newLocationLocation.element=<div className={newLocation.element.props.className} ><span className={orginalLocation.peicePresent}></span></div>


    copyOfOriginalTableState.splice(indexOfOriginalLocation,1,newOriginLocation);
    copyOfOriginalTableState.splice(indexOfNewLocation,1,newLocationLocation);
    debugger;
    this.setState({tableRows: copyOfOriginalTableState});





  }

  componentDidMount() {
    const buildTable = [];
    let count =0
    for (let x = 0; x < 8; x++) {

      for (let y = 0; y < 8; y++) {
        if(x %2 === 0 && y %2 === 0){
            buildTable.push({
              status: null,
              color: 'red',
                xPosition: x,
                yPosition: y,
              peicePresent:false,
                element:
          <div  onClick={()=>this.handleClick(x,y)}  className='redSquare'></div>})
        }else if(x %2!== 0 && y%2 !==0){

          buildTable.push({
            status: null,
            color: 'red',
            xPosition: x,
            yPosition: y,
            peicePresent:false,
            element:<div  onClick={()=>this.handleClick(x,y)} className='redSquare'></div>})
        }
        else if(x < 3) {
          buildTable.push({
            status: null,
            xPosition: x,
            color: 'black',
            yPosition: y,
            peicePresent:'redPeice',
            element:<div className='blackSquare' onClick={()=>this.handleClick(x,y)} > <span className='redPeice'></span></div>})
        }else if(x >4 && x< 8 ){
          buildTable.push({
            status: null,
            xPosition: x,
            color: 'black',
            yPosition: y,
            peicePresent:'blackPeice',
            element:<div className='blackSquare' onClick={() =>this.handleClick(x,y)} ><span className='blackPeice'> </span></div>})
        }else{  buildTable.push({
          status: null,
          xPosition: x,
          color: 'black',
          yPosition: y,
          peicePresent:false,
          element:<div  onClick={()=>this.handleClick(x,y)} className='blackSquare'></div>})}

      }

    }
    this.setState({tableRows: buildTable})
  }
  movePeice(newXPos, newYPos){


    let copyOfTableState = [...this.state.tableRows]

    const locationOfPeiceToMove = this.state.tableRows.findIndex(cell => cell.xPosition === this.state.activeCell.xPosition && cell.yPosition === this.state.activeCell.yPosition);


    let copyOFNewCell = copyOfTableState[locationOfPeiceToMove];

    copyOFNewCell.peicePresent =false;

    copyOFNewCell.element = <div onClick={()=> this.handleClick(copyOFNewCell.xPosition, copyOFNewCell.yPosition)} className={copyOFNewCell.element.props.className} > </div>

    copyOfTableState.splice(locationOfPeiceToMove,1,copyOFNewCell);


    const targetLocation = this.state.tableRows.findIndex(cell => cell.xPosition === newXPos && cell.yPosition === newYPos);

    let copyOfNewTarget = copyOfTableState[targetLocation];
    copyOfNewTarget.peicePresent = "blackPeice";
    copyOfNewTarget.xPosition = newXPos;
    copyOfNewTarget.yPosition = newYPos;
    copyOfNewTarget.element = <div onClick={()=> this.handleClick(newXPos,newYPos)} className={copyOFNewCell.element.props.className}><span className='blackPeice'> </span></div>


    copyOfTableState.splice(targetLocation,1,copyOfNewTarget);

    this.setState({tableRows: copyOfTableState})

    this.ComputerMakeMove();

  }


  clearHighlightedCells(){

    let highlightedCells=[];

    this.state.tableRows.forEach((cell) =>{

      if(cell.status === 'highLighted'){
        highlightedCells.push({xPosition : cell.xPosition, yPosition: cell.yPosition,});
      }
    } );



    let newRows = [...this.state.tableRows];

    highlightedCells.forEach(highlightedCell =>{
      let foundCellLocation = this.state.tableRows.findIndex(cell=> cell.xPosition === highlightedCell.xPosition && cell.yPosition === highlightedCell.yPosition);
      let updatedCell = this.state.tableRows[foundCellLocation];
      updatedCell.status=null;
      if(updatedCell.color === 'black'){
        updatedCell.element =<div  onClick={()=>this.handleClick(updatedCell.xPosition,updatedCell.yPosition)} className='blackSquare'></div>
      } if(updatedCell.color === 'red'){
        updatedCell.element =<div  onClick={()=>this.handleClick(updatedCell.xPosition,updatedCell.yPosition)} className='redSquare'></div>
      }



      newRows.splice(foundCellLocation,1,updatedCell);


    })


this.setState({tableRows: newRows});

  }
  highlightThisCell(cell){
    const formattedCell = {...cell};
    formattedCell.status = 'highLighted';
    let targetLocation = this.state.tableRows.findIndex(oldcell => oldcell.xPosition === cell.xPosition && oldcell.yPosition === cell.yPosition);
    const newTableRows = [...this.state.tableRows];
    formattedCell.element= <div onClick={()=> this.handleClick(formattedCell.xPosition, formattedCell.yPosition, true)} className='highlighted' ></div>

    newTableRows.splice(targetLocation, 1 , formattedCell);

    this.setState({tableRows: newTableRows});





  }
 async lookForwardForValidMoves(xPosition, yPosition){
    let leftMove = this.state.tableRows.find(cell => cell.xPosition === (xPosition -1) && cell.yPosition === (yPosition +1));
    let rightMove = this.state.tableRows.find(cell => cell.xPosition === (xPosition -1) && cell.yPosition === (yPosition -1));

    if(leftMove && leftMove.peicePresent === false){
      await this.highlightThisCell(leftMove)
    } if(rightMove && rightMove.peicePresent === false){
      await this.highlightThisCell(rightMove)
    }

  }

  async handleClick(xPosition, yPosition,isValidMove =false){

    let foundCell = this.state.tableRows.find(row => row.xPosition === xPosition && row.yPosition === yPosition);
    await this.clearHighlightedCells();
    if(isValidMove){
      this.movePeice(xPosition,yPosition);
    }else{
      if(foundCell.peicePresent && foundCell.peicePresent ==="blackPeice"){

        this.lookForwardForValidMoves(xPosition, yPosition);
        this.setState({activeCell: {xPosition, yPosition}})


      }
    }




  }
  render(){
    return (
        <div  className='mainScreen'>

        <div className="grid-container">
          {
            this.state.tableRows.map(item => item.element)
          }


        </div>
        </div>
    );
  }

}

export default App;
