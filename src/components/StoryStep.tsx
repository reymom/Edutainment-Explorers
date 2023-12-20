'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import StoryCard from '@/components/StoryCard'
import QuestionnaireCard from '@/components/QuestionnaireCard';
import clsx from 'clsx';

interface StoryStepProps {
    selectedImage: string;
}

interface QuestionnaireConfig {
    question: string;
    answerOptions: { option: string; color: string }[];
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
    // Initial state is the questionnary to begin the story
    const [step, setStep] = useState<StoryStepType>(StoryStepType.Questionnaire);
    // Initial state will be used at the begining of the story, 
    // then create questionnaries from gemini
    const [questionnaire, setQuestionnaire] = useState<QuestionnaireConfig>({
        question: 'What story do you want to create?',
        answerOptions: [
            { option: 'Funny', color: answerOptionColors.Funny },
            { option: 'Adventure', color: answerOptionColors.Adventure },
            { option: 'Mistery', color: answerOptionColors.Mistery },
            { option: 'Science Fiction', color: answerOptionColors['Science Fiction'] },
        ],
    });
    const [storyText, setStoryText] = useState<string>('');

    const handleQuestionnaireOptionClick = (selectedAnswer: string) => {
        // Fetch the story text from the external API using imageUrl as a parameter
        // fetch(`YOUR_API_ENDPOINT?imageUrl=${selectedImage}`)
        //     .then((response) => response.json())
        //     .then((data) => {
        //         setStoryText(data.storyText);
        //         setStep(StoryStepType.Story);
        //     })
        //     .catch((error) => console.error('Error fetching story text:', error));

        setStoryText(
            "Once upon a time, in a magical forest, there was a wise old tree named Oakington. " +
            "One day, Oakington overheard a group of animals having a hilarious conversation. " +
            "The squirrel was telling jokes, and even the serious owl couldn't help but laugh. " +
            "The rabbit chimed in with a witty comment, making everyone burst into laughter."
        );
        setStep(StoryStepType.Story);
    };

    const handleStoryNextClick = async () => {
        // Perform API call to generate questionnaire using story text and selectedImage
        try {
            const response = await fetch('QUESTIONNAIRE_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storyText: storyText, // Combine storyText into a single string
                    selectedImage,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setQuestionnaire(data.questionnaire);
                setStep(StoryStepType.Questionnaire);
            } else {
                // Handle error
                console.error('Error generating questionnaire:', response.statusText);
            }
        } catch (error) {
            console.error('Error generating questionnaire:', error);
        }
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
                    <Image
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
                {step === StoryStepType.Questionnaire && (
                    <QuestionnaireCard
                        question={questionnaire.question}
                        options={questionnaire.answerOptions}
                        onOptionClick={handleQuestionnaireOptionClick}
                    />
                )}

                {/* Add more steps as needed with additional QuestionnaireCard components */}
                {step === StoryStepType.Story && (
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
