import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export default function useAgora(client)
  // :
  //  {
  //     localAudioTrack: ILocalAudioTrack | undefined,
  //     localVideoTrack: ILocalVideoTrack | undefined,
  //     joinState: boolean,
  //     leave: Function,
  //     join: Function,
  //     remoteUsers: IAgoraRTCRemoteUser[],
  //   }
    {
  const [localVideoTrack, setLocalVideoTrack] = useState(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState(undefined);
  const [audio,setAudio]=useState();
  const [video,setVideo]=useState();

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState([]);

  async function createLocalTracks(audioConfig, videoConfig){
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  async function join(appid,channel,token,uid) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();
    setAudio(microphoneTrack);
    setVideo(cameraTrack);
    console.log(microphoneTrack);
    console.log(audio);
    console.log(video);
    await client.join(appid, channel, token || null);
    await client.publish([microphoneTrack, cameraTrack]);

    // (window as any).client = client;
    // (window as any).videoTrack = cameraTrack;
    window.client = client;
    window.videoTrack = cameraTrack;

    setJoinState(true);
  }

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    setRemoteUsers([]);
    setJoinState(false);
    await client?.leave();
  }

  async function mute(val) {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!val)
    }
    console.log(audio);
  }
  async function videoOff(val) {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!val)
    }
    console.log(video);
  }

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user,mediaType) => {
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserUnpublished = (user) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserJoined = (user) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserLeft = (user) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    mute,
    videoOff,
    remoteUsers,
  };
}