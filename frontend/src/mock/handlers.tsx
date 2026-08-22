import { http, HttpResponse } from 'msw'
import env from '../lib/EnvReader';

const apiBase = env.get('API_BASE'); 

export const handlers = [
    http.get(`${apiBase}/list/site`, () => {
        return HttpResponse.json([{
            name: 'Comic Book Resources_MSW',
            link: 'https://www.cbr.com/category/lists/',
            image: 'cbr-logo.svg',
            imageAlt: 'CBR logo',
            lowQuality: false
        }, {
            name: 'Collider_MSW',
            link: 'https://collider.com/tag/lists/',
            image: 'collider-logo.svg',
            imageAlt: 'Collider logo',
            lowQuality: false
        }, {
            name: 'Comic Book_MSW',
            link: 'https://comicbook.com/tag/list-feature/',
            image: 'comicbook-logo.svg',
            imageAlt: 'Comic Book logo',
            lowQuality: false
        }, {
            name: 'Movie Web_MSW',
            link: 'https://movieweb.com/lists/',
            image: 'movieweb-logo.svg',
            imageAlt: 'Movie Web logo',
            lowQuality: true
        }, {
            name: 'Screen Rant_MSW',
            link: 'https://screenrant.com/lists/',
            image: 'screenrant-logo.svg',
            imageAlt: 'Screen Rant logo',
            lowQuality: false
        }, {
            name: 'The Gamer_MSW',
            link: 'https://www.thegamer.com/category/lists/',
            image: 'thegamer-logo.svg',
            imageAlt: 'The Gamer logo',
            lowQuality: true
        }, {
            name: 'Dual Shockers_MSW',
            link: 'https://www.dualshockers.com/lists/',
            image: 'dualshockers-logo.svg',
            imageAlt: 'Dual Shockers logo',
            lowQuality: false
        }])
    }),
    http.get(`${apiBase}/list/quiz`, () => {
        return HttpResponse.json([{
            name: 'Aniguessr_MSW',
            link: 'https://aniguessr.com/',
            image: 'aniguessr-logo.png',
            imageAlt: 'Aniguessr Logo',
            lowQuality: false
        }, {
            name: 'Gamdle_MSW',
            link: 'https://www.gamedle.wtf/',
            image: 'gamedle-logo.png',
            imageAlt: 'Gamedle Logo',
            lowQuality: false
        }])
    }),
]