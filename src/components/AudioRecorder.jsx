import React, { useState, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [blobURL, setBlobURL] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        navigator.getUserMedia(
            { audio: true },
            () => {
                console.log('Permission Granted');
                setIsBlocked(false);
            },
            () => {
                console.log('Permission Denied');
                setIsBlocked(true);
            }
        );
    }, []);

    const startRecording = () => {
        if (isBlocked) {
            console.log('Permission Denied');
        } else {
            Mp3Recorder.start()
                .then(() => {
                    setIsRecording(true);
                    // Stop recording after 30 seconds
                    setTimeout(stopRecording, 30000);
                })
                .catch((e) => console.error(e));
        }
    };

    const stopRecording = () => {
        Mp3Recorder.stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob);
                setBlobURL(blobURL);
                setIsRecording(false);
                convertToBase64(blob);
            })
            .catch((e) => console.log(e));
    };

    const convertToBase64 = (blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            console.log('Base64 Encoded Audio:', base64data);
        };
    };

    return (
        <div className="flex flex-col items-center">
            {!isRecording ? (
                <button onClick={startRecording} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Start Recording
                </button>
            ) : (
                <button onClick={stopRecording} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Stop Recording
                </button>
            )}
            {blobURL && (
                <audio src={blobURL} controls="controls" className="mt-4" />
            )}
        </div>
    );
};

export default AudioRecorder; 