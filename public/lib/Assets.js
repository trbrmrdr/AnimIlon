



// const name_anim = 'Ilon'
// const name_anim = 'Ilon_cut_1'
const name_anim = 'Ilon_optimization'
const ver = 'ver_04'
const ASSETS = {
    black_back: '/data/10px_back.jpg',
    star: '/data/star.png',

    anim_ske: `/data/${ver}/${name_anim}_ske.json`,
    /* 
    atlas_json: `/data/${name_anim}_tex.json`,
    atlas_png: `/data/${name_anim}_tex.png` 
    */

    atlas_json: Array.from({ length: 2 }, (_, i) => `/data/${ver}/${name_anim}_tex_${i}.json`),
    atlas_png: Array.from({ length: 2 }, (_, i) => `/data/${ver}/${name_anim}_tex_${i}.png`),
}


