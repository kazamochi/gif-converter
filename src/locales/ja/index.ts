import landing from './landing.json';
import about from './about.json';
import legal from './legal.json';
import gif from './gif.json';
import video from './video.json';
import prompt from './prompt.json';
import retro from './retro.json';
import image from './image.json';
import warp from './warp.json';

import social from './social.json';
import product from './product.json';
import contact from './contact.json';
import tools from './tools.json';
import common from './common.json';

export const ja = {
    landing,
    about,
    social,
    product,
    contact,
    common,
    ...legal,
    ...gif,
    ...video,
    ...prompt,
    ...retro,
    ...image,
    ...warp,
    ...tools
};
