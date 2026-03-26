const icons = require('simple-icons');

const searchTerms = [
    'blender',
    'photoshop',
    'premiere',
    'substance',
    'unreal',
    'unity',
    'marmoset'
];

const matches = Object.keys(icons).filter(key =>
    searchTerms.some(term => key.toLowerCase().includes(term))
);

matches.forEach(key => {
    const icon = icons[key];
    console.log(JSON.stringify({
        name: icon.title,
        slug: icon.slug,
        path: icon.path,
        hex: icon.hex
    }));
});
