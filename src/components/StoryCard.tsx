import React, { useEffect, useState } from 'react';

interface StoryCardProps {
    storyText: string;
    onStoryNextClick: () => void
}

const StoryCard: React.FC<StoryCardProps> = ({ storyText, onStoryNextClick }) => {
    const [currentText, setCurrentText] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentText.length < storyText.length) {
                setCurrentText((prevText) => prevText + storyText[currentText.length]);
            } else {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [currentText, storyText]);

    return (
        <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="max-w-lg p-8 text-center bg-black bg-opacity-50 rounded-md">
                {/* <h2 className="text-3xl font-semibold mb-4">Story</h2> */}
                <p className="text-xl font-pacifico leading-relaxed tracking-wide">{currentText}</p>
            </div>

            {currentText.length === storyText.length && (
                <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 transition-transform hover:scale-110"
                    onClick={onStoryNextClick}
                >
                    <div className="bg-blue-500 rounded-full p-2 opacity-80">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-16 h-16 text-white"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </button>
            )}
        </div>
    );
};

export default StoryCard;
