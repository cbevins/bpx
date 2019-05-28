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
  },  // configs
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
  },  // site
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
        },  // bed
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
        },  // model
        fire: {
          direction: {
            slopeRos: 0.75673014058823118, // 0.67900860922904482 * 1.1144632487759358,
            windRos: 17.856644527335789, // 0.67900860922904482 * 26.298112107312534,
            vectorRos: 17.872671716374864,
            xComp: 0.75673013692577218,
            yComp: 17.856644527335789,
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
          firelineIntensity: 389.95413667947145,
          flameLength: 6.9996889013229229,
          flameResidenceTime: 0.21764611427384198,
          headingFromUpslope: 87.573367385837855,
          heatPerUnitArea: 1261.1929372603729,
          lengthToWidthRatio: 3.5015680219321221,
          phiEw: 26.321715915373524,
          reactionIntensity: 5794.6954002291168,
          ros: 18.551680325448835,
          ros0: 0.67900860922904482,
        },  // fire
      },  // primary
    },  // fuel
    fire: {
      weighted: {},
      ellipse: {
        axis: {
          eccentricity: [0.95835298387126711, 11],
          lengthToWidthRatio: 3.5015680219321221,
          major: 0.39452649041938642 + 18.551680325448835,
          minor: 2 * 2.7053889424963877,
          f: 9.4731034079341114,
          g: 9.0785769175147255,
          h: 2.7053889424963877,
        },
        size: {
          area: [289850.691417, 7],
          length: [1136.7724089520932, 11],
          perimeter: [2476.2400999186934, 10],
          width: [324.64667309956644, 9],
        },
        map: {
          area: 289850.691417 / 24000 / 24000,
          length: 1136.7724089520932 / 24000,
          perimeter: 2476.2400999186934 / 24000,
          width: 324.64667309956644 / 24000,
        },
        head: {
          ros: 18.551680325448835,
          firelineIntensity: 389.95413667947145,
          flameLength: 6.9996889013229229,
          distance: 1113.1008195269301,
          mapDistance: 1113.1008195269301 / 24000,
          scorchHt: 39.580181786322299,
        },
        back: {
          ros: 0.39452649041938642,
          firelineIntensity: 8.2929003879841954,
          flameLength: 1.1907414731175683,
          distance: 23.671589425163184,
          mapDistance: 23.671589425163184/24000,
          scorchHt: 0.52018662032054752,
        },
        flank: {
          ros: 2.7053889424963877,
          firelineIntensity: 56.866957074505869,
          flameLength: 2.8870088099013929,
          distance: 162.32333654978328,
          mapDistance: 162.32333654978328 / 24000,
          scorchHt: 4.8023644521509334,
        },
        // beta: {
        //   ros: 2.6256648650882601,
        //   distance: 60 * 2.6256648650882601,
        //   mapDistance: 60 * 2.6256648650882601 / 24000,
        //   theta: 138.95912883244358,
        //   psi: 108.16241745554537,
        //   firelineIntensity: 22.809320529051977,
        //   flameLength: 1.8964622135871170,
        //   scorchHt: 1.6814949065754006,
        //   azimuth: {
        //     fromNorth: 45,
        //     fromUpslope: 45,
        //     fromFireHead, 360 - 42.573367385837855,
        //   },
        // },
        // beta5: {
        //   ros: 2.6256648650882601,
        //   distance: 60 * 2.6256648650882601,
        //   mapDistance: 60 * 2.6256648650882601 / 24000,
        //   firelienIntensity: beta5fli010,
        //   flameLength: beta5fl010,
        //   scorchHt: beta5scht010,
        //   azimuth: {
        //     fromNorth: 45,
        //     fromUpslope: 45,
        //     fromFireHead, 360 - 42.573367385837855,
        //   },
        // },
        // psi: {
        //   ros: 13.89777958366360,
        //   distance: 60 * 13.89777958366360,
        //   mapDistance: 60 * 13.89777958366360 / 24000,
        //   firelineIntensity: 292.12969090863300,
        //   flameLength: 6.12882661647451,
        //   scorchHt: 29.307635864149884,
        // },
      },  // ellipse
    },  // fire
  },  // surface
};
