const f = 2000 / 43560;
const models = [
    [1, "1",
            "Short grass",
            1.0, 0.12, 8000., 8000.,
            0.034, 0.000, 0.000, 0.000, 0.000,
            3500., 1500., 1500., "S"],


    [2, "2",
            //"Timber with grass and understory [2]",
            "Timber grass and understory",      // Pat's new name
            1.0, 0.15, 8000., 8000.,
            0.092, 0.046, 0.023, 0.023, 0.000,
            3000., 1500., 1500., "S"],


    [3, "3",
            "Tall grass",
            2.5, 0.25, 8000., 8000.,
            0.138, 0.000, 0.000, 0.000, 0.000,
            1500., 1500., 1500., "S"],


    [4, "4",
            "Chaparral",
            6.0, 0.20, 8000., 8000.,
            0.230, 0.184, 0.092, 0.000, 0.230,
            2000., 1500., 1500., "S"],


    [5, "5",
            "Brush",
            2.0, 0.20, 8000., 8000.,
            0.046, 0.023, 0.000, 0.000, 0.092,
            2000., 1500., 1500., "S"],


    [6, "6",
            "Dormant brush, hardwood slash",
            2.5, 0.25, 8000., 8000.,
            0.069, 0.115, 0.092, 0.000, 0.000,
            1750., 1500., 1500., "S"],


    [7, "7",
            "Southern rough",
            2.5, 0.40, 8000., 8000.,
            0.052, 0.086, 0.069, 0.000, 0.017,
            1750., 1500., 1500., "S"],


    [8, "8",
            //"Closed timber litter [8]",
            "Short needle litter",      // Pat's new name
            0.2, 0.30, 8000., 8000.,
            0.069, 0.046, 0.115, 0.000, 0.000,
            2000., 1500., 1500., "S"],


    [9, "9",
            //"Hardwood litter [9]",
            "Long needle or hardwood litter",   // Pat's new name
            0.2, 0.25, 8000., 8000.,
            0.134, 0.019, 0.007, 0.000, 0.000,
            2500., 1500., 1500., "S"],


    [10, "10",
            //"Timber with litter & understory [10]",
            "Timber litter & understory",  // Pat's new name
            1.0, 0.25, 8000., 8000.,
            0.138, 0.092, 0.230, 0.000, 0.092,
            2000., 1500., 1500., "S"],


    [11, "11",
            "Light logging slash",
            1.0, 0.15, 8000., 8000.,
            0.069, 0.207, 0.253, 0.000, 0.000,
            1500., 1500., 1500., "S"],


    [12, "12",
            "Medium logging slash",
            2.3, 0.20, 8000., 8000.,
            0.184, 0.644, 0.759, 0.000, 0.000,
            1500., 1500., 1500., "S"],


    [13, "13",
            "Heavy logging slash",
            3.0, 0.25, 8000., 8000.,
            0.322, 1.058, 1.288, 0.000, 0.000,
            1500., 1500., 1500., "S"],


    // New dynamic models
    // Non-burnable
    // [91, "nb1",
    //         "Water [91]",
    //         1.0, 0.10, 8000., 8000.,
    //         0.000, 0.000, 0.000, 0.000, 0.000,
    //         1500., 1500., 1500., "S"],


    // [92, "nb2",
    //         "Urban, Developed [92]",
    //         1.0, 0.10, 8000., 8000.,
    //         0.000, 0.000, 0.000, 0.000, 0.000,
    //         1500., 1500., 1500., "S"],


    // [93, "nb3",
    //         "Bare Ground [93]",
    //         1.0, 0.10, 8000., 8000.,
    //         0.000, 0.000, 0.000, 0.000, 0.000,
    //         1500., 1500., 1500., "S"],


    // [94, "nb4",
    //         "Agricultural [94]",
    //         1.0, 0.10, 8000., 8000.,
    //         0.000, 0.000, 0.000, 0.000, 0.000,
    //         1500., 1500., 1500., "S"],


    // [95, "nb5",
    //         "Snow, ice [95]",
    //         1.0, 0.10, 8000., 8000.,
    //         0.000, 0.000, 0.000, 0.000, 0.000,
    //         1500., 1500., 1500., "S"],

    // Grass
    [101, "gr1",
            "Short, sparse, dry climate grass (D)",
            0.4, 0.15, 8000., 8000.,
            0.1*f, 0.000, 0.000, 0.3*f, 0.000,
            2200., 2000., 1500., "D"],


    [102, "gr2",
            "Low load, dry climate grass (D)",
            1.0, 0.15, 8000., 8000.,
            0.1*f, 0.000, 0.000, 1.0*f, 0.000,
            2000., 1800., 1500., "D"],


    [103, "gr3",
            "Low load, very coarse, humid climate grass (D)",
            2.0, 0.30, 8000., 8000.,
            0.1*f, 0.4*f, 0.000, 1.5*f, 0.000,
            1500., 1300., 1500., "D"],


    [104, "gr4",
            "Moderate load, dry climate grass (D)",
            2.0, 0.15, 8000., 8000.,
            0.25*f, 0.000, 0.000, 1.9*f, 0.000,
            2000., 1800., 1500., "D"],


    [105, "gr5",
            "Low load, humid climate grass (D)",
            1.5, 0.40, 8000., 8000.,
            0.4*f, 0.000, 0.000, 2.5*f, 0.000,
            1800., 1600., 1500., "D"],


    [106, "gr6",
            "Moderate load, humid climate grass (D)",
            1.5, 0.40, 9000., 9000.,
            0.1*f, 0.000, 0.000, 3.4*f, 0.000,
            2200., 2000., 1500., "D"],


    [107, "gr7",
            "High load, dry climate grass (D)",
            3.0, 0.15, 8000., 8000.,
            1.0*f, 0.000, 0.000, 5.4*f, 0.000,
            2000., 1800., 1500., "D"],


    [108, "gr8",
            "High load, very coarse, humid climate grass (D)",
            4.0, 0.30, 8000., 8000.,
            0.5*f, 0.04591390, 0.000, 7.3*f, 0.000,
            1500., 1300., 1500., "D"],


    [109, "gr9",
            "Very high load, humid climate grass (D)",
            5.0, 0.40, 8000., 8000.,
            1.0*f, 1.0*f, 0.000, 9.0*f, 0.000,
            1800., 1600., 1500., "D"],


    // Grass and shrub
    [121, "gs1",
            "Low load, dry climate grass-shrub (D)",
            0.9, 0.15, 8000., 8000.,
            0.2*f, 0.000, 0.000, 0.5*f, 0.02984403,
            2000., 1800., 1800., "D"],


    [122, "gs2",
            "Moderate load, dry climate grass-shrub (D)",
            1.5, 0.15, 8000., 8000.,
            0.5*f, 0.5*f, 0.000, 0.6*f, 1.0*f,
            2000., 1800., 1800., "D"],


    [123, "gs3",
            "Moderate load, humid climate grass-shrub (D)",
            1.8, 0.40, 8000., 8000.,
            0.3*f, 0.25*f, 0.000, 1.45*f, 1.25*f,
            1800., 1600., 1600., "D"],


    [124, "gs4",
            "High load, humid climate grass-shrub (D)",
            2.1, 0.40, 8000., 8000.,
            1.9*f, 0.3*f, 0.1*f, 3.4*f, 7.1*f,
            1800., 1600., 1600., "D"],


    // Shrub
    [141, "sh1",
            "Low load, dry climate shrub (D)",
            1.0, 0.15, 8000., 8000.,
            0.25*f, 0.25*f, 0.000, 0.15*f, 1.3*f,
            2000., 1800., 1600., "D"],


    [142, "sh2",
            "Moderate load, dry climate shrub (S)",
            1.0, 0.15, 8000., 8000.,
            1.35*f, 2.4*f, 0.75*f, 0.000, 3.85*f,
            2000., 1800., 1600., "S"],


    [143, "sh3",
            "Moderate load, humid climate shrub (S)",
            2.4, 0.40, 8000., 8000.,
            0.45*f, 3.0*f, 0.000, 0.000, 6.2*f,
            1600., 1800., 1400., "S"],


    [144, "sh4",
            "Low load, humid climate timber-shrub (S)",
            3.0, 0.30, 8000., 8000.,
            0.85*f, 1.15*f, 0.2*f, 0.000, 2.55*f,
            2000., 1800., 1600., "S"],


    [145, "sh5",
            "High load, dry climate shrub (S)",
            6.0, 0.15, 8000., 8000.,
            3.6*f, 2.1*f, 0.000, 0.000, 2.9*f,
             750., 1800., 1600., "S"],


    [146, "sh6",
            "Low load, humid climate shrub (S)",
            2.0, 0.30, 8000., 8000.,
            2.9*f, 1.45*f, 0.000, 0.000, 1.4*f,
             750., 1800., 1600., "S"],


    [147, "sh7",
            "Very high load, dry climate shrub (S)",
            6.0, 0.15, 8000., 8000.,
            3.5*f, 5.3*f, 2.2*f, 0.000, 3.4*f,
             750., 1800., 1600., "S"],


    [148, "sh8",
            "High load, humid climate shrub (S)",
            3.0, 0.40, 8000., 8000.,
            2.05*f, 3.4*f, 0.85*f, 0.000, 4.35*f,
             750., 1800., 1600., "S"],


    [149, "sh9",
            "Very high load, humid climate shrub (D)",
            4.4, 0.40, 8000., 8000.,
            4.5*f, 2.45*f, 0.000, 1.55*f, 7.0*f,
             750., 1800., 1500., "D"],


    // Timber and understory
    [161, "tu1",
            "Light load, dry climate timber-grass-shrub (D)",
            0.6, 0.20, 8000., 8000.,
            0.2*f, 0.9*f, 1.5*f, 0.2*f, 0.9*f,
            2000., 1800., 1600., "D"],


    [162, "tu2",
            "Moderate load, humid climate timber-shrub (S)",
            1.0, 0.30, 8000., 8000.,
            0.95*f, 1.8*f, 1.25*f, 0.000, 0.2*f,
            2000., 1800., 1600., "S"],


    [163, "tu3",
            "Moderate load, humid climate timber-grass-shrub (D)",
            1.3, 0.30, 8000., 8000.,
            1.1*f, 0.15*f, 0.25*f, 0.65*f, 1.1*f,
            1800., 1600., 1400., "D"],


    [164, "tu4",
            //"Dwarf conifer with understory (S)",
            "Dwarf conifer understory (S)", // Pat's new name
            0.5, 0.12, 8000., 8000.,
            4.5*f, 0.000, 0.000, 0.000, 2.0*f,
            2300., 1800., 2000., "S"],


    [165, "tu5",
            "Very high load, dry climate timber-shrub (S)",
            1.0, 0.25, 8000., 8000.,
            4.0*f, 4.0*f, 3.0*f, 0.000, 3.0*f,
            1500., 1800., 750., "S"],


    // Timber and litter
    [181, "tl1",
            "Low load, compact conifer litter (S)",
            0.2, 0.30, 8000., 8000.,
            1.0*f, 2.2*f, 3.6*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [182, "tl2",
            "Low load broadleaf litter (S)",
            0.2, 0.25, 8000., 8000.,
            1.4*f, 2.3*f, 2.2*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [183, "tl3",
            "Moderate load conifer litter (S)",
            0.3, 0.20, 8000., 8000.,
            0.5*f, 2.2*f, 2.8*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [184, "tl4",
            "Small downed logs (S)",
            0.4, 0.25, 8000., 8000.,
            0.5*f, 1.5*f, 4.2*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [185, "tl5",
            "High load conifer litter (S)",
            0.6, 0.25, 8000., 8000.,
            1.15*f, 2.5*f, 4.4*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [186, "tl6",
            "High load broadleaf litter (S)",
            0.3, 0.25, 8000., 8000.,
            2.4*f, 1.2*f, 1.2*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [187, "tl7",
            "Large downed logs (S)",
            0.4, 0.25, 8000., 8000.,
            0.3*f, 1.4*f, 8.1*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [188, "tl8",
            "Long-needle litter (S)",
            0.3, 0.35, 8000., 8000.,
            5.8*f, 1.4*f, 1.1*f, 0.000, 0.000,
            1800., 1800., 1600., "S"],


    [189, "tl9",
            "Very high load broadleaf litter (S)",
            0.6, 0.35, 8000., 8000.,
            6.65*f, 3.30*f, 4.15*f, 0.000, 0.000,
            1800., 1800., 1600., "S"],


    // Slash and blowdown
    [201, "sb1",
            "Low load activity fuel (S)",
            1.0, 0.25, 8000., 8000.,
            1.5*f, 3.0*f, 11.0*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [202, "sb2",
            "Moderate load activity or low load blowdown (S)",
            1.0, 0.25, 8000., 8000.,
            4.5*f, 4.25*f, 4.0*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [203, "sb3",
            "High load activity fuel or moderate load blowdown (S)",
            1.2, 0.25, 8000., 8000.,
            5.5*f, 2.75*f, 3.0*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],


    [204, "sb4",
            "High load blowdown (S)",
            2.7, 0.25, 8000., 8000.,
            5.25*f, 3.5*f, 5.25*f, 0.000, 0.000,
            2000., 1800., 1600., "S"],
];

function writeCatalog() {
  catalog = {};
  models.forEach((model) => {
    let [number, code, label, depth, deadMext, deadHeat, liveHeat,
      dead1Load, dead10Load, dead100Load, totalHerbLoad, liveStemLoad,
    dead1Savr, liveHerbSavr, liveStemSavr, dynamic] = model;
    let mod = {
      domain: 'behave',
      label,
      depth,
      deadMext,
      dead1Load,
      dead10Load,
      dead100Load,
      totalHerbLoad,
      liveStemLoad,
      dead1Savr,
      liveHerbSavr,
      liveStemSavr,
      deadHeat,
      liveHeat,
    };
    catalog[number] = mod;
    catalog[code] = mod;
  });
  console.log(catalog);
}

writeCatalog();
