import landing from './landing.json';
import about from './about.json';
import legal from './legal.json';
import gif from './gif.json';
import video from './video.json';
import prompt from './prompt.json';
import retro from './retro.json';
import image from './image.json';

export const en = {
    landing,
    about,
    ...legal,
    ...gif,
    ...video,
    ...prompt,
    ...retro,
    ...image
};
