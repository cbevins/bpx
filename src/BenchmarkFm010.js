export const BenchmarkFm010In = {
  configs: {
    fuel: {
      primary: 'catalog',
      secondary: 'none',
      moisture: 'individual',
      waf: 'input',
      curedHerbFraction: 'estimated',
      chaparralTotalLoad: 'input',
    },
    slope: {
      steepness: 'ratio',
    },
    wind: {
      direction: 'sourceFromNorth',
      speed: 'atMidflame',
    },
  },
  site: {
    moisture: {
      dead: {
        tl1h: 0.05,
        tl10h: 0.07,
        tl100h: 0.09,
      },
      live: {
        herb: 0.5,
        stem: 1.5,
      },
    },
    slope: {
      direction: {
        aspect: 180,
      },
      steepness: {
        ratio: 0.25,
      },
    },
    wind: {
      direction: {
        sourceFromNorth: 270,
      },
      speed: {
        atMidflame: 880,  // 10 mph
      },
    },
  },
  surface: {
    fuel: {
      primary: {
        model: {
          key: '10',
        },
      },
    },
  },
};

export const BenchmarkFm010Out = {
  surface: {
    fuel: {
      primary: {
        bed: {
          depth: 1.0,
          area: 13.4665,
          bulkDensity: 0.552,
          ewsLimit: 5215.2258602062057,
          //headingFromUpslope: 87.573367385837855,
          // heatPreignition:
          heatSink: 412.34037227937284,
          packingRatio: 0.01725,
          packingRatioOptimum: 0.0073478593798598172,
          packingRatioRatio: 2.3476224990480286,
          hpua: 5794.6954002291168 * 0.21764611427384198, // about 1261.192937
          load: 0.552,
          phiS: 1.1144632487759358,
          phiW: 26.298112107312534,
//          phiEw: 26.321715915373524,
          propagatingFluxRatio: 0.048317062998571636,
          reactionIntensity: 5794.6954002291168,
          reactionVelocityExp: 0.35878365060452616,
          reactionVelocityOpt: 12.674359628667819,
          reactionVelocityMax: 15.133318877566580,
          flameResidenceTime: 0.21764611427384198,
          ros0: 0.67900860922904482,
          savr: 1764.3319812126388,
          savr15: 74108.915800396862,
          slopeK: 17.831411980414973,
          windB: 1.4308256324729873,
          windC: 0.0022260828565431375,
          windE: 0.37951243437053556,
          windK: 0.0016102128596515481,
          windI: 621.03590466691537,
          dead: {
            area: 9.154,
            awtg: 0.67976088812980362,
            efld: 0.15704963842638839,
            efwl: 0.0084637314972566650,
            efmc: 0.053892078848839550,
            heat: 8000,
            load: 0.46,
            // pprc:
            // qign:
            mext: 0.25,
            mineralDamping: 0.41739692790939131,
            mois: 0.051626884422110553,
            moistureDamping: 0.65206408989980214,
            rxi: 3612.4074071954024,
            rxiDry: 5539.9575948899355,
            savr: 1888.8602386934672,
            seff: 0.01,
            // swtg:
            // wnet: (1 - 0.0555) * 0.46,
            particle: {
              class1: {
                area: 8.625,
                awtg: 0.94221105527638194,
                dens: 32,
                efhn: 0.93332668007820196,
                heat: 8000,
                load: 0.138,
                mois: 0.05,
                savr: 2000,
                seff: 0.01,
                stot: 0.0555,
                swtg: 0.94221105527638194,
              },
              class2: {
                area: 0.313375,
                awtg: 0.034233668341708545,
                dens: 32,
                efhn: 0.28194167776446499,
                heat: 8000,
                load: 0.092,
                mois: 0.07,
                savr: 109,
                seff: 0.01,
                stot: 0.0555,
                swtg: 0.034233668341708545,
              },
              class3: {
                area: 0.215625,
                awtg: 0.023555276381909549,
                dens: 32,
                efhn: 0.010051835744633586,
                heat: 8000,
                load: 0.230,
                mois: 0.09,
                savr: 30,
                seff: 0.01,
                stot: 0.0555,
                swtg: 0.023555276381909549,
              },
              class4: { // cured herb
                area: 0,
                awtg: 0,
                dens: 32,
                heat: 8000,
                load: 0,
                mois: 0.05,
                savr: 1500,
                seff: 0.01,
                stot: 0.0555,
                swtg: 0.94221105527638194,
              },
            },
          }, // dead
          live: {
            area: 4.31250,
            awtg: 0.32023911187019644,
            efld: 0.065920880572788609,
            // efwl:
            // efmc:
            load: 0.092,
            // pprc:
            // qign:
            moistureDamping: 0.59341294014849078,
            mois: 1.5,
            rxi: 2182.2879930337140,
            mineralDamping: 0.41739692790939131,
            heat: 8000,
            mext: 5.1935979022741359,
            mxtk: 6.9089482342948010,
            rxiDry: 3677.5200629895871,
            savr: 1500,
            seff: 0.01,
            wnet: (1 - 0.0555) * 0.092,
            particle: {
              class1: { // live herb
                area: 0,
                awtg: 0,
                dens: 32,
                efhn: 0.91210514954509037,
                heat: 8000,
                load: 0,
                mois: 0.5,
                savr: 1500,
                seff: 0.01,
                stot: 0.0555,
                swtg: 1,
              },
              class2: { // live stem
                area: 4.3125,
                awtg: 1,
                dens: 32,
                efhn: 0.91210514954509037,
                heat: 8000,
                load: 0.092,
                mois: 1.5,
                savr: 1500,
                seff: 0.01,
                stot: 0.0555,
                swtg: 1,
              },
            },
          }, // live
        },
        model: {
          key: '10',
          domain: 'behave',
          behave: {
            parms: {
              curedHerbFraction: 0.778,
              depth: 1.0,
              // deadMext:
              // dead1Load:
              // dead10Load:
              // dead100Load:
              // liveStemLoad:
              // totalHerbLoad:
              // dead1Savr:
              // liveHerbSavr:
              // liveStemSavr:
              deadHeat: 8000,
              liveHeat: 8000,
            },
          },
        },
      },
    },
  },
};
