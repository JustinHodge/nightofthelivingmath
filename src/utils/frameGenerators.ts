import { ATLAS_KEY } from '../constants';
import { IAnimationFrameData } from '../vite-env';

export const generateFrameObjects = (
    { prefix, digitsInFrame, frameSet }: IAnimationFrameData,
    atlasKey: string = ATLAS_KEY
) => {
    return frameSet.map((frameNumber) => {
        return {
            key: atlasKey,
            frame: `${prefix}${frameNumber
                .toString()
                .padStart(digitsInFrame, '0')}`,
        };
    });
};

export const generateFrameKeys = ({
    prefix,
    digitsInFrame,
    frameSet,
}: IAnimationFrameData) => {
    return frameSet.map((frameNumber) => {
        return `${prefix}${frameNumber
            .toString()
            .padStart(digitsInFrame, '0')}`;
    });
};
