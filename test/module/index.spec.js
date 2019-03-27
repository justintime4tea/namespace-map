/* eslint-disable no-unused-expressions */
const NamespaceMap = require('../../index');

describe('NamespaceMapMap', () => {
  it('should have a constructor', () => {
    NamespaceMap.prototype.constructor.should.exist;
  });
  describe('#constructor', () => {
    it('should have a map at the root of the namespace', () => {
      const map = new Map();
      const namespaceMap = new NamespaceMap();
      namespaceMap.namespace.should.deep.equal(map);
    });

    it('should optionally seed itself when a map is provided', () => {
      const map = new Map().set('foo', 'bar');
      const namespaceMap = new NamespaceMap(map);
      namespaceMap.namespace.should.deep.equal(map);
    });
  });

  describe('#add', () => {
    it('should create a nested map structure', () => {
      const expectedMap = new Map()
        .set('com', new Map()
          .set('justin', new Map()
            .set('tools', new Map()
              .set('#', 'SHOVEL')
            )
          )
        );
      const namespaceMap = new NamespaceMap();
      namespaceMap.add('SHOVEL', 'com.justin.tools');
      namespaceMap.namespace.should.deep.equal(expectedMap);
    });
  });

  describe('#get', () => {
    const seedMap = new Map()
      .set('com', new Map()
        .set('justin', new Map()
          .set('tools', new Map()
            .set('shovel', new Map()
              .set('#', 'SHOVEL_INTERFACE')
            )
          )
        )
      );

    it('should return all elements at the given namespace', () => {
      const namespaceMap = new NamespaceMap();
      namespaceMap.namespace = seedMap;
      const shovel = namespaceMap.get('com.justin.tools.shovel');
      shovel.should.equal('SHOVEL_INTERFACE');
    });
  });

  describe('#delete', () => {
    // eslint-disable-next-line max-len
    it('should delete the value at the end of the namespace and cleanup empties', () => {
      const namespaceMap = new NamespaceMap();
      namespaceMap.namespace = new Map()
        .set('com', new Map()
          .set('justin', new Map()
            .set('tools', new Map()
              .set('#', 'SHOVEL')
            )
          )
        );

      namespaceMap.delete('com.justin.tools');
      namespaceMap.namespace.should.deep.equal(new Map());
    });
  });
});
