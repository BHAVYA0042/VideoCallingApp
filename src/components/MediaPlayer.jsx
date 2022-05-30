
import React, { useRef, useEffect } from "react";
import "./Call.css"
function MediaPlayer(props){
  const container = useRef();
  useEffect(() => {
    if (!container.current)return;
    props.videoTrack?.play(container.current);
    return () => {
      props.videoTrack?.stop();
    };
  }, [container, props.videoTrack]);
  useEffect(() => {
    if(props.audioTrack){
      props.audioTrack?.play();
    }
    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);
  return (
    <div ref={container}  className="video-player"></div>
  );
}

export default MediaPlayer;