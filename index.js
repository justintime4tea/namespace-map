/**
 * An extended Map that facilitates storing things at a given 'namespace'
 * very much like in C#, Java, C, or any other language which has the
 * concept of namespaces.
 *
 * Example, lets say you wanted to store Foo, Bar and Baz at the namespace
 * com.fake.things. You could do that! when pulling the value for things at
 * the namespace com.fake.things you would receive your three things.
 */
class NamespaceMap {
  /**
   * Constructs a new NamespaceMap
   *
   * @param {Map} namespace A map to seed the namespace map with.
   */
  constructor(namespace) {
    /**
     * The root of the NamespaceMaps namespace.
     * @type Map
     */
    this.namespace = namespace instanceof Map ? namespace : new Map();
  }

  /**
   * Add something to the given namespace. The namespace is created if it
   * does not already exist.
   *
   * @param {any} value The thing we are placing within the namespace.
   * @param {string} namespace The namespace where value will be placed.
   * @returns {NamespaceMap} Returns this instance of NamespaceMap.
   */
  add(value, namespace) {
    // TODO: Ensure no # are used in namespace.
    // FIXME: Restrict namespaces to a-Z0-9 and .
    const keys = namespace.split('.');
    let currentMap = this.namespace;

    for (const [index, entry] of keys.entries()) {
      const end = index === keys.length - 1;

      let nextMap;

      if (!currentMap.has(entry)) {
        nextMap = new Map();
        if (end) {
          nextMap.set('#', value);
        }
        currentMap.set(entry, nextMap);
      } else {
        nextMap = currentMap.get(entry);
        if (end) {
          nextMap.set('#', value);
        }
      }

      if (end) {
        break;
      }

      currentMap = nextMap;
    }
    return this;
  }

  /**
   * Gets what is stored at a given namespace.
   *
   * @param {string} namespace The namespace of where to locate the desired
   * thing.
   * @returns {any|null} Returns either the value at the given namespace or null
   * if it could not be found.
   */
  get(namespace) {
    const keys = namespace.split('.');
    let currentMap = this.namespace;

    if (!currentMap.has(keys[0])) {
      return null;
    }

    for (const [index, entry] of keys.entries()) {
      const end = index === keys.length - 1;

      if (end && entry === '*') {
        return new NamespaceMap(currentMap);
      }

      if (currentMap instanceof Map) {
        const nextMap = currentMap.get(entry);

        if (nextMap) {
          currentMap = nextMap;
          if (end) {
            if (currentMap instanceof Map) {
              const value = currentMap.get('#');
              if (value) {
                return value;
              }
              return new NamespaceMap(currentMap);
            }
          }
        } else {
          // Found nothing at that namespace.
          return null;
        }
      } else if (entry !== '#') {
        return null;
      }
    }
    return currentMap;
  }

  /**
   * Delete the value at the given namespace and all empty nodes.
   *
   * @param {string} namespace The namespace of where to find the
   * thing to delete.
   * @returns {NamespaceMap} Returns this instance of NamespaceMap.
   */
  delete(namespace) {
    // TODO: Ensure no # are used in namespace.
    // FIXME: Restrict namespaces to a-Z0-9 and .
    const keys = namespace.split('.');
    let currentMap = this.namespace;

    if (!currentMap.has(keys[0])) {
      return this;
    }

    const processedNodes = [];

    for (const [index, entry] of keys.entries()) {
      const end = index === keys.length - 1;

      const nextMap = currentMap.get(entry);

      if (!end) {
        if (!nextMap || !(nextMap instanceof Map)) {
          break;
        }

        currentMap = nextMap;
        processedNodes.push(entry);
        continue;
      }

      if (nextMap instanceof Map) {
        nextMap.delete('#');

        if (nextMap.size === 0) {
          currentMap.delete(entry);
          processedNodes.push(entry);
        }
      } else {
        currentMap.delete(entry);
      }

      if (currentMap.size === 0) {
        this.delete(processedNodes.join('.'));
        break;
      }
    }

    return this;
  }
}

module.exports = NamespaceMap;
