const Dinsta = artifacts.require('../src/contracts/Dinsta.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Dinsta', ([deployer, author, tipper]) => {
  let dinsta;

  before(async () => {
    dinsta = await Dinsta.deployed();
  });

  describe('Deployment of Contract', async () => {
    it('Deploys successfully', async () => {
      const address = await dinsta.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('Contract has a name', async () => {
      const name = await dinsta.name();
      assert.equal(name, 'Dinsta');
    });
  });

  describe('Images', async () => {
    let result;

    it('Test Creation of Images', async () => {
      result = await dinsta.uploadImage();
      let image = await dinsta.images(1);
      console.log(image);
    });
    
  });

});
