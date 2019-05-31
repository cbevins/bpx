<?php
require_once 'bootstrap.php';

/**
 * Chaparral test case.
 */
class ChaparralTest extends PHPUnit_Framework_TestCase
{
    private $app = null;
    private $catalog = null;
    private $factory = null;

    /**
     * Prepares the environment before running a test.
     */
    protected function setUp()
    {
        parent::setUp();
        $this->app = new \Sem\Behave\Application\BehaveApp();
        $this->catalog = $this->app->getFuelCatalog();
        $this->factory = $this->app->getFactory();
    }

    /**
     * Cleans up the environment after running a test.
     */
    protected function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Constructs the test case.
     */
    public function __construct()
    {  }

    /**
     * Tests Chaparral->__construct()
     */
    public function test__construct()
    {
        $chaparral = $this->factory->createModelFuelChaparral();
        $chaparral->setCode( 'cch' )
            ->setlabel( 'Chaparral - Chamise' )
            ->setNumber( 901 )
            ->setAgeFactor( 7.5 )
            ->setDeadHeat( 8000. )
            ->setDeadMext( 0.30 )
            ->setLoadFactor( 0.0347 )   // Cohen's value from FIRECAST
            ->setLoadOffset( 1.4459 );
        $chamise = $chaparral->createFuelModel( array( 'deadFraction'=>0.5, 'depth'=>6.0 ) );
        $this->assertEquals( 'Chaparral', $chaparral->getType(), __LINE__ );
        $this->assertEquals( 6.0, $chaparral->getDepth(), __LINE__ );
        $this->assertEquals( 0.5, $chaparral->getDeadFraction(), __LINE__ );
        $this->assertEquals( 33.0830062109, $chaparral->getAge(), __LINE__ );
        $this->assertEquals( 0.5855947273, $chaparral->getLoad(), __LINE__ );
        $this->assertEquals( 0.2927973636, $chaparral->getLoadDead(), __LINE__ );
        $this->assertEquals( 0.2927973636, $chaparral->getLoadLive(), __LINE__ );
        $this->assertEquals( 0.1016006852, $chaparral->getLoadDead1(), __LINE__ );
        $this->assertEquals( 0.1065782404, $chaparral->getLoadDead2(), __LINE__ );
        $this->assertEquals( 0.0606090543, $chaparral->getLoadDead3(), __LINE__ );
        $this->assertEquals( 0.0240093838, $chaparral->getLoadDead4(), __LINE__ );
        $this->assertEquals( 0.0252976922, $chaparral->getLoadLeaf(), __LINE__ );
        $this->assertEquals( 0.0665235610, $chaparral->getLoadLive1(), __LINE__ );
        $this->assertEquals( 0.0373609436, $chaparral->getLoadLive2(), __LINE__ );
        $this->assertEquals( 0.1404256156, $chaparral->getLoadLive3(), __LINE__ );
        $this->assertEquals( 0.0231895512, $chaparral->getLoadLive4(), __LINE__ );

        $chaparral->setCode( 'cmb' )
             ->setlabel( 'Chaparral - Mixed Brush' )
            ->setNumber( 902 )
            ->setAgeFactor( 10.0 )
            ->setDeadHeat( 8000. )
            ->setDeadMext( 0.30 )
            ->setLoadFactor( 0.0170 )
            ->setLoadOffset( 0.4849 );
        $mixed = $chaparral->createFuelModel( array( 'deadFraction'=>0.5, 'depth'=>6.0 ) );
        $this->assertEquals( 'Chaparral', $chaparral->getType(), __LINE__ );
        $this->assertEquals( 6.0, $chaparral->getDepth(), __LINE__ );
        $this->assertEquals( 0.5, $chaparral->getDeadFraction(), __LINE__ );
        $this->assertEquals( 20.7022002273, $chaparral->getAge(), __LINE__ );
        $this->assertEquals( 1.1358410120, $chaparral->getLoad(), __LINE__ );
        $this->assertEquals( 0.5679205060, $chaparral->getLoadDead(), __LINE__ );
        $this->assertEquals( 0.5679205060, $chaparral->getLoadLive(), __LINE__ );
        $this->assertEquals( 0.1970684156, $chaparral->getLoadDead1(), __LINE__ );
        $this->assertEquals( 0.2067230642, $chaparral->getLoadDead2(), __LINE__ );
        $this->assertEquals( 0.1175595447, $chaparral->getLoadDead3(), __LINE__ );
        $this->assertEquals( 0.0465694815, $chaparral->getLoadDead4(), __LINE__ );
        $this->assertEquals( 0.0490683317, $chaparral->getLoadLeaf(), __LINE__ );
        $this->assertEquals( 0.1290315390, $chaparral->getLoadLive1(), __LINE__ );
        $this->assertEquals( 0.0724666566, $chaparral->getLoadLive2(), __LINE__ );
        $this->assertEquals( 0.2723746747, $chaparral->getLoadLive3(), __LINE__ );
        $this->assertEquals( 0.0449793041, $chaparral->getLoadLive4(), __LINE__ );

        $bed = $chaparral->createFuelBed( array( 'deadFraction'=>0.5, 'depth'=>6.0 ) );
        $complex = $chaparral->createFuelComplex( array( 'deadFraction'=>0.5, 'depth'=>6.0 ) );
        $surface = $chaparral->createSurfaceFireSpread( array( 'deadFraction'=>0.5, 'depth'=>6.0 ) );
        $crown = $chaparral->createCrownFireSpread( array( 'deadFraction'=>0.5, 'depth'=>6.0 ) );
    }
}
