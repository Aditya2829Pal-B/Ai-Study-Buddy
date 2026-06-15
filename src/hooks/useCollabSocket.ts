import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { DrawLine } from '../components/collab/types';
import { useRoomStore } from '../stores/collab/useRoomStore';
import { useChatStore } from '../stores/collab/useChatStore';
import { useWhiteboardStore } from '../stores/collab/useWhiteboardStore';
import { useVoiceStore } from '../stores/collab/useVoiceStore';
import { socketManager } from '../services/socket.manager';

export function useCollabSocket(roomId: string, user: any) {
  const [socket, setSocket] = useState<Socket | null>(null);

  const setText = useRoomStore((state) => state.setText);
  const setLines = useWhiteboardStore((state) => state.setLines);
  const addLine = useWhiteboardStore((state) => state.addLine);
  const clearCanvas = useWhiteboardStore((state) => state.clearCanvas);
  const setChatMessages = useChatStore((state) => state.setMessages);
  const addChatMessage = useChatStore((state) => state.addMessage);
  const setIsVoiceActive = useVoiceStore((state) => state.setIsVoiceActive);

  // Voice Chat State
  const localStream = useRef<MediaStream | null>(null);
  const peers = useRef<Record<string, RTCPeerConnection>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const createPeer = (peerId: string, skt: Socket, initiator: boolean) => {
    const peer = new RTCPeerConnection({
       iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        peer.addTrack(track, localStream.current!);
      });
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        skt.emit('webrtc-ice-candidate', { targetId: peerId, candidate: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      let audio = audioRefs.current[peerId];
      if (!audio) {
        audio = new Audio();
        audio.autoplay = true;
        audioRefs.current[peerId] = audio;
      }
      audio.srcObject = event.streams[0];
    };

    if (initiator) {
      peer.onnegotiationneeded = async () => {
        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          skt.emit('webrtc-offer', { targetId: peerId, offer });
        } catch (e) { console.error(e); }
      };
    }
    return peer;
  };

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      setIsVoiceActive(true);
      if (socket) {
        socket.emit('join-voice', roomId);
      }
    } catch (err: any) {
      console.error("Mic error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert("Microphone access was denied. Please allow microphone permissions in your site settings to use live talking.");
      } else {
        alert("Could not access microphone for live talking.");
      }
    }
  };

  const stopVoice = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(t => t.stop());
      localStream.current = null;
    }
    Object.values(peers.current).forEach(p => p.close());
    peers.current = {};
    setIsVoiceActive(false);
    if (socket) socket.emit('leave-voice', roomId);
  };

  useEffect(() => {
    const activeSocket = socketManager.connect();
    setSocket(activeSocket);

    // Core collaboration events
    const onConnect = () => socketManager.emit('join-collab', roomId);
    const onCollabState = (state: { text: string, lines: DrawLine[] }) => {
      setText(state.text);
      setLines(state.lines);
    };
    const onTextUpdated = (newText: string) => setText(newText);
    const onLineDrawn = (newLine: DrawLine) => addLine(newLine);
    const onCanvasCleared = () => clearCanvas();
    const onChatMessage = (msg: any) => addChatMessage(msg);

    // Voice chat events
    const onUserJoinedVoice = async (peerId: string) => {
      const peer = createPeer(peerId, activeSocket, true);
      peers.current[peerId] = peer;
    };
    const onWebrtcOffer = async ({ callerId, offer }: any) => {
      const peer = createPeer(callerId, activeSocket, false);
      peers.current[callerId] = peer;
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      activeSocket.emit('webrtc-answer', { targetId: callerId, answer });
    };
    const onWebrtcAnswer = async ({ callerId, answer }: any) => {
      const peer = peers.current[callerId];
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };
    const onWebrtcIceCandidate = ({ senderId, candidate }: any) => {
      const peer = peers.current[senderId];
      if (peer) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socketManager.registerListener('connect', onConnect);
    socketManager.registerListener('collab-state', onCollabState);
    socketManager.registerListener('text-updated', onTextUpdated);
    socketManager.registerListener('line-drawn', onLineDrawn);
    socketManager.registerListener('canvas-cleared', onCanvasCleared);
    socketManager.registerListener('chat-message', onChatMessage);
    socketManager.registerListener('user-joined-voice', onUserJoinedVoice);
    socketManager.registerListener('webrtc-offer', onWebrtcOffer);
    socketManager.registerListener('webrtc-answer', onWebrtcAnswer);
    socketManager.registerListener('webrtc-ice-candidate', onWebrtcIceCandidate);

    if (activeSocket.connected) {
      onConnect();
    }

    return () => {
      socketManager.removeListener('connect', onConnect);
      socketManager.removeListener('collab-state', onCollabState);
      socketManager.removeListener('text-updated', onTextUpdated);
      socketManager.removeListener('line-drawn', onLineDrawn);
      socketManager.removeListener('canvas-cleared', onCanvasCleared);
      socketManager.removeListener('chat-message', onChatMessage);
      socketManager.removeListener('user-joined-voice', onUserJoinedVoice);
      socketManager.removeListener('webrtc-offer', onWebrtcOffer);
      socketManager.removeListener('webrtc-answer', onWebrtcAnswer);
      socketManager.removeListener('webrtc-ice-candidate', onWebrtcIceCandidate);
    };
  }, [roomId, addChatMessage, addLine, clearCanvas, setLines, setText]);

  return {
    socket,
    startVoice,
    stopVoice
  };
}
