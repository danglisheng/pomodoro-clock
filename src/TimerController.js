import React, { Component } from 'react';
class TimerController extends Component{
	render(){
		return (
			<div className="timer-control">
          <button className="start-stop" onClick={this.props.toggleTimer}>
            {this.props.timerState==="stopped"?"开始":"暂停"}
          </button>
          <button className="reset" onClick={this.props.reset}>
            重置
          </button>
        </div>
        );
	}
}
export default TimerController;