import React, { useState, useEffect, useRef } from 'react';
import { Client } from "@gradio/client"; // Import Gradio Client
import {  Mic, StopCircle } from 'lucide-react';


const AudioRecorder = ({ onTextRecognized }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [blobURL, setBlobURL] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const audioChunks = useRef([]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                recorder.ondataavailable = (event) => {
                    audioChunks.current.push(event.data);
                };

                recorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                    const url = URL.createObjectURL(audioBlob);
                    setBlobURL(url);
                    await sendAudioToGradio(audioBlob); // Send audio blob to Gradio
                };
            })
            .catch((error) => {
                console.error("Error accessing microphone:", error);
            });
    }, []);

    const startRecording = () => {
        if (mediaRecorder) {
            audioChunks.current = [];
            mediaRecorder.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToGradio = async (audioBlob) => {
        const client = await Client.connect("Rio0913/openai-whisper-large-v3-turbo");
        const result = await client.predict("/predict", { 
            param_0: audioBlob, 
        });

        // Extract the text from the response
        const data = result.data[0]; // Get the raw string
        console.log(data);
        
        const match = data.match(/text='([^']+)'/); // Split by single quote and get the second element
        if (match && match[1]) {
            onTextRecognized(match[1]); // Call the callback with the recognized text
        }
    };

    return (

        <div className={`"flex flex-col items-center" `}>
            {!isRecording ? (
                <span onClick={startRecording} className="w-5 h-5 text-gray-800">
                    <Mic/>
                </span>
            ) : (
                <span onClick={stopRecording} className="w-5 h-5 text-red-600">
                    <StopCircle/>
                </span>
            )}
        </div>
    );
};

export default AudioRecorder;
