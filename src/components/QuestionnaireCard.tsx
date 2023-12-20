import React from 'react';
import clsx from 'clsx';

interface QuestionnaireCardProps {
    question: string;
    options: { option: string; color: string }[];
    onOptionClick: (option: string) => void;
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ question, options, onOptionClick }) => (
    <div className="absolute p-8 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{question}</h2>

        <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => (
                <button
                    key={index}
                    className={clsx(
                        "block w-full mb-1 p-2 text-white bg-blue-500 rounded-md",
                        option.color
                    )}
                    onClick={() => onOptionClick(option.option)}>
                    {option.option}
                </button>
            ))}
        </div>
    </div>
);

export default QuestionnaireCard;
