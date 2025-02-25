import React, { useState, useEffect, useRef } from 'react';
import { Client } from "@gradio/client"; // Import Gradio Client
import { Mic, StopCircle, Loader } from 'lucide-react';



const AudioRecorder = ({ onTextRecognized }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
                    setIsLoading(true);
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                    await sendAudioToGradio(audioBlob);
                    setIsLoading(false);
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
        try {
            const client = await Client.connect("Rio0913/openai-whisper-large-v3-turbo");
            const result = await client.predict("/predict", {
                param_0: audioBlob,
            });

            const data = result.data[0];
            console.log("Raw response data:", data);

            // More flexible regex pattern that handles:
            // - Both single and double quotes
            // - Multiple spaces before/after quotes
            // - Optional spaces after 'text='
            const regex = /text\s*=\s*['"]([^'"]+)['"]/;
            const match = data.match(regex);

            if (match && match[1]) {
                const extractedText = match[1].trim();
                console.log("Extracted text:", extractedText);
                onTextRecognized(extractedText);
            } else {
                // Fallback method if regex fails
                const textStart = data.indexOf('text=');
                if (textStart !== -1) {
                    let extractedText = data.slice(textStart + 5); // Skip 'text='
                    // Remove leading/trailing quotes and spaces
                    extractedText = extractedText.replace(/^[\s'"]+|[\s'"]+$/g, '');
                    // Remove anything after the first comma if it exists
                    extractedText = extractedText.split(',')[0].trim();

                    if (extractedText) {
                        console.log("Extracted text (fallback):", extractedText);
                        onTextRecognized(extractedText);
                    }
                }
            }
        } catch (error) {
            console.error("Error in speech recognition:", error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {!isRecording ? (
                <span onClick={startRecording} className="w-5 h-5 text-gray-800 cursor-pointer">
                    <Mic />
                </span>
            ) : (
                <span onClick={stopRecording} className="w-5 h-5 text-red-600 cursor-pointer">
                    <StopCircle />
                </span>
            )}
            {isLoading && <Loader className="w-5 h-5 animate-spin mt-2 text-blue-600" />}
        </div>
    );
};

export default AudioRecorder;