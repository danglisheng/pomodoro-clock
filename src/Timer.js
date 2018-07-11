import React, { Component } from "react";
import TimerLengthControl from "./TimerLengthControl";
import TimerController from "./TimerController";
import Alarm from './Alarm';
import Modal from './Modal';
class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			brkLength: 5, //休息时长
			workLength: 25, //工作时长
			timerState: "stopped", //当前时钟状态，运行或停止
			timerType: "工作", //当前时钟类型
			timer: 1500, //当前时钟类型剩余的秒数
			intervalID: "",
			alarmColor: { color: "#2931B3" }, //预警颜色
			isModalOpen:false
		};
		/* 时长类型和定时器类型间的映射关系*/
		this.lenMapToTimer = {
			brkLength: "休息",
			workLength: "工作"
		};

		this.lengthControl = this.lengthControl.bind(this);
		this.toggleTimer = this.toggleTimer.bind(this);
		this.beginCountDown = this.beginCountDown.bind(this);
		this.phaseControl = this.phaseControl.bind(this);
		this.switchTimer = this.switchTimer.bind(this);
		this.tick = this.tick.bind(this);
		this.reset = this.reset.bind(this);
		this.getAlarmNode=this.getAlarmNode.bind(this);
		this.closeModal=this.closeModal.bind(this);
	}

	lengthControl(lengthType, sign) {
		const currentLength = this.state[lengthType];
		/* 如果当前时钟正在运行，则不能调整时长*/
		if (this.state.timerState === "running") {
			this.setState({isModalOpen:true});
			return;
		}
		if (sign === "-" && currentLength !== 1) {
			this.setState({
				[lengthType]: currentLength - 1
			});
		} else if (sign === "+" && currentLength !== 60) {
			this.setState({
				[lengthType]: currentLength + 1
			});
		}
		/* 若当前的时钟类型刚好是正在调整的时长类型，则修改timer状态*/
		if (this.state.timerType === this.lenMapToTimer[lengthType]) {
			this.setState(prevState => {
				return { timer: prevState[lengthType] * 60 };
			});
		}
	}
	toggleTimer() {
		if (this.state.timerState === "stopped") {
			this.setState({ timerState: "running" });
			this.beginCountDown();
		} else {
			this.setState({ timerState: "stopped" });
			this.state.intervalID && this.state.intervalID.cancel();
		}
	}
	beginCountDown() {
		
		this.setState({
			intervalID: window.accurateInterval(() => {
				/* 定时器计数减一*/
				this.setState({ timer: this.state.timer - 1 });
				this.phaseControl();
			}, 1000)
		});
	}

	phaseControl() {
		let timer = this.state.timer;
		/* 若剩余时间少于一分钟，则把报警色置为红色*/
		timer < 61
			? this.setState({ alarmColor: { color: "#a50d0d" } })
			: this.setState({ alarmColor: { color: "#2931B3" } });
		/* 若剩余时间为零，则播放报警音乐。*/
		if (timer === 0) {
			console.log("timer:", timer);
			this.audioBeep.currentTime = 0;
			this.audioBeep.play();
			this.switchTimer();
		}
	}

	switchTimer() {
		let timer, timerType;
		if (this.state.timerType === "工作") {
			timer = this.state.brkLength * 60;
			timerType = "休息";
		} else {
			timer = this.state.workLength * 60;
			timerType = "工作";
		}
		this.state.intervalID && this.state.intervalID.cancel();
		this.setState({
			timer: timer,
			timerType: timerType,
			alarmColor: { color: "#2931B3" }
		});
		this.beginCountDown();
	}
	tick() {
		let minutes = Math.floor(this.state.timer / 60);
		let seconds = this.state.timer % 60;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		return minutes + ":" + seconds;
	}
	reset() {
		this.setState({
			brkLength: 5,
			workLength: 25,
			timerState: "stopped",
			timerType: "工作",
			timer: 1500,
			intervalID: "",
			alarmColor: { color: "#2931B3" }
		});
		this.state.intervalID && this.state.intervalID.cancel();
		this.audioBeep.pause();
		this.audioBeep.currentTime = 0;
	}
	getAlarmNode(audio){
		this.audioBeep=audio;
	}
	closeModal(){
		this.setState({isModalOpen:false});
	}
	render() {
		return (
			<div>
				<div className="main-title">番茄时钟</div>
				<TimerLengthControl
					title="休息时长"
					lengthControl={this.lengthControl}
					length={this.state.brkLength}
					lengthType="brkLength"
				/>
				<TimerLengthControl
					title="工作时长"
					lengthControl={this.lengthControl}
					length={this.state.workLength}
					lengthType="workLength"
				/>
				<div className="timer" style={this.state.alarmColor}>
					<div className="timer-wrapper">
						<div id="timer-label">{this.state.timerType}</div>
						<div id="time-left">{this.tick()}</div>
					</div>
				</div>
				<TimerController
					toggleTimer={this.toggleTimer}
					reset={this.reset}
					timerState={this.state.timerState}
				/>
				<Alarm getAlarmNode={this.getAlarmNode}/>
				{(this.state.isModalOpen)&&(<Modal closeModal={this.closeModal}/>)}
					

			</div>
		);
	}
}
export default Timer;
