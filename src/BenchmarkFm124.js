export const BenchmarkFm124In = {
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
          key: '124',
        },
      },
    },
  },
};

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
        },
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
        },
        fire: {
          direction: {
            slopeRos: null,
            windRos: null,
            vectorRos: null,
            xComp: null,
            yComp: null,
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
          distance: 2908.225560,
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
          scorchHt: 215.682771,
          // ellipse: {
          //   area: 1978607.419499,
          //   length: 2970.072383,
          //   perimeter: 6469.728229;
          //   width: 848.208733,
          //   head: {
          //     distance: 2908.225560,
          //   },
          //   flank: {
          //     distance: 424.104367,
          //   },
          //   back: {
          //     distance: 61.846824,
          //   },
          // }
        },  // fire
      },  // primary
    },  // fuel
  },  // surface
};
