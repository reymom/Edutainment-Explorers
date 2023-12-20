'use client'

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from "clsx";

const ImageUpload: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams()!
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const imageFilenames = Array.from({ length: 9 }, (_, index) => `story_${index + 1}.jpg`);
    const imagesInRows = chunkArray(imageFilenames, 3);

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        params.set(name, value)

        return params.toString()
    },
        [searchParams]
    )

    const navigateToStoryCreation = (filename: string) => {
        router.push(
            `/story?${createQueryString('fileName', filename)}`,
        );

    };

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <h1 className="text-3xl font-semibold text-center mb-6">Choose a Picture</h1>

            {/* Kanban of Images */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Image Cards */}
                {imagesInRows.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {row.map((filename, index) => (
                            <div
                                key={index}
                                className={clsx(
                                    "flex-shrink-0 w-32 h-32 bg-gray-300 rounded-md relative overflow-hidden",
                                    "cursor-pointer transition-transform transform hover:scale-105"
                                )}
                                onClick={() => {
                                    navigateToStoryCreation(filename);
                                }}
                            >
                                <Image src={`/images/${filename}`} alt={`Image ${rowIndex * 3 + index + 1}`} fill style={{ objectFit: "cover" }} sizes='200px' priority={false} />
                            </div>
                        ))}
                    </React.Fragment>
                ))}

                {/* See More Images */}
                {/* <div className="flex-shrink-0 w-1/3 h-32 bg-blue-500 rounded-md flex items-center justify-center text-white cursor-pointer">
                    See More Images
                </div> */}
            </div>

            {/* Upload Button */}
            <div className="text-center">
                <button className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600">
                    Upload My Own Image
                </button>
            </div>
        </div>
    );
};

// Helper function to chunk an array into arrays of a specific size
function chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
        array.slice(index * size, (index + 1) * size)
    );
}

export default ImageUpload;
