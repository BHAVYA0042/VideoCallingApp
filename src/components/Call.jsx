import React, { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useAgora from '../hooks/useAgora';
import MediaPlayer from './MediaPlayer';
import './Call.css';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

function Call() {
  const [ appid, setAppid ] = useState('');
  const [ token, setToken ] = useState('');
  const [ channel, setChannel ] = useState('');
  const [isconnected,setIsConnecetd]=useState(false);
  const [isMute,setIsMute]=useState(false);
  const [isVideoOff,setIsVideoOff]=useState(false);
  const {
    localAudioTrack, localVideoTrack, leave, join,mute,videoOff,joinState, remoteUsers
  } = useAgora(client);
  // const insaan=useAgora(client)
  function handleJoin(event){
    setIsConnecetd(true);
    join(appid, channel, token)
    // console.log(insaan);
    console.log(localVideoTrack);
    console.log(localAudioTrack);
    event.preventDefault();
  }
  function handleLeave(event){
    setIsConnecetd(false)
    leave()
    event.preventDefault()
  }
  function auidoOff(event){
    mute(!isMute)
    setIsMute(!isMute)
    event.preventDefault()
  }
  function videoClose(event){
    videoOff(!isVideoOff)
    setIsVideoOff(!isVideoOff)
    event.preventDefault()
  }

  return (
    <div className='call'>
      <form className='call-form'>
        <label>
          AppID:
          <input type='text' name='appid' onChange={(event) => { setAppid(event.target.value) }}/>
        </label>
        <label>
          Token(Optional):
          <input type='text' name='token' onChange={(event) => { setToken(event.target.value) }} />
        </label>
        <label>
          Channel:
          <input type='text' name='channel' onChange={(event) => { setChannel(event.target.value) }} />
        </label>
        <div className='button-group'>
          <button id='join' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={handleJoin}>Join</button>
        </div>
      </form>

      {/* <div className='player-container'>
        <div className='local-player-wrapper'>
          <p className='local-player-text'>{localVideoTrack && `localTrack`}{joinState && localVideoTrack ? `(${client.uid})` : ''}</p>
          <MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>
        </div>
        {remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
            <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
            <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
          </div>))}
      </div> */}
      {isconnected && 
      <div className='player-container'>
        <div className='videos'>
          <div className='local-player-wrapper'>
            <p className='local-player-text'>{localVideoTrack && `localTrack`}{joinState && localVideoTrack ? `(${client.uid})` : ''}</p>
            <MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>
          </div>
          {remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
              <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
              <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
            </div>))}
        </div>
          <div className='controls'>
          <div className="endButton">
            {isMute ? <MicOffIcon className="buttonIcon" onClick={auidoOff}/>:
            <MicIcon className="buttonIcon" onClick={auidoOff}/>}
          </div>
          <div className="endButton"> 
            <CallEndIcon className="buttonIcon" onClick={handleLeave}/>
          </div>
          <div className="endButton">
          {isVideoOff ? <VideocamOffIcon className="buttonIcon" onClick={videoClose}/>:
            <VideocamIcon className="buttonIcon" onClick={videoClose}/>}
          </div>
            
          </div>
          
      </div>}
    </div>
  );
}

export default Call;
