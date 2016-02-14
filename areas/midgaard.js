module.exports = {
    v001: {
        vnum: 'v001',
        name: "Market Square",
        long: `You are standing on the market square, the famous Square of Midgaard.<br />
               A large, peculiar looking statue is standing in the middle of the square.<br />
               Roads lead in every direction, north to the temple square, south to the<br />
               common square, east and westbound is the main street.<br />`,
        exits: { n:'v002',e:null,s:null,w:null},
        players: []
    },
    
    v002: {
        vnum: 'v002',
        name: "Temple Square",
        long: `You are standing on the temple square.  Huge marble steps lead up to the<br />
               temple gate.  The entrance to the Clerics Guild is to the west, and the old<br />
               Grunting Boar Inn, is to the east.  Just south of here you see the market<br />
               square, the center of Midgaard.<br />`,
        exits: { n:null,e:null,s:'v001',w:null},
        players: []
    }
    
}