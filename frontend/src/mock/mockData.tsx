import ListSite from '../types/ListSite.types';
import QuizSite from '../types/QuizSite.types';

export const mockListSites: ListSite[] = [{
    name: 'Comic Book Resources_MOCK',
    link: 'https://www.cbr.com/category/lists/',
    image: 'cbr-logo.svg',
    imageAlt: 'CBR logo',
    lowQuality: false
}, {
    name: 'Collider_MOCK',
    link: 'https://collider.com/tag/lists/',
    image: 'collider-logo.svg',
    imageAlt: 'Collider logo',
    lowQuality: false
}, {
    name: 'Comic Book_MOCK',
    link: 'https://comicbook.com/tag/list-feature/',
    image: 'comicbook-logo.svg',
    imageAlt: 'Comic Book logo',
    lowQuality: false
}, {
    name: 'Movie Web_MOCK',
    link: 'https://movieweb.com/lists/',
    image: 'movieweb-logo.svg',
    imageAlt: 'Movie Web logo',
    lowQuality: true
}, {
    name: 'Screen Rant_MOCK',
    link: 'https://screenrant.com/lists/',
    image: 'screenrant-logo.svg',
    imageAlt: 'Screen Rant logo',
    lowQuality: false
}, {
    name: 'The Gamer_MOCK',
    link: 'https://www.thegamer.com/category/lists/',
    image: 'thegamer-logo.svg',
    imageAlt: 'The Gamer logo',
    lowQuality: true
}, {
    name: 'Dual Shockers_MOCK',
    link: 'https://www.dualshockers.com/lists/',
    image: 'dualshockers-logo.svg',
    imageAlt: 'Dual Shockers logo',
    lowQuality: false
}];

export const mockQuizSites: QuizSite[] = [{
    name: 'Aniguessr_MOCK',
    link: 'https://aniguessr.com/',
    image: 'aniguessr-logo.png',
    imageAlt: 'Aniguessr Logo',
    lowQuality: false,
    quizStat: {
        score: 10101
    }
}, {
    name: 'Gamdle_MOCK',
    link: 'https://www.gamedle.wtf/',
    image: 'gamedle-logo.png',
    imageAlt: 'Gamedle Logo',
    lowQuality: false,
    quizStat: {
        score: 1
    }
}];
