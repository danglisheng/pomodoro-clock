import React, { Component } from 'react';
class TimerLengthControl extends Component {
  render() {
    return (
      <div className="length-control">
        <div className="length-title">
          {this.props.title}
        </div>
        <button 
          className="btn-level" value="-" 
          onClick={(e)=>{this.props.lengthControl(this.props.lengthType,e.currentTarget.value)}}>
          -
        </button>
        <div  className="btn-level">
          {this.props.length}
        </div>
        <button
          className="btn-level" value="+" 
          onClick={(e)=>{this.props.lengthControl(this.props.lengthType,e.currentTarget.value)}}>
          +
        </button>
      </div>
    )
  }
};
export default TimerLengthControl;