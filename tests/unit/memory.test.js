const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
} = require('../../src/model/data/memory');

describe('Fragment memory database', () => {
  test('readFragment(). Read a fragment from non-existent user.', async () => {
    const result = await readFragment('fake', 'user');
    expect(result).toEqual(undefined);
  });
  test('writeFragment(). Create a fragment that is saved, then use readFragment() to retrieve it.', async () => {
    const data = {
      ownerId: 'user',
      id: '123',
      type: 'text/plain',
      size: 10,
    };
    await writeFragment(data);
    const result = await readFragment(data.ownerId, data.id);
    expect(result).toEqual(data);
  });
  test('readFragmentData() read fragment data that does not exist', async () => {
    const result = await readFragmentData('user', '123');
    expect(result).toEqual(undefined);
  });
  test('writeFragmentData(). create fragment data, then read it', async () => {
    const data = {
      ownerId: 'user',
      id: '123',
    };
    const buffer = Buffer.from('Hello World');

    await writeFragmentData(data.ownerId, data.id, buffer);
    const result = await readFragmentData(data.ownerId, data.id);
    expect(result).toEqual(buffer);
  });
});
