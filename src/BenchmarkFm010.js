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
    map: {
      scale: 24000,
    },
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
    temp: {
      air: 95,
    },
    time: {
      fire: {
        sinceIgnition: 60,
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
          area: 13.4665,
          bulkDensity: 0.552,
          depth: 1.0,
          domain: 'behave',
          heatPreignition: null,
          heatSink: 412.34037227937284,
          load: 0.552,
          openWaf: 0.36210426360602416,
          packingRatio: 0.01725,
          packingRatioOptimum: 0.0073478593798598172,
          packingRatioRatio: 2.3476224990480286,
          propagatingFluxRatio: 0.048317062998571636,
          reactionIntensity: 5794.6954002291168,
          reactionVelocityExp: 0.35878365060452616,
          reactionVelocityMax: 15.133318877566580,
          reactionVelocityOpt: 12.674359628667819,
          ros0: 0.67900860922904482,
          savr: 1764.3319812126388,
          savr15: 74108.915800396862,
          dead: {
            area: 9.154,
            awtg: 0.67976088812980362,
            efld: 0.15704963842638839,
            efwl: 0.0084637314972566650,
            efmc: 0.053892078848839550,
            heat: 8000,
            load: 0.46,
            mext: 0.25,
            mineralDamping: 0.41739692790939131,
            mois: 0.051626884422110553,
            moistureDamping: 0.65206408989980214,
            pprc: null,
            qign: null,
            rxi: 3612.4074071954024,
            rxiDry: 5539.9575948899355,
            savr: 1888.8602386934672,
            seff: 0.01,
            swtg: null,
            wnet: (1 - 0.0555) * 0.13859233668341708,
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
            efwl: null,
            efmc: null,
            heat: 8000,
            load: 0.092,
            mext: 5.1935979022741359,
            mineralDamping: 0.41739692790939131,
            moistureDamping: 0.59341294014849078,
            mois: 1.5,
            mxtk: 6.9089482342948010,
            pprc: null,
            qign: null,
            rxi: 2182.2879930337140,
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
              deadMext: null,
              dead1Load: null,
              dead10Load: null,
              dead100Load: null,
              liveStemLoad: null,
              totalHerbLoad: null,
              dead1Savr: null,
              liveHerbSavr: null,
              liveStemSavr: null,
              deadHeat: 8000,
              liveHeat: 8000,
            },
          },
        },
        fire: {
          direction: {
            slopeRos: 0.67900860922904482 * 1.1144632487759358,
            windRos: 0.67900860922904482 * 26.298112107312534,
            vectorRos: null,
            xComp: null,
            yComp: null,
          },
          limit: {
            ews: 5215.2258602062057,
            phi: null,
            ros: null,
          },
          slope: {
            k: 17.831411980414973,
            phi: 1.1144632487759358,
            ratio: 0.25,
          },
          wind: {
            atMidflame: 880,
            b: 1.4308256324729873,
            c: 0.0022260828565431375,
            e: 0.37951243437053556,
            headingFromUpslope: 90,
            k: 0.0016102128596515481,
            i: 621.03590466691537,
            phi: 26.298112107312534,
            waf: 1,
          },
          effectiveWindSpeed: 880.55194372010692,
          firelineIntensity: 389.954137,
          flameLength: 6.999689,
          flameResidenceTime: 0.21764611427384198,
          headingFromUpslope: 87.573367385837855,
          heatPerUnitArea: 5794.6954002291168 * 0.21764611427384198, // about 1261.192937
          lengthToWidthRatio: 3.501568,
          phiEw: 26.321715915373524,
          reactionIntensity: 5794.6954002291168,
          ros: 18.551680325448835,
          ros0: 0.67900860922904482,
        //   ellipse: {
        //     area: 289850.691417,
        //     length: 1136.772409,
        //     perimeter: 2476.240100,
        //     width: 324.646673,
        //     head:{
        //       distance: 1113.100820,
        //       scorchHt: 39.580182,
        //     },
        //     flank: {
        //       distance: 162.3233337,
        //     },
        //     back: {
        //       distance: 23.671589,
        //     },
        //   },
        },  // fire
      },  // primary
    },  // fuel
  },  // surface
};
