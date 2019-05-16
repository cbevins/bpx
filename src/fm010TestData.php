<?php
class Benchmark_Fm10{
//--------------------------------------------------------------------------
    // INPUTS
    //--------------------------------------------------------------------------

    public function getAirTemp() { return 95.; }
    public function getAirTemperature() { return 95.; }
    public function getAspect() { return 180.; }
    public function getElapsedMinutes() { return 60.; }
    public function getMoistureDead1() { return 0.05; }
    public function getMoistureDead10() { return 0.07; }
    public function getMoistureDead100() { return 0.09; }
    public function getMoistureLiveHerb() { return 0.50; }
    public function getMoistureLiveStem() { return 1.50; }
    public function getSlope() { return 0.25; }
    public function getSlopeSteepness() { return 0.25; }
    public function getWindFrom() { return 270.0; }
    public function getWindSpeed() { return 10.0; }
    public function getWindSpeedAtMidflameHeight() { return 10.0; }

    //--------------------------------------------------------------------------
    // Fuel/Particle properties
    //--------------------------------------------------------------------------

    public function getParticleCount() { return 4; }
    public function getParticleDensity( $idx )
    {
        $data = array( 32., 32., 32., 32., 32. );
        return $data[$idx];
    }
    public function getParticleEffectiveHeatingNumber( $idx )
    {
        $data = array(
            0.93332668007820196,
            0.28194167776446499,
            0.010051835744633586,
            0.91210514954509037,
            0.91210514954509037,
        );
        return $data[$idx];
    }
    public function getParticleEffectiveMineralContent( $idx )
    {
        $data = array( 0.01, 0.01, 0.01, 0.01, 0.01 );
        return $data[$idx];
    }
    public function getParticleIsLive( $idx )
    {
        $data = array( false, false, false, true, true );
        return $data[$idx];
    }
    public function getParticleHeatContent( $idx )
    {
        $data = array( 8000., 8000., 8000., 8000., 8000. );
        return $data[$idx];
    }
    public function getParticleLoad( $idx )
    {
        $data = array( 0.138, 0.092, 0.230, 0.000, 0.092 );
        return $data[$idx];
    }
    public function getParticleSavr( $idx )
    {
        $data = array( 2000.,  109.,   30., 1500., 1500. );
        return $data[$idx];
    }
    public function getParticleSurfaceArea( $idx )
    {
        $data = array( 8.625000, 0.313375000, 0.215625000, 0.000, 4.3125000 );
        return $data[$idx];
    }
    public function getParticleSurfaceAreaWwtg( $idx )
    {
        $data = array(
            0.94221105527638194,
            0.034233668341708545,
            0.023555276381909549,
            0.000,
            1.000
        );
        return $data[$idx];
    }
    public function getParticleTotalMineralContent( $idx )
    {
        $data = array( 0.0555, 0.0555, 0.0555, 0.0555, 0.0555 );
        return $data[$idx];
    }

    //--------------------------------------------------------------------------
    // Fuel/Model properties
    //--------------------------------------------------------------------------

    public function getDeadMoistureOfExtinction() { return 0.25; }
    public function getFuelDepth() { return 1.0; }

    //--------------------------------------------------------------------------
    // FUEL BED INTERMEDIATES
    //--------------------------------------------------------------------------

    public function betaRatio() { return 2.3476224990480286; }
    public function bulkDensity() { return 0.552000; }
    public function c() { return 0.0022260828565431375; }
    public function deadArea() { return 9.1539999999999999; }
    public function deadAwtg() { return 0.67976088812980362; }
    public function deadEtas() { return 0.41739692790939131; }
    public function deadFine() { return 0.15704963842638839; }
    public function deadFuel() { return $this->load(0)+$this->load(1)+$this->load(2); }
    public function deadHeat() { return 8000.000; }
    public function deadHerbLoad() { return 0.; }
    public function deadLoad() { return 0.13859233668341708; }
    public function deadRxK () { return 5539.9575948899355; }
    public function deadSavr() { return 1888.8602386934672; }
    public function deadSeff() { return 0.010000000000000000; }
    public function deadStot() { return 0.0555000; }
    public function deadSwtg( $idx )
    {
        $data = array(
            0.94221105527638194,
            0.000,
            0.034233668341708545,
            0.000,
            0.023555276381909549,
            0.000
        );
        return $data[$idx];
    }
    public function e() { return 0.37951243437053556; }
    public function herbCured() { return 0.; }
    public function gammaOpt() { return 12.674359628667819; }
    public function gammaExp() { return 0.35878365060452616; }       // this is 'aa'
    public function gammaMax() { return 15.133318877566580; }
    public function liveArea() { return 4.3125000000000000; }
    public function liveAwtg() { return 0.32023911187019644; }
    public function liveEtas() { return 0.41739692790939131; }
    public function liveFine() { return 0.065920880572788609; }
    public function liveFuel() { return $this->load(3)+$this->load(4); }
    public function liveHeat() { return 8000.000; }
    public function liveHerbLoad() { return 0.; }
    public function liveLoad() { return 0.091999999999999998; }
    public function liveMextK() { return 6.9089482342948010; }
    public function liveRxK () { return 3677.5200629895871; }
    public function liveSavr() { return 1500.0000000000000; }
    public function liveSeff() { return 0.010000000000000000; }
    public function liveStot() { return 0.0555000; }
    public function liveSwtg( $idx )
    {
        $data = array( 1.0, 0., 0., 0., 0., 0 );
        return $data[$idx];
    }
    public function optimumPackingRatio() { return 0.0073478593798598172; }
    public function packingRatio() { return 0.01725000000000000; }
    public function propagatingFluxRatio() { return 0.048317062998571636; }
    public function sigma() { return 1764.3319812126388; }
    public function sigma15() { return 74108.915800396862; }
    public function slopeK() { return 17.83141198; }
    public function swtg( $idx )
    {
        $data = array(
            0.94221105527638194,
            0.034233668341708545,
            0.023555276381909549,
            1.000,
            1.000
        );
        return $data[$idx];
    }
    public function taur() { return 0.21764611427384198; }
    public function totalArea() { return 13.46650000000000; }
    public function totalHerbLoad() { return 0.; }
    public function totalLoad() { return 0.5520000; }
    public function windB() { return 1.4308256324729873; }      // BP m_windB
    public function windC() { return 0.0022260828565431375; }   // BP c
    public function windE() { return 0.37951243437053556; }     // BP e
    public function windK() { return 0.0016102128596515481; }   // BP m_windK
    public function windI() { return 621.03590466691537; }      // BP m_windE

    //--------------------------------------------------------------------------
    // HEAT SINK
    //--------------------------------------------------------------------------
    public function deadEtam() { return 0.65206408989980214; }
    public function deadFineMois() { return 0.053892078848839550; }
    public function deadMois() { return 0.051626884422110553; }
    public function liveEtam() { return 0.59341294014849078; }
    public function liveMext() { return 5.1935979022741359; }
    public function liveMois() { return 1.5000000000000000; }
    public function qig() { return $this->rbQig() / $this->bulkDensity(); }
    public function rbQig() { return 412.34037227937284; }
    public function wfmd() { return 0.0084637314972566650; }

    //--------------------------------------------------------------------------
    // FIRE BEHAVIOR
    //--------------------------------------------------------------------------
    public function deadRxInt() { return 3612.4074071954024; }
    public function dirMaxRos() { return 87.573367385837855; }
    public function effWind() { return 880.55194372010692; }
    public function liveRxInt() { return 2182.2879930337140; }
    public function phiEw() { return 26.321715915373524; }
    public function phiS() { return 1.1144632487759358; }
    public function phiW() { return 26.298112107312534; }
    public function ros0() { return 0.67900860922904482; }
    public function rosMax() { return 18.551680325448835; }
    public function rxInt() { return 5794.6954002291168; }
    public function windLimitReached() { return false; }
    public function windSpeedLimit() { return 5215.2258602062057; }

    public function hpua() { return 1261.192937; }
    public function fliAtHead() { return 389.954137; }
    public function flameAtHead() { return 6.999689; }
    public function lwRatio() { return 3.501568; }
    public function rxi() { return 5794.695400; }
    public function scorchAtHead() { return 39.580182; }
    public function waf() { return 1.000000; }

    public function headDistance() { return 1113.100820; }
    public function flankDistance() { return 162.3233337; }
    public function backDistance() { return 23.671589; }
    public function fireLength() { return 1136.772409; }
    public function fireWidth() { return 324.646673; }
    public function fireArea() { return 289850.691417; }
    public function firePerimeter() { return 2476.240100; }
}
