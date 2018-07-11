import React from 'react';
const Alarm=(props)=>{
	return (<audio
					id="beep"
					preload="auto"
					src="./sounds/BeepSound.wav"
					ref={
						(ele)=>{props.getAlarmNode(ele)}
						}
				/>
		)
}
export default Alarm;