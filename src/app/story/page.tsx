'use client'

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import StoryStep from '@/components/StoryStep';

const StoryStepPage: React.FC = () => {
    const searchParams = useSearchParams()
    const selectedImage = searchParams.get('fileName')

    return (
        <div>
            <StoryStep selectedImage={selectedImage!} />
        </div>
    );
};

export default StoryStepPage;
