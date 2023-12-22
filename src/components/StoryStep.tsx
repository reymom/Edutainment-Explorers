'use client'

import React, { useState, useEffect } from 'react';
import { default as NextjsImage } from 'next/image';
import getMetadata from 'next/image'
import StoryCard from '@/components/StoryCard'
import QuestionnaireCard from '@/components/QuestionnaireCard';
import clsx from 'clsx';
import { encode } from 'base64-arraybuffer';

interface StoryStepProps {
    selectedImage: string;
}

interface QuestionnaireConfig {
    question: string;
    options: { option: string; color: string }[];
}

const answerOptionColors = {
    Funny: 'bg-blue-500',
    Adventure: 'bg-green-500',
    Mistery: 'bg-purple-500',
    'Science Fiction': 'bg-red-500',
};

enum StoryStepType {
    Questionnaire = 'Questionnaire',
    Story = 'Story',
}

const StoryStep: React.FC<StoryStepProps> = ({ selectedImage }) => {
    const [firstScreen, setFirstScreen] = useState(false);
    const [loading, setLoading] = useState(false);
    // Initial state is the questionnary to begin the story
    const [step, setStep] = useState<StoryStepType>(StoryStepType.Questionnaire);
    // Initial state will be used at the begining of the story, 
    // then create questionnaries from gemini
    const [questionnaire, setQuestionnaire] = useState<QuestionnaireConfig>({
        question: 'What story do you want to create?',
        options: [
            { option: 'Funny', color: answerOptionColors.Funny },
            { option: 'Adventure', color: answerOptionColors.Adventure },
            { option: 'Mistery', color: answerOptionColors.Mistery },
            { option: 'Science Fiction', color: answerOptionColors['Science Fiction'] },
        ],
    });
    const [storyText, setStoryText] = useState<string>('');
    const [imageMetadata, setImageMetadata] = useState<{ width: number; height: number; base64: string | null }>({
        width: 0,
        height: 0,
        base64: null,
    });

    useEffect(() => {
        convertImageToBase64();
    }, []);

    const convertImageToBase64 = () => {
        // Get the image element
        const imageElement = document.querySelector('.imageRendered') as HTMLImageElement;

        if (imageElement) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match the image
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;

            if (context) {
                // Draw the image onto the canvas
                context.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

                // Convert the canvas content to base64
                const base64 = canvas.toDataURL('image/jpeg');

                setImageMetadata({
                    width: imageElement.width,
                    height: imageElement.height,
                    base64,
                });
            } else {
                console.error('Unable to get 2D rendering context for canvas.');
            }
        }
    };

    const handleQuestionnaireOptionClick = async (selectedAnswer: string) => {
        const api_url = 'http://localhost:5000/generate_story';
        const { width, height, base64 } = imageMetadata;
        let prompt = ''
        if (firstScreen) {
            prompt = `Given the image, write a 100-word short introduction of a story for small kids with the theme ${selectedAnswer}. Important: Be short, do not exceed 100 words.`
        } else {
            prompt = `Write two short paragraphs as a continuation of the story ${storyText}, taking into account the answer: ${selectedAnswer} for the question: ${questionnaire.question}. Important: Be short, do not exceed 100 words.`
        }
        if (base64) {
            setLoading(true);

            const payload = {
                prompt: prompt,
                images: [base64],
                width: width,
                height: height,
                format: 'JPEG',
            };

            try {
                const response = await fetch(api_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                console.log("data = ", data);
                setStoryText(data.story_text)
            } catch (error) {
                console.error('Error calling API:', error);
            }

            setLoading(false);
            setFirstScreen(false);
            setStep(StoryStepType.Story);
        }
    }

    const handleStoryNextClick = async () => {
        console.log("handleStoryNextClick")
        const api_url = 'http://localhost:5000/generate_questionnaire';
        setLoading(true);
        try {
            const response = await fetch(api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    story_text: storyText,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("data = ", data)
                setQuestionnaire(data.questionnaire);
                setStep(StoryStepType.Questionnaire);
            } else {
                // Handle error
                console.error('Error generating questionnaire:', response.statusText);
            }
        } catch (error) {
            console.error('Error generating questionnaire:', error);
        }

        setLoading(false);
        setStep(StoryStepType.Questionnaire);
    }

    return (
        <div className="flex items-center justify-center h-screen relative overflow-hidden">
            {selectedImage && (
                <div className={clsx(
                    "rounded-md overflow-hidden",
                    { "opacity-60": step === StoryStepType.Questionnaire },
                    { "opacity-90": step === StoryStepType.Story },
                )} style={{ margin: '20px', borderRadius: '10px', overflow: 'hidden' }}
                >
                    <NextjsImage
                        className='imageRendered'
                        src={`/images/${selectedImage}`}
                        alt="Selected Image"
                        fill style={{ objectFit: "cover" }}
                        sizes='200px'
                        priority={false}
                    />

                </div>
            )}

            <div
                className="flex flex-col items-center justify-center absolute inset-0 text-white"
                style={{ zIndex: 1 }}
            >
                {loading && (
                    <div className="flex flex-col items-center justify-center h-16">
                        <h2 className="text-2xl font-semibold mb-4">Crafting...</h2>

                        <div className="w-14 h-14 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                )}
                {!loading && step === StoryStepType.Questionnaire && (
                    <QuestionnaireCard
                        question={questionnaire.question}
                        options={questionnaire.options}
                        onOptionClick={handleQuestionnaireOptionClick}
                    />
                )}

                {/* Add more steps as needed with additional QuestionnaireCard components */}
                {!loading && step === StoryStepType.Story && (
                    <StoryCard
                        storyText={storyText}
                        onStoryNextClick={handleStoryNextClick}
                    />
                )}
            </div>
        </div >
    );
};

export default StoryStep; 
