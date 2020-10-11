const PIPO = "pipo";

const mapConfig = [
  {
    gameMap: {
      levelName: "Greenlands",
      imgKey: "greenlands-tiles",
      imgFile: "./src/assets/maps/map_images/BaseChip_pipo.png",
      mapKey: "greenlands-map",
      mapFile: "./src/assets/maps/map_json/greenlands_1.json",
      tilesetKey: PIPO,
      playerStartX: 10,
      playerStartY: 14,
      playerDepth: 1,
    },
  },
  {
    gameMap: {
      levelName: "TestMap",
      imgKey: "testmap-tiles",
      imgFile: "./src/assets/maps/map_images/BaseChip_pipo.png",
      mapKey: "testmap-map",
      mapFile: "./src/assets/maps/map_json/gamejson.json",
      tilesetKey: PIPO,
      playerStartX: 8,
      playerStartY: 8,
      playerDepth: 2,
    },
  },
];

export default mapConfig;
