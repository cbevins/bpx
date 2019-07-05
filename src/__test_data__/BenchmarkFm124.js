import BpxLibSurfaceFire from '../BpxLibSurfaceFire';

const beta5fli124 = 2467.9286450361865 * 6.8494531181657319 / 48.470425993990560;
const beta5fl124  = 0.45 * Math.pow(beta5fli124, 0.46);
const beta5scht124 = BpxLibSurfaceFire.scorchHt(beta5fli124, 880, 95);

export const BenchmarkFm124In = {
  configs: {
    fire: {
      ewsLimit: 'applied',
      weightingMethod: 'harmonic',
      vector: 'fromNorth',
    },
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
    fire: {
      time: {
        sinceIgnition: 60,
      },
      vector: {
        fromNorth: 45,
      },
    },
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
    temperature: {
      air: 95,
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
          key: '124',
        },
      },
    },
  },  // surface
}

export const BenchmarkFm124Out = {
  surface: {
    fuel: {
      primary: {
        bed: {
          area: 29.062930440771346,
          bulkDensity: 0.27985482530937067,
          depth: 2.1,
          domain: 'behave',
          heatPreignition: 319.21640437931171 / 0.27985482530937067,
          heatSink: 319.21640437931171,
          load: null,
          openWaf: null,
          packingRatio: 0.0087454632909178334,
          packingRatioOptimum: 0.0078357185983373434,
          packingRatioRatio: 1.1161022669667500,
          propagatingFluxRatio: 0.035258653482453904,
          reactionIntensity: 12976.692888496578,
          reactionVelocityExp: 0.38177694461561407,
          reactionVelocityMax: 14.944549319976806,
          reactionVelocityOpt: 14.908876941781589,
          ros0: 1.4333245773924823,
          savr: 1631.1287341340956,
          savr15: null,
          dead: {
            area: 11.030790863177224,
            awtg: 0.37954847277556436,
            efld: null,
            efwl: 0.0098866289779641001,
            efmc: 0.050405399380187531,
            heat: 8000,
            load: null,
            //loadWtd: 0.20777819078484744,  // wtd
            mext: 0.4,
            mineralDamping: 0.41739692790939131,
            mois: 0.050100676116867547,
            moistureDamping: 0.74884711762612932,
            pprc: null,
            qign: null,
            rxi: 7316.0935560142625,
            rxiDry: 9769.8093293148086,
            savr: 1682.0151742581315,
            seff: 0.01,
            // swtg: [0.99535641166386157, 0.0, 0.0042533708289000296, 0.0, 0.00039021750723853486, 0.0],
            wnet: (1 - 0.0555) * 0.20777819078484744,
            particle: {
              class1: {
                area: 4.9070247933884286, // 1-h
                awtg: 0.44484795825192963, // 1-h
                load: 1.9 * 2000 / 43560,
                mois: 0.05,
                swtg: 0.99535641166386157,
              },
              class2: {
                area: 0.046918044077134985, // 10-h
                awtg: 0.0042533708289000296, // 10-h
                load: 0.3 * 2000 / 43560,
                mois: 0.07,
                swtg: 0.0042533708289000296,
              },
              class3: {
                area: 0.0043044077134986227, // 100-h
                awtg: 0.00039021750723853486, // 100-h
                load: 0.1 * 2000 / 43560,
                mois: 0.09,
                swtg: 0.00039021750723853486,
              },
              class4: { // cured herb
                area: 6.0725436179981624, // cured herb
                awtg: 0.55050845341193189,
                load: 0.12145087235996324,
                mois: 0.05,
                swtg: 0.99535641166386157,
              },
            },
          }, // dead
          live: {
            area: 18.032139577594119,
            awtg: 0.62045152722443553,
            efld: null,
            efwl: null,
            efmc: null,
            heat: 8000,
            //load: 0.034655647382920124,
            load: 0.36064279155188239,
            mineralDamping: 0.41739692790939131,
            mois: 1.4039058919386871,
            moistureDamping: 0.33380976126895767,
            pprc: null,
            qign: null,
            rxi: 5660.5993324823157,
            //herbLoad: 0.034655647382920124,
            mext: 1.6581421656244677,
            mxtk: 2.1558023634049093,
            rxiDry: 16957.560830348066,
            savr: 1600,
            seff: 0.01,
            wnet: (1 - 0.0555) * 0.36064279155188239,
            particle: {
              class1: { // live herb
                area: 1.7327823691460063, // live herb
                awtg: 0.096094108061312897,
                load: 0.034655647382920124,
                mois: 0.5,
                savr: 1600,
                swtg: 1,
              },
              class2: { // live stem
                area: 16.299357208448114, // live stem
                awtg: 0.90390589193868720,
                load: 7.1 * 2000 / 43560,
                mois: 1.5,
                savr: 1600,
                swtg: 1,
              },
            },
          }, // live
        },  // bed
        model: {
          key: '124',
          domain: 'behave',
          behave: {
            parms: {
              curedHerbFraction: 0.778,
              depth: 2.1,
              deadMext: 0.4,
              dead1Load: 1.9 * 2000 / 43560,
              dead10Load: 0.3 * 2000 / 43560,
              dead100Load: 0.1 * 2000 / 43560,
              liveStemLoad: 7.1 * 2000 / 43560,
              totalHerbLoad: 3.4 * 2000 / 43560,
              dead1Savr: 1800,
              liveHerbSavr: 1600,
              liveStemSavr: 1600,
              deadHeat: 8000,
              liveHeat: 8000,
            },
          },
        },  // model
        fire: {
          direction: {
            slopeRos: 1.9584486222621447,
            windRos: 46.996312501163828,
            vectorRos: 47.037101416598077,
            xComp: 1.9584486126230398,
            yComp: 46.996312501163828,
          },
          limit: {
            ews: 11679.023599646920,
            phi: null,
            ros: null,
          },
          slope: {
            k: 21.861885612259275,
            phi: 1.3663678507662047,
            ratio: 0.25,
          },
          wind: {
            atMidflame: 880,
            b: 1.3714405772749918,
            c: 0.0031370920040753444,
            e: 0.39810163107222579,
            headingFromUpslope: 90,
            k: 0.0030028678448152332,
            i: 333.01498823086911,
            phi: 32.788325298000515,
            waf: 1,
          },
          effectiveWindSpeed: 880.55684333220040,
          firelineIntensity: 2467.928645,
          flameLength: 16.356317,
          flameResidenceTime: 0.23541979977677915,
          headingFromUpslope: 87.613728665173383,
          heatPerUnitArea: 12976.692888496578 * 0.23541979977677915, // about 3054.970442,
          lengthToWidthRatio: 3.501582,
          phiEw: 32.816782854703028,
          reactionIntensity: 12976.692888496578,
          ros: 48.470425993990560,
          ros0: 1.4333245773924823,
        },  // fire
      },  // primary
    },  // fuel
    fire: {
      weighted: {
        effectiveWindSpeed: 880.55684333220040,
        effectiveWindSpeedExceeded: false,
        effectiveWindSpeedLimit: 11679.023599646920,
        firelineIntensity: 2467.928645,
        flameLength: 16.356317,
        headingFromUpslope: 87.613728665173383,
        heatPerUnitArea: 12976.692888496578 * 0.23541979977677915, // about 3054.970442,
        lengthToWidthRatio: 3.501582,
        primaryCover: 1,
        reactionIntensity: 12976.692888496578,
        ros: 48.470425993990560,
        rosArithmetic: 48.470425993990560,
        rosExpected: 48.470425993990560,
        rosHarmonic: 48.470425993990560,
        waf: 1,
      },
      ellipse: {
        axis: {
          eccentricity: 0.95835332217217739,
          lengthToWidthRatio: 3.5015819412846603,
          major: 1.0307803973340242 + 48.470425993990560,
          minor: 2 * 7.0684061120619655,
          f: 1485.0361917397374 / 60.,
          g: 1423.1893678996960 / 60.,
          h: 424.10436672371787 / 60.,
        },
        size: {
          area: [45.422576205218135*(66.*660.), 6],
          length: 2970.0723834794749,
          perimeter: 6469.7282289420209,
          width: 848.20873344743575,
        },
        map: {
          area: 45.422576205218135*(66.*660.) / 24000 / 24000,
          length: 2970.0723834794749 / 24000,
          perimeter: 6469.7282289420209 / 24000,
          width: 848.20873344743575 / 24000,
        },
        head: {
          ros: 48.470425993990560,
          firelineIntensity: 2467.9286450361865,
          flameLength: 16.356316633171140,
          distance: 2908.2255596394334,
          mapDistance: 2908.2255596394334 / 24000,
          scorchHt: null,
        },
        back: {
          ros: 1.0307803973340242,
          firelineIntensity: 52.483394093499705,
          flameLength: 2.7824194067294856,
          distance: 61.846823840041452,
          mapDistance: 61.846823840041452 / 24000,
          scorchHt: 4.3824121071933915,
        },
        flank: {
          ros: 7.0684061120619655,
          firelineIntensity: 359.89619544220318,
          flameLength: 6.7461198324614715,
          distance: 424.10436672371793,
          mapDistance: 424.10436672371793 / 24000,
          scorchHt: 36.440372402518008,
        },
        vector: {
          fromHead: 360 - 42.613728665173383,
          fromNorth: 45,
          fromUpslope: 45,
        },
        beta: {
          ros: 6.8494531181657319,
          distance: 60 * 6.8494531181657319,
          mapDistance: 60 * 6.8494531181657319 / 24000,
          theta: 138.99842626716800,
          psi: 108.18586769434800,
          firelineIntensity: 144.22374220988746,
          flameLength:4.4296501098298906,
          scorchHt: 13.669401441568459,
        },
        beta5: {
          ros: 6.8494531181657319,
          distance: 60 * 6.8494531181657319,
          mapDistance: 60 * 6.8494531181657319 / 24000,
          firelineIntensity: beta5fli124,
          flameLength: beta5fl124,
          scorchHt: beta5scht124,
        },
        psi: {
          ros: 36.28927049813540,
          distance: 60 * 36.28927049813540,
          mapDistance: 60 * 36.28927049813540 / 24000,
          firelineIntensity: 1847.7108119684900,
          flameLength: 14.31739984718150,
          scorchHt: [169.80644998818718, 6],
        },
      },  // ellipse
    },  // fire
  },  // surface
};
