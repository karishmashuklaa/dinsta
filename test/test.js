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
    let result, imageCount;
    const hash = '1234abcd';
    const description = 'Image Description';

    before(async () => {
      result = await dinsta.uploadImage(hash, description, { from: author })
      imageCount = await dinsta.imageCount()
    })

    // check from Event 
    it('Creates Images', async () => {
      assert.equal(imageCount, 1)
      // console.log(result.logs[0].args)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'ID is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, description, 'Description is correct')
      assert.equal(event.tipAmount, '0', 'Tip Amount is correct')
      assert.equal(event.author, author, 'Author is correct')

      // failure
      await dinsta.uploadImage('', description, { from: author }).should.be.rejected;
      await dinsta.uploadImage(hash, '', { from: author }).should.be.rejected;
    })

     // check from Struct 
     it('Lists Images', async () => {
      const image = await dinsta.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'ID is correct')
      assert.equal(image.hash, hash, 'Hash is correct')
      assert.equal(image.description, description, 'Description is correct')
      assert.equal(image.tipAmount, '0', 'Tip Amount is correct')
      assert.equal(image.author, author, 'Author is correct')
    })
    
  });
});
