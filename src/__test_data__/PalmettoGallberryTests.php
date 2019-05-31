<?php
require_once 'bootstrap.php';
require_once 'BaseModuleTest.php';

class FuelModelPalmettoGallberryTest extends BaseModuleTest
{
    protected function setUp(){ parent::setUp(); }
    protected function tearDown() { parent::tearDown(); }
    public function __construct() { }
    /**
     *
     */
    public function testFuelModelPalmettoGallberryMode()
    {
        $name = 'WFBC';
        $simulator = new \Sem\Experimental\Simulator( $name );
        $dic = $simulator->getDictionary();
        $cfg = $simulator->getConfiguration();
        $cfg->setValue( 'FuelModelModule/Mode', 'palmetto-gallberry' );

        $dag = $simulator->createDag();
        $dag->resolveInputItems();
        $inputItems = $dag->getInputItems();
        $this->assertEquals( 4, count( $inputItems ), __LINE__ );

        $model = 'FuelModel/';
        $age = 10.;
        $coverage = 0.5;
        $height = 6.;
        $basal = 80.;

        $dag->setValue( $model.'PalmettoGallberry/AgeOfRough', $age );
        $dag->setValue( $model.'PalmettoGallberry/Coverage', $coverage );
        $dag->setValue( $model.'PalmettoGallberry/Height', $height );
        $dag->setValue( $model.'PalmettoGallberry/OverstoryBasalArea', $basal );
        $dag->update();

        $this->assertEquals( 'pg', $dag->getValue( $model.'Code' ), __LINE__ );
        $this->assertEquals( '', $dag->getValue( $model.'ParametersString' ), __LINE__ );
        $this->assertEquals( 26, count( $dag->getValue( $model.'ParticleCollection' ) ), __LINE__ );
        $this->assertEquals( $age, $dag->getValue( $model.'PalmettoGallberry/AgeOfRough' ), __LINE__ );
        $this->assertEquals( $coverage, $dag->getValue( $model.'PalmettoGallberry/Coverage' ), __LINE__ );
        $this->assertEquals( $height, $dag->getValue( $model.'PalmettoGallberry/Height' ), __LINE__ );
        $this->assertEquals( $basal, $dag->getValue( $model.'PalmettoGallberry/OverstoryBasalArea' ), __LINE__ );
        $this->assertEquals( 0.4, $dag->getValue( $model.'DeadCategory/MoistureContentOfExtinction' ), __LINE__ );
        // Calculate derived fuel particle properties
        $loadDead1 = -0.00121 + ( 0.00379 * log( $age ) ) + ( 0.00118 * $height * $height );
        $loadDead1 = max( 0., $loadDead1 );

        $loadDead2 = -0.00775 + ( 0.00021 * $coverage ) + ( 0.00007 * $age * $age );
        $loadDead2 = max( 0., $loadDead2 );

        $loadDeadLeaf = 0.00221 * pow( $age, 0.51263  ) * exp( 0.02482 * $coverage );
        $loadDeadLeaf = max( 0., $loadDeadLeaf );

        $loadLitter = ( 0.03632 + 0.0005336 * $basal ) * ( 1.0 - pow( 0.25, $age ) );
        $loadLitter = max( 0., $loadLitter );

        $loadLiveLeaf = -0.0036 + ( 0.00253 * $age ) + ( 0.00049 * $coverage )
        + ( 0.00282 * $height * $height );
        $loadLiveLeaf = max( 0., $loadLiveLeaf );

        $loadLive1 = 0.00546 + ( 0.00092 * $age ) + ( 0.00212 * $height * $height );
        $loadLive1 = max( 0., $loadLive1 );

        $loadLive2 = -0.02128 + ( 0.00014 * $age * $age ) + ( 0.00314 * $height * $height );
        $loadLive2 = max( 0., $loadLive2 );

        $depth = 2. * $height / 3.;

        $this->assertEquals( $depth, $dag->getValue( $model.'FuelDepth' ), __LINE__ );
        $this->assertEquals( $loadDead1, $dag->getValue( $model.'ParticleCollection' )['PalmettoGallberry/DeadSizeClass1']['OvendryFuelLoad'], __LINE__ );
        $this->assertEquals( $loadDead2, $dag->getValue( $model.'ParticleCollection' )['PalmettoGallberry/DeadSizeClass2']['OvendryFuelLoad'], __LINE__ );
        $this->assertEquals( $loadDeadLeaf, $dag->getValue( $model.'ParticleCollection' )['PalmettoGallberry/DeadFoliage']['OvendryFuelLoad'], __LINE__ );
        $this->assertEquals( $loadLitter, $dag->getValue( $model.'ParticleCollection' )['PalmettoGallberry/DeadLitter']['OvendryFuelLoad'], __LINE__ );
        $this->assertEquals( $loadLive1, $dag->getValue( $model.'ParticleCollection' )['PalmettoGallberry/LiveSizeClass1']['OvendryFuelLoad'], __LINE__ );
        $this->assertEquals( $loadLive2, $dag->getValue( $model.'ParticleCollection' )['PalmettoGallberry/LiveSizeClass2']['OvendryFuelLoad'], __LINE__ );
        $this->assertEquals( $loadLiveLeaf, $dag->getValue( $model.'ParticleCollection' )['PalmettoGallberry/LiveFoliage']['OvendryFuelLoad'], __LINE__ );
    }
}